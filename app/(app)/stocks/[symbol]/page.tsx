"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  useGetHistoryQuery,
  useGetStockQuery,
  useGetMarketBiasQuery,
  useGetStockSummaryQuery,
} from "@/redux/api/stocksApi";
import {
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "@/redux/api/watchlistApi";
import { useCreateAlertMutation } from "@/redux/api/alertsApi";
import type { AlertConfig } from "@/lib/alerts";
import ConfidenceRing from "@/components/ConfidenceRing";
import AlertModal from "@/components/AlertModal";
import CompanyLogo from "@/components/CompanyLogo";
import Tip from "@/components/Tip";
import { Icon } from "@/components/icons";
import Skeleton from "@/components/Skeleton";
import { Change, signalTone, usd } from "@/components/ui";
import type { Range, Signal } from "@/redux/type";

const ranges: Range[] = ["1D", "1W", "1M", "1Y"];

export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [range, setRange] = useState<Range>("1M");
  const [alertOpen, setAlertOpen] = useState(false);
  const [note, setNote] = useState("");

  const { data: stock, isLoading, isError } = useGetStockQuery(symbol);
  const { data: hist = [] } = useGetHistoryQuery({ symbol, range });
  const { data: marketBias = [] } = useGetMarketBiasQuery();
  const { data: summary } = useGetStockSummaryQuery(symbol, { skip: !stock || stock.price === null });
  const { data: watchlist = [] } = useGetWatchlistQuery();
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [createAlert] = useCreateAlertMutation();

  const inList = watchlist.some((s) => s.symbol === symbol.toUpperCase());

  const toggleWatchlist = async () => {
    try {
      if (inList) {
        await removeFromWatchlist(symbol.toUpperCase()).unwrap();
        toast.success(`Removed ${symbol.toUpperCase()} from watchlist.`);
      } else {
        await addToWatchlist(symbol.toUpperCase()).unwrap();
        toast.success(`Added ${symbol.toUpperCase()} to watchlist!`);
      }
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not update watchlist.";
      setNote(msg);
      toast.error(msg);
    }
  };

  const handleAlert = async (c: AlertConfig) => {
    if (!stock) return;
    const conditions: Record<string, unknown> = {};
    if (c.price !== undefined) conditions.price = c.price;
    if (c.breakout !== undefined) conditions.breakout = c.breakout;
    if (c.signal !== undefined) conditions.signal = c.signal;
    if (c.volume !== undefined) conditions.volume = c.volume;
    try {
      await createAlert({ symbol: stock.symbol, conditions: conditions as Parameters<typeof createAlert>[0]["conditions"], channels: { email: c.email, push: c.push, discord: c.discord } }).unwrap();
      setAlertOpen(false);
      const msg = `Alert set for ${stock.symbol}. You can manage it on the Alerts page.`;
      setNote(msg);
      toast.success(msg);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not create alert.";
      setNote(msg);
      toast.error(msg);
    }
  };

  if (isLoading) return (
    <div className="space-y-6"><Skeleton className="h-20" />
      <div className="stagger grid gap-6 lg:grid-cols-3"><Skeleton className="h-60" /><Skeleton className="h-60" /><Skeleton className="h-60" /></div>
      <Skeleton className="h-80" /></div>
  );
  if (isError || !stock) return <p className="text-down">We could not find {symbol.toUpperCase()}. Try a symbol like AAPL or MSFT.</p>;

  const sc = stock.confidence ?? 0;
  const p = stock.changePct ?? 0;
  const up = (stock.change ?? 0) >= 0;
  const rows = [
    { label: "Support", v: stock.support, dot: "bg-up", text: "text-up", tip: true },
    { label: "Resistance", v: stock.resistance, dot: "bg-down", text: "text-down", tip: true },
    { label: "Breakout", v: stock.breakout, dot: "bg-blue-400", text: "text-blue-400" },
    { label: "AI Target (30d)", v: stock.target, dot: "bg-gold", text: "text-gold" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <CompanyLogo symbol={stock.symbol} size={64} />
          <div>
            <h1 className="text-2xl font-bold">{stock.symbol} <span className="font-normal text-mute">({stock.name})</span></h1>
            <p className="text-sm text-mute">{stock.exchange} <span className="text-up">• {stock.marketOpen ? "Open Market" : "Market Closed"}</span></p>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2 flex justify-end gap-3">
            <button onClick={toggleWatchlist} className="btn-gold flex items-center gap-2 !px-4 !py-2 text-sm">
              <Icon name="bookmark" />{inList ? "In Watchlist" : "Add to Watchlist"}
            </button>
            <button onClick={() => setAlertOpen(true)} className="btn-outline flex items-center gap-2 !py-2"><Icon name="bell" />Set Alert</button>
          </div>
          <p className="text-3xl font-bold">{stock.price ? usd(stock.price) : "—"}</p>
          <p className="text-sm">{stock.change !== null ? <Change v={stock.change} /> : "—"} <span className={up ? "text-up" : "text-down"}>({up ? "+" : ""}{p.toFixed(2)}%)</span></p>
          <p className="text-xs text-mute">Volume {stock.volume ?? "—"}</p>
          {stock.dataSource === "simulated" && <p className="mt-1 text-xs text-gold/70">⚠ Simulated prices</p>}
        </div>
      </div>
      {note && <p role="status" className="animate-fade-up rounded-lg bg-up/15 px-4 py-2 text-sm text-up">{note}</p>}

      <div className="stagger grid gap-6 lg:grid-cols-3">
        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><Icon name="pulse" className="h-4 w-4 text-gold" />AI Signal</h2>
            {stock.signal && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${signalTone[stock.signal]}`}>{stock.signal} ({sc >= 75 ? "Strong" : "Moderate"})</span>}
          </div>
          <p className="mb-3 text-center text-xs text-mute"><Tip term="Confidence">Confidence Score &amp; Reason</Tip></p>
          <div className="flex justify-center"><ConfidenceRing value={sc} size={110} /></div>
          {summary
            ? <p className="mt-4 text-center text-xs text-mute">{summary.summary}</p>
            : stock.reason && <p className="mt-4 text-center text-xs text-mute">{stock.reason}</p>}
        </section>

        <section className="card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Icon name="target" className="h-4 w-4 text-gold" />AI Levels</h2>
          <ul className="space-y-3 text-sm">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-mute"><span className={`h-2 w-2 rounded-full ${row.dot}`} />{row.tip ? <Tip term={row.label}>{row.label}</Tip> : row.label}</span>
                <span className={`font-semibold ${row.text}`}>{row.v ? usd(row.v) : "—"}</span>
              </li>
            ))}
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-mute"><span className="h-2 w-2 rounded-full bg-up" />Confidence</span>
              <span className="font-semibold text-up">{sc}%</span>
            </li>
          </ul>
        </section>

        <section className="card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Icon name="trend" className="h-4 w-4 text-gold" />Market Bias</h2>
          <ul className="space-y-2">
            {marketBias.map((m) => (
              <li key={m.symbol} className={`flex items-center justify-between rounded-lg px-3 py-2 ${m.signal ? signalTone[m.signal as Signal] : "bg-line/20 text-mute"}`}>
                <span><b className="block text-sm text-white">{m.symbol}</b><span className="text-xs opacity-70">{m.name}</span></span>
                <span className="text-right"><b className="block text-sm">{m.signal ?? "—"}</b><span className="text-xs opacity-70">{m.pct ?? 0}%</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 font-semibold">{stock.symbol} - Stock Chart
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-up/15 text-up" : "bg-down/15 text-down"}`}>{up ? "+" : ""}{p.toFixed(2)}% today</span>
          </h2>
          <div className="flex gap-2" role="group" aria-label="Chart range">
            {ranges.map((r) => (
              <button key={r} aria-pressed={range === r} onClick={() => setRange(r)}
                className={`h-8 w-10 rounded-lg text-xs ${range === r ? "bg-gold font-semibold text-ink" : "bg-line text-mute hover:text-white"}`}>{r}</button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hist}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5c84b" stopOpacity={0.35} /><stop offset="100%" stopColor="#f5c84b" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#2a2518" vertical={false} />
              <XAxis dataKey="label" stroke="#a39b85" fontSize={11} minTickGap={24} />
              <YAxis stroke="#a39b85" fontSize={11} domain={["auto", "auto"]} width={60} tickFormatter={(v: number) => `$${Math.round(v)}`} />
              <Tooltip formatter={(v: number) => [usd(v), "Price"]} contentStyle={{ background: "#14120c", border: "1px solid #2a2518", borderRadius: 8 }} />
              <Area type="monotone" dataKey="price" stroke="#f5c84b" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {alertOpen && <AlertModal symbol={stock.symbol} mode="create" basePrice={stock.price ?? 241} onClose={() => setAlertOpen(false)} onSubmit={handleAlert} />}
    </div>
  );
}

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
import Helmet from "@/components/Helmet";
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
    <div className="space-y-6 w-full min-w-0">
      <Skeleton className="h-24 w-full" />
      <div className="stagger grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 w-full">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
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
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      <Helmet
        title={`${stock.symbol} Stock Analysis`}
        description={`Real-time AI price analysis, trading signals, and interactive chart for ${stock.name} (${stock.symbol}).`}
      />
      {/* Top Header: Responsive across small, medium, and desktop screens */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
        {/* Left: Stock Identity */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <CompanyLogo symbol={stock.symbol} size={46} className="sm:!h-[52px] sm:!w-[52px]" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{stock.symbol}</h1>
              <span className="text-xs sm:text-sm text-mute font-normal truncate max-w-[170px] sm:max-w-xs md:max-w-sm">
                ({stock.name})
              </span>
            </div>
            <p className="text-xs text-mute mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>{stock.exchange}</span>
              <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium ${stock.marketOpen ? "text-up" : "text-mute"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${stock.marketOpen ? "bg-up" : "bg-mute"}`} />
                {stock.marketOpen ? "Open Market" : "Market Closed"}
              </span>
            </p>
          </div>
        </div>

        {/* Right (stacked on medium/small, right-aligned on desktop): Price & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-end gap-3 sm:gap-5 w-full lg:w-auto">
          {/* Price & Change block */}
          <div className="flex items-baseline justify-between sm:flex-col sm:items-end sm:justify-start gap-1">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {stock.price ? usd(stock.price) : "—"}
            </p>
            <div className="flex flex-col items-end sm:items-end">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                {stock.change !== null ? <Change v={stock.change} /> : "—"}{" "}
                <span className={`font-medium ${up ? "text-up" : "text-down"}`}>
                  ({up ? "+" : ""}{p.toFixed(2)}%)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-mute">Volume {stock.volume ?? "—"}</p>
              {stock.dataSource === "simulated" && (
                <p className="text-[10px] sm:text-xs text-gold/70">⚠ Simulated prices</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={toggleWatchlist}
              className="btn-gold flex items-center justify-center gap-2 !px-3.5 !py-2 text-xs sm:text-sm flex-1 sm:flex-initial shrink-0"
            >
              <Icon name="bookmark" className="h-4 w-4 shrink-0" />
              <span>{inList ? "In Watchlist" : "Add to Watchlist"}</span>
            </button>
            <button
              onClick={() => setAlertOpen(true)}
              className="btn-outline flex items-center justify-center gap-2 !px-3.5 !py-2 text-xs sm:text-sm flex-1 sm:flex-initial shrink-0"
            >
              <Icon name="bell" className="h-4 w-4 shrink-0" />
              <span>Set Alert</span>
            </button>
          </div>
        </div>
      </div>

      {note && <p role="status" className="animate-fade-up rounded-lg bg-up/15 px-4 py-2 text-sm text-up">{note}</p>}

      {/* Analysis & Bias Cards */}
      <div className="stagger grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 w-full">
        <section className="card w-full !p-4 sm:!p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-semibold text-base sm:text-lg">
                <Icon name="pulse" className="h-4 w-4 text-gold shrink-0" />AI Signal
              </h2>
              {stock.signal && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${signalTone[stock.signal]}`}>
                  {stock.signal} ({sc >= 75 ? "Strong" : "Moderate"})
                </span>
              )}
            </div>
            <p className="mb-3 text-center text-xs text-mute">
              <Tip term="Confidence">Confidence Score &amp; Reason</Tip>
            </p>
            <div className="flex justify-center my-2">
              <ConfidenceRing value={sc} size={100} />
            </div>
          </div>
          {summary ? (
            <p className="mt-4 text-center text-xs text-mute leading-relaxed">{summary.summary}</p>
          ) : stock.reason ? (
            <p className="mt-4 text-center text-xs text-mute leading-relaxed">{stock.reason}</p>
          ) : null}
        </section>

        <section className="card w-full !p-4 sm:!p-6 flex flex-col justify-between">
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-base sm:text-lg">
              <Icon name="target" className="h-4 w-4 text-gold shrink-0" />AI Levels
            </h2>
            <ul className="space-y-3 text-sm">
              {rows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-mute min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${row.dot}`} />
                    <span className="truncate">{row.tip ? <Tip term={row.label}>{row.label}</Tip> : row.label}</span>
                  </span>
                  <span className={`font-semibold shrink-0 ${row.text}`}>{row.v ? usd(row.v) : "—"}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-2 pt-1 border-t border-line/40">
                <span className="flex items-center gap-2 text-mute">
                  <span className="h-2 w-2 rounded-full shrink-0 bg-up" />Confidence
                </span>
                <span className="font-semibold text-up shrink-0">{sc}%</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="card w-full !p-4 sm:!p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-base sm:text-lg">
            <Icon name="trend" className="h-4 w-4 text-gold shrink-0" />Market Bias
          </h2>
          <ul className="space-y-2">
            {marketBias.map((m) => (
              <li
                key={m.symbol}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 ${
                  m.signal ? signalTone[m.signal as Signal] : "bg-line/20 text-mute"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <b className="block text-sm text-white">{m.symbol}</b>
                  <span className="block text-xs opacity-70 truncate">{m.name}</span>
                </span>
                <span className="text-right shrink-0">
                  <b className="block text-sm">{m.signal ?? "—"}</b>
                  <span className="text-xs opacity-70">{m.pct ?? 0}%</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Main Stock Chart */}
      <section className="card w-full min-w-0 !p-4 sm:!p-6 overflow-hidden">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="font-semibold text-base sm:text-lg text-white">
              {stock.symbol} - Stock Chart
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                up ? "bg-up/15 text-up" : "bg-down/15 text-down"
              }`}
            >
              {up ? "+" : ""}{p.toFixed(2)}% today
            </span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 shrink-0" role="group" aria-label="Chart range">
            {ranges.map((r) => (
              <button
                key={r}
                aria-pressed={range === r}
                onClick={() => setRange(r)}
                className={`h-7 sm:h-8 w-9 sm:w-10 rounded-lg text-xs transition duration-200 active:scale-95 ${
                  range === r ? "bg-gold font-semibold text-ink" : "bg-line text-mute hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="h-60 sm:h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hist} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5c84b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f5c84b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2a2518" vertical={false} />
              <XAxis dataKey="label" stroke="#a39b85" fontSize={11} minTickGap={20} tickLine={false} />
              <YAxis
                stroke="#a39b85"
                fontSize={11}
                domain={["auto", "auto"]}
                width={44}
                tickLine={false}
                tickFormatter={(v: number) => `$${Math.round(v)}`}
              />
              <Tooltip
                formatter={(v: number) => [usd(v), "Price"]}
                contentStyle={{ background: "#14120c", border: "1px solid #2a2518", borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="price" stroke="#f5c84b" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {alertOpen && <AlertModal symbol={stock.symbol} mode="create" basePrice={stock.price ?? 241} onClose={() => setAlertOpen(false)} onSubmit={handleAlert} />}
    </div>
  );
}

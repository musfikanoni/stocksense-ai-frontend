"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGetHistoryQuery, useGetStockQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { alertsSlice, watchlistSlice } from "@/store/slices";
import { configToAlerts } from "@/lib/alerts";
import { levels, marketBias, pct, reasonFor, score, type Range } from "@/lib/mockData";
import ConfidenceRing from "@/components/ConfidenceRing";
import AlertModal from "@/components/AlertModal";
import CompanyLogo from "@/components/CompanyLogo";
import Tip from "@/components/Tip";
import { Icon } from "@/components/icons";
import Skeleton from "@/components/Skeleton";
import { Change, signalTone, usd } from "@/components/ui";

const ranges: Range[] = ["1D", "1W", "1M", "1Y"];

export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const dispatch = useAppDispatch();
  const inList = useAppSelector((s) => s.watchlist.includes(symbol.toUpperCase()));
  const [range, setRange] = useState<Range>("1M");
  const [alertOpen, setAlertOpen] = useState(false);
  const [note, setNote] = useState("");
  const { data: stock, isLoading, isError } = useGetStockQuery(symbol);
  const { data: hist = [] } = useGetHistoryQuery({ symbol, range });

  if (isLoading) return (
    <div className="space-y-6"><Skeleton className="h-20" />
      <div className="stagger grid gap-6 lg:grid-cols-3"><Skeleton className="h-60" /><Skeleton className="h-60" /><Skeleton className="h-60" /></div>
      <Skeleton className="h-80" /></div>
  );
  if (isError || !stock) return <p className="text-down">We could not find {symbol.toUpperCase()}. Try a symbol like AAPL or MSFT.</p>;

  const lv = levels(stock);
  const sc = score(stock);
  const p = pct(stock);
  const up = stock.change >= 0;
  const rows = [
    { label: "Support", v: lv.support, dot: "bg-up", text: "text-up", tip: true },
    { label: "Resistance", v: lv.resistance, dot: "bg-down", text: "text-down", tip: true },
    { label: "Breakout", v: lv.breakout, dot: "bg-blue-400", text: "text-blue-400" },
    { label: "AI Target (30d)", v: lv.target, dot: "bg-gold", text: "text-gold" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <CompanyLogo symbol={stock.symbol} size={64} />
          <div>
            <h1 className="text-2xl font-bold">{stock.symbol} <span className="font-normal text-mute">({stock.name})</span></h1>
            <p className="text-sm text-mute">{stock.exchange} <span className="text-up">&bull; Open Market</span></p>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2 flex justify-end gap-3">
            <button onClick={() => dispatch(inList ? watchlistSlice.actions.remove(stock.symbol) : watchlistSlice.actions.add(stock.symbol))}
              className="btn-gold flex items-center gap-2 !px-4 !py-2 text-sm"><Icon name="bookmark" />{inList ? "In Watchlist" : "Add to Watchlist"}</button>
            <button onClick={() => setAlertOpen(true)} className="btn-outline flex items-center gap-2 !py-2"><Icon name="bell" />Set Alert</button>
          </div>
          <p className="text-3xl font-bold">{usd(stock.price)}</p>
          <p className="text-sm"><Change v={stock.change} /> <span className={up ? "text-up" : "text-down"}>({up ? "+" : ""}{p.toFixed(2)}%)</span></p>
          <p className="text-xs text-mute">Volume {stock.volume}</p>
        </div>
      </div>
      {note && <p role="status" className="animate-fade-up rounded-lg bg-up/15 px-4 py-2 text-sm text-up">{note}</p>}

      <div className="stagger grid gap-6 lg:grid-cols-3">
        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><Icon name="pulse" className="h-4 w-4 text-gold" />AI Signal</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${signalTone[stock.signal]}`}>{stock.signal} ({sc >= 75 ? "Strong" : "Moderate"})</span>
          </div>
          <p className="mb-3 text-center text-xs text-mute"><Tip term="Confidence">Confidence Score &amp; Reason</Tip></p>
          <div className="flex justify-center"><ConfidenceRing value={sc} size={110} /></div>
          <p className="mt-4 text-center text-xs text-mute">{reasonFor(stock)}</p>
        </section>

        <section className="card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Icon name="target" className="h-4 w-4 text-gold" />AI Levels</h2>
          <ul className="space-y-3 text-sm">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-mute"><span className={`h-2 w-2 rounded-full ${r.dot}`} />{r.tip ? <Tip term={r.label}>{r.label}</Tip> : r.label}</span>
                <span className={`font-semibold ${r.text}`}>{usd(r.v)}</span>
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
              <li key={m.symbol} className={`flex items-center justify-between rounded-lg px-3 py-2 ${signalTone[m.signal]}`}>
                <span><b className="block text-sm text-white">{m.symbol}</b><span className="text-xs opacity-70">{m.name}</span></span>
                <span className="text-right"><b className="block text-sm">{m.signal}</b><span className="text-xs opacity-70">{m.pct}%</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 font-semibold">{stock.symbol} - Stock Chart
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-up/15 text-up" : "bg-down/15 text-down"}`}>{up ? "+" : ""}{p.toFixed(2)}% today</span></h2>
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

      {alertOpen && (
        <AlertModal symbol={stock.symbol} mode="create" basePrice={stock.price} onClose={() => setAlertOpen(false)}
          onSubmit={(c) => { dispatch(alertsSlice.actions.addMany(configToAlerts(stock.symbol, c))); setAlertOpen(false); setNote(`Alert set for ${stock.symbol}. You can manage it on the Alerts page.`); }} />
      )}
    </div>
  );
}

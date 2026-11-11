"use client";
import Link from "next/link";
import { useGetStocksQuery } from "@/store/api";
import { levels, outlook, recentAlertSymbols, score, type Stock } from "@/lib/mockData";
import ConfidenceRing from "@/components/ConfidenceRing";
import CompanyLogo from "@/components/CompanyLogo";
import Skeleton from "@/components/Skeleton";
import { Change, SignalTag, usd } from "@/components/ui";

const href = (s: string) => `/stocks/${s}?from=dashboard`;

export default function Dashboard() {
  const { data = [], isLoading } = useGetStocksQuery();
  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
      <Skeleton className="h-52" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>
    </div>
  );
  const by = (sym: string) => data.find((s) => s.symbol === sym) as Stock;
  const top = data.filter((s) => s.signal === "Bullish").sort((a, b) => score(b) - score(a)).slice(0, 5);
  const alerts = recentAlertSymbols.map(by).filter(Boolean);
  const aapl = by("AAPL");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 font-semibold">Top Opportunities</h2>
          <ul className="stagger divide-y divide-line">
            {top.map((s, i) => (
              <li key={s.symbol}>
                <Link href={href(s.symbol)} className="flex items-center gap-3 rounded-lg px-1 py-3 text-sm transition duration-200 hover:bg-white/5">
                  <span className="w-6 text-mute">#{i + 1}</span><CompanyLogo symbol={s.symbol} size={32} />
                  <span className="min-w-0 flex-1"><b>{s.symbol}</b><span className="block truncate text-xs text-mute">({s.name})</span></span>
                  <SignalTag s={s.signal} />
                  <span className="w-12 text-right">{score(s)}%</span>
                  <span className="hidden w-24 text-right sm:block"><span className="block text-xs text-mute">AI Target</span>{usd(levels(s).target)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2 className="mb-2 font-semibold">Recent Alerts</h2>
          <ul className="stagger divide-y divide-line">
            {alerts.map((s) => (
              <li key={s.symbol} className="flex items-center gap-3 py-3 text-sm">
                <CompanyLogo symbol={s.symbol} size={32} />
                <span className="min-w-0 flex-1"><b>{s.symbol}</b> <span className="text-xs text-mute">({s.name})</span>
                  <span className="block truncate text-xs text-mute">Reached resistance zone at {usd(levels(s).resistance)}</span></span>
                <span className="text-right text-xs"><span className="block text-gold">Breakout Alert</span><span className="text-mute">3 Minute Ago</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div><h2 className="font-semibold">Daily AI Outlook</h2><p className="text-xs text-mute">Today Market Bias AI Summary</p></div>
            <span className="text-xs text-mute">{outlook.date}</span>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row">
            <p className="flex-1 text-sm leading-relaxed text-mute">{outlook.summary}</p>
            <div className="flex items-center gap-5">
              <div className="text-center"><ConfidenceRing value={outlook.bias} size={88} /><p className="mt-1 text-xs text-mute">Bias Score</p></div>
              <div className="w-32 space-y-2 text-xs">
                <div><div className="mb-1 flex justify-between text-mute"><span>Confidence Score</span><span className="text-white">{outlook.confidence}%</span></div>
                  <div className="h-1.5 rounded bg-line"><div className="h-full origin-left animate-grow rounded bg-up" style={{ width: `${outlook.confidence}%` }} /></div></div>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg bg-up/10 py-2"><p className="text-xl font-bold text-up">{outlook.bullish}</p><p className="text-xs text-mute">Bullish setups</p></div>
            <div className="rounded-lg bg-gold/10 py-2"><p className="text-xl font-bold text-gold">{outlook.neutral}</p><p className="text-xs text-mute">Neutral</p></div>
            <div className="rounded-lg bg-down/10 py-2"><p className="text-xl font-bold text-down">{outlook.bearish}</p><p className="text-xs text-mute">Bearish</p></div>
          </div>
        </section>
        <section className="card space-y-3">
          <h2 className="font-semibold">High Confidence Setup</h2>
          <Link href={href("AAPL")} className="flex items-center gap-3"><CompanyLogo symbol="AAPL" size={40} />
            <span className="flex-1"><b>AAPL</b><span className="block text-xs text-mute">({aapl.name})</span></span>
            <span className="rounded-full bg-up/15 px-3 py-1 text-xs font-semibold text-up">Strong Buy</span></Link>
          <p className="text-sm"><SignalTag s="Bullish" /></p>
          <p className="text-sm text-mute"><span className="text-white">Reason:</span> {outlook.reason}</p>
        </section>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Explore</h2>
        <div className="stagger grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.map((s) => (
            <Link key={s.symbol} href={href(s.symbol)} className="card card-hover !p-4">
              <div className="flex items-center gap-3"><CompanyLogo symbol={s.symbol} size={32} />
                <span className="min-w-0"><b className="block">{s.symbol}</b><span className="block truncate text-xs text-mute">{s.name}</span></span></div>
              <p className="mt-3 text-lg font-semibold">{usd(s.price)}</p>
              <p className="text-sm"><Change v={s.change} /></p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

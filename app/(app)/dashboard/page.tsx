"use client";
import Link from "next/link";
import { useGetDashboardQuery } from "@/redux/api/dashboardApi";
import { useGetStocksQuery } from "@/redux/api/stocksApi";
import ConfidenceRing from "@/components/ConfidenceRing";
import CompanyLogo from "@/components/CompanyLogo";
import Skeleton from "@/components/Skeleton";
import Helmet from "@/components/Helmet";
import { Change, SignalTag, usd } from "@/components/ui";

const href = (s: string) => `/stocks/${s}?from=dashboard`;

export default function Dashboard() {
  const { data: dash, isLoading } = useGetDashboardQuery();
  const { data: allStocks = [] } = useGetStocksQuery();

  if (isLoading) return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
      <Skeleton className="h-52 w-full" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 w-full">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>
    </div>
  );

  if (!dash?.dataReady) return (
    <div className="card text-center">
      <p className="text-gold font-semibold">Market data is loading…</p>
      <p className="text-sm text-mute mt-1">Prices are being prepared. Refresh in a moment.</p>
    </div>
  );

  const { topOpportunities, outlook, highConfidence, recentAlerts } = dash;

  return (
    <div className="space-y-5 sm:space-y-6 w-full min-w-0">
      <Helmet
        title="Dashboard"
        description="Overview of top stock opportunities, market bias, high-confidence setups, and recent alerts."
      />
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 w-full">
        <section className="card w-full !p-4 sm:!p-6">
          <h2 className="mb-2 font-semibold text-base sm:text-lg">Top Opportunities</h2>
          <ul className="stagger divide-y divide-line">
            {topOpportunities.map((s, i) => (
              <li key={s.symbol}>
                <Link
                  href={href(s.symbol)}
                  className="flex items-center gap-2 sm:gap-3 rounded-lg px-1 py-3 text-xs sm:text-sm transition duration-200 hover:bg-white/5"
                >
                  <span className="w-5 sm:w-6 text-mute shrink-0">#{i + 1}</span>
                  <CompanyLogo symbol={s.symbol} size={30} />
                  <span className="min-w-0 flex-1">
                    <b>{s.symbol}</b>
                    <span className="block truncate text-[11px] sm:text-xs text-mute">({s.name})</span>
                  </span>
                  <div className="shrink-0">
                    <SignalTag s={s.signal ?? "Neutral"} />
                  </div>
                  <span className="w-10 sm:w-12 text-right shrink-0 font-medium">{s.confidence}%</span>
                  <span className="hidden w-24 text-right sm:block shrink-0">
                    <span className="block text-xs text-mute">AI Target</span>
                    {s.target ? usd(s.target) : "—"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card w-full !p-4 sm:!p-6">
          <h2 className="mb-2 font-semibold text-base sm:text-lg">Recent Alerts</h2>
          {recentAlerts.length === 0
            ? <p className="text-sm text-mute">No alerts yet. Open a stock and press Set Alert.</p>
            : <ul className="stagger divide-y divide-line">
                {recentAlerts.map((a) => {
                  const stock = allStocks.find((s) => s.symbol === a.symbol);
                  return (
                    <li key={a.id} className="flex items-center gap-2.5 sm:gap-3 py-3 text-xs sm:text-sm">
                      <CompanyLogo symbol={a.symbol} size={30} />
                      <span className="min-w-0 flex-1">
                        <b>{a.symbol}</b>{" "}
                        <span className="text-xs text-mute">({stock?.name ?? ""})</span>
                        <span className="block truncate text-xs text-mute">{a.kind} alert — {String(a.value)}</span>
                      </span>
                      <span className="text-right text-xs shrink-0">
                        <span className="block text-gold">{a.kind.charAt(0).toUpperCase() + a.kind.slice(1)} Alert</span>
                        <span className="text-mute">{a.active ? "Active" : "Disabled"}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
          }
        </section>
      </div>

      {outlook && (
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 w-full">
          <section className="card w-full lg:col-span-2 !p-4 sm:!p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div><h2 className="font-semibold text-base sm:text-lg">Daily AI Outlook</h2><p className="text-xs text-mute">Today Market Bias AI Summary</p></div>
              <span className="text-xs text-mute">{outlook.date}</span>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex-1 text-xs sm:text-sm leading-relaxed text-mute">{outlook.summary}</p>
              <div className="flex items-center justify-center gap-4 sm:gap-5 shrink-0">
                <div className="text-center"><ConfidenceRing value={outlook.bias} size={76} /><p className="mt-1 text-xs text-mute">Bias Score</p></div>
                <div className="w-28 sm:w-32 space-y-2 text-xs">
                  <div>
                    <div className="mb-1 flex justify-between text-mute text-[11px] sm:text-xs"><span>Confidence</span><span className="text-white">{outlook.confidence}%</span></div>
                    <div className="h-1.5 rounded bg-line"><div className="h-full origin-left animate-grow rounded bg-up" style={{ width: `${outlook.confidence}%` }} /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 text-center text-sm">
              <div className="rounded-lg bg-up/10 py-2 px-1"><p className="text-lg sm:text-xl font-bold text-up">{outlook.bullish}</p><p className="text-[11px] sm:text-xs text-mute">Bullish setups</p></div>
              <div className="rounded-lg bg-gold/10 py-2 px-1"><p className="text-lg sm:text-xl font-bold text-gold">{outlook.neutral}</p><p className="text-[11px] sm:text-xs text-mute">Neutral</p></div>
              <div className="rounded-lg bg-down/10 py-2 px-1"><p className="text-lg sm:text-xl font-bold text-down">{outlook.bearish}</p><p className="text-[11px] sm:text-xs text-mute">Bearish</p></div>
            </div>
          </section>
          {highConfidence && (
            <section className="card w-full space-y-3 !p-4 sm:!p-6">
              <h2 className="font-semibold text-base sm:text-lg">High Confidence Setup</h2>
              <Link href={href(highConfidence.symbol)} className="flex items-center gap-3">
                <CompanyLogo symbol={highConfidence.symbol} size={36} />
                <span className="flex-1 min-w-0"><b>{highConfidence.symbol}</b><span className="block truncate text-xs text-mute">({highConfidence.name})</span></span>
                <span className="rounded-full bg-up/15 px-2.5 py-1 text-xs font-semibold text-up shrink-0">{highConfidence.label}</span>
              </Link>
              <p className="text-xs sm:text-sm text-mute leading-relaxed"><span className="text-white font-medium">Reason:</span> {highConfidence.reason}</p>
            </section>
          )}
        </div>
      )}

      <section className="w-full">
        <h2 className="mb-3 font-semibold text-base sm:text-lg">Explore</h2>
        <div className="stagger grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 w-full">
          {allStocks.map((s) => (
            <Link key={s.symbol} href={href(s.symbol)} className="card card-hover w-full !p-3 sm:!p-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <CompanyLogo symbol={s.symbol} size={30} />
                <span className="min-w-0"><b className="block text-sm">{s.symbol}</b><span className="block truncate text-[11px] sm:text-xs text-mute">{s.name}</span></span>
              </div>
              <p className="mt-2.5 sm:mt-3 text-base sm:text-lg font-semibold">{s.price ? usd(s.price) : "—"}</p>
              <p className="text-xs sm:text-sm">{s.change !== null ? <Change v={s.change} /> : "—"}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

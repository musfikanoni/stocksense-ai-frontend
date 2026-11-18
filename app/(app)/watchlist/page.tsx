"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useGetWatchlistQuery, useRemoveFromWatchlistMutation } from "@/redux/api/watchlistApi";
import CompanyLogo from "@/components/CompanyLogo";
import { Icon } from "@/components/icons";
import Skeleton from "@/components/Skeleton";
import Helmet from "@/components/Helmet";
import { Change, usd } from "@/components/ui";

export default function Watchlist() {
  const { data: rows = [], isLoading } = useGetWatchlistQuery();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const handleRemove = async (symbol: string) => {
    try {
      await removeFromWatchlist(symbol).unwrap();
      toast.success(`Removed ${symbol} from watchlist.`);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not remove from watchlist.";
      toast.error(msg);
    }
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14" />)}</div>;

  return (
    <section className="card w-full !p-0 overflow-hidden">
      <Helmet
        title="Watchlist"
        description="Monitor your favorite stocks in real-time with price changes and AI signals."
      />
      {rows.length === 0 ? (
        <p className="p-6 text-sm text-mute">Your watchlist is empty. Open a stock and press Add to Watchlist.</p>
      ) : (
        <>
          {/* Mobile Card List View (< sm) */}
          <div className="divide-y divide-line/60 sm:hidden">
            {rows.map((s) => (
              <div key={s.symbol} className="p-4 space-y-3 transition hover:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/stocks/${s.symbol}?from=watchlist`} className="flex items-center gap-2.5 min-w-0">
                    <CompanyLogo symbol={s.symbol} size={32} />
                    <div className="min-w-0">
                      <b className="block text-sm leading-tight">{s.symbol}</b>
                      <span className="block truncate text-xs text-mute max-w-[140px]">{s.name}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(s.symbol)}
                    aria-label={`Remove ${s.symbol} from watchlist`}
                    className="inline-flex items-center gap-1 rounded-lg bg-down/90 px-2.5 py-1 text-xs font-medium text-white transition hover:brightness-110 active:scale-95 shrink-0"
                  >
                    <Icon name="trash" className="h-3 w-3" /> Remove
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-line/40">
                  <div>
                    <span className="text-mute block text-[10px]">Price</span>
                    <span className="font-semibold text-sm">{s.price ? usd(s.price) : "—"}</span>
                  </div>
                  <div>
                    <span className="text-mute block text-[10px]">Change</span>
                    <span>{s.change !== null ? <Change v={s.change} /> : "—"}</span>
                  </div>
                  <div>
                    <span className="text-mute block text-[10px]">AI Confidence</span>
                    <span className="font-semibold text-up">{s.confidence !== null ? `${s.confidence}%` : "—"}</span>
                  </div>
                  <div>
                    <span className="text-mute block text-[10px]">Volume</span>
                    <span className="text-mute">{s.volume ?? "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-xs text-mute">
                <tr className="border-b border-line">
                  <th className="px-6 py-3 font-normal">Symbol</th>
                  <th className="font-normal">Stock Price</th>
                  <th className="font-normal">Change</th>
                  <th className="font-normal">AI Confidence</th>
                  <th className="font-normal">Volume</th>
                  <th className="px-6 text-right font-normal">Delete/Remove</th>
                </tr>
              </thead>
              <tbody className="stagger divide-y divide-line/60">
                {rows.map((s) => (
                  <tr key={s.symbol} className="transition duration-200 hover:bg-white/5">
                    <td className="px-6 py-3">
                      <Link href={`/stocks/${s.symbol}?from=watchlist`} className="flex items-center gap-3">
                        <CompanyLogo symbol={s.symbol} size={32} />
                        <span><b className="block">{s.symbol}</b><span className="block text-xs text-mute">{s.name}</span></span>
                      </Link>
                    </td>
                    <td className="font-medium">{s.price ? usd(s.price) : "—"}</td>
                    <td>{s.change !== null ? <Change v={s.change} /> : "—"}</td>
                    <td>
                      {s.confidence !== null
                        ? <span className="flex items-center gap-3">
                            <span className="h-1.5 w-24 rounded bg-line"><span className="block h-full origin-left animate-grow rounded bg-up" style={{ width: `${s.confidence}%` }} /></span>
                            <span className="text-xs text-up">{s.confidence}%</span>
                          </span>
                        : <span className="text-xs text-mute">—</span>}
                    </td>
                    <td>{s.volume ?? "—"}</td>
                    <td className="px-6 text-right">
                      <button onClick={() => handleRemove(s.symbol)} aria-label={`Remove ${s.symbol} from watchlist`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-down px-3 py-1.5 text-xs font-medium text-white transition duration-200 hover:brightness-110 active:scale-95">
                        <Icon name="trash" className="h-3.5 w-3.5" />Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

"use client";
import Link from "next/link";
import { useGetStocksQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { watchlistSlice } from "@/store/slices";
import CompanyLogo from "@/components/CompanyLogo";
import { Icon } from "@/components/icons";
import Skeleton from "@/components/Skeleton";
import { Change, usd } from "@/components/ui";

export default function Watchlist() {
  const { data = [], isLoading } = useGetStocksQuery();
  const symbols = useAppSelector((s) => s.watchlist);
  const dispatch = useAppDispatch();
  const rows = symbols.map((sym) => data.find((d) => d.symbol === sym)).filter((s) => !!s);
  if (isLoading) return <div className="space-y-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14" />)}</div>;
  return (
    <section className="card overflow-x-auto !p-0">
      {rows.length === 0 ? <p className="p-6 text-sm text-mute">Your watchlist is empty. Open a stock and press Add to Watchlist.</p> : (
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs text-mute">
            <tr className="border-b border-line"><th className="px-6 py-3 font-normal">Symbol</th><th className="font-normal">Stock Price</th><th className="font-normal">Change</th><th className="font-normal">AI Confidence</th><th className="font-normal">Volume</th><th className="px-6 text-right font-normal">Delete/Remove</th></tr>
          </thead>
          <tbody className="stagger divide-y divide-line/60">
            {rows.map((s) => s && (
              <tr key={s.symbol} className="transition duration-200 hover:bg-white/5">
                <td className="px-6 py-3">
                  <Link href={`/stocks/${s.symbol}?from=watchlist`} className="flex items-center gap-3">
                    <CompanyLogo symbol={s.symbol} size={32} />
                    <span><b className="block">{s.symbol}</b><span className="block text-xs text-mute">{s.name}</span></span>
                  </Link>
                </td>
                <td className="font-medium">{usd(s.price)}</td>
                <td><Change v={s.change} /></td>
                <td><span className="flex items-center gap-3"><span className="h-1.5 w-24 rounded bg-line"><span className="block h-full origin-left animate-grow rounded bg-up" style={{ width: `${s.confidence}%` }} /></span><span className="text-xs text-up">{s.confidence}%</span></span></td>
                <td>{s.volume}</td>
                <td className="px-6 text-right">
                  <button onClick={() => dispatch(watchlistSlice.actions.remove(s.symbol))} aria-label={`Remove ${s.symbol} from watchlist`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-down px-3 py-1.5 text-xs font-medium text-white transition duration-200 hover:brightness-110 active:scale-95"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

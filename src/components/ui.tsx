import type { Signal } from "@/redux/type";
import { glossary } from "@/lib/glossary";

export const usd = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function Change({ v }: { v: number }) {
  return <span className={v >= 0 ? "text-up" : "text-down"}>{v >= 0 ? "+" : "-"}{usd(Math.abs(v))}</span>;
}

export const signalTone: Record<Signal, string> = {
  Bullish: "bg-up/15 text-up border border-up/30 shadow-[0_0_12px_rgba(61,220,132,0.15)]",
  Neutral: "bg-gold/15 text-gold border border-gold/30 shadow-[0_0_12px_rgba(245,200,75,0.15)]",
  Bearish: "bg-down/15 text-down border border-down/30 shadow-[0_0_12px_rgba(255,77,94,0.15)]",
};

export function SignalTag({ s }: { s: Signal }) {
  return (
    <span
      title={glossary[s]}
      className={`inline-flex items-center gap-1.5 cursor-help rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${signalTone[s]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {s}
    </span>
  );
}

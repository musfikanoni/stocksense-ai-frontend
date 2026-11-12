import type { Signal } from "@/redux/type";
import { glossary } from "@/lib/glossary";

export const usd = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function Change({ v }: { v: number }) {
  return <span className={v >= 0 ? "text-up" : "text-down"}>{v >= 0 ? "+" : "-"}{usd(Math.abs(v))}</span>;
}

export const signalTone: Record<Signal, string> = {
  Bullish: "bg-up/15 text-up",
  Neutral: "bg-gold/15 text-gold",
  Bearish: "bg-down/15 text-down",
};

export function SignalTag({ s }: { s: Signal }) {
  return <span title={glossary[s]} className={`cursor-help rounded-full px-2.5 py-0.5 text-xs font-medium ${signalTone[s]}`}>{s}</span>;
}

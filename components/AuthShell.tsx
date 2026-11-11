import Image from "next/image";
import Link from "next/link";
import { Brand } from "./icons";

const facts = [
  { label: "Real-time AI buy/sell signals", value: "Real time auto level", hot: true },
  { label: "Support/resistance detection", value: "Multi-timeframe", hot: false },
  { label: "US stocks covered", value: "4,200+", hot: false },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:p-6">
      <section className="relative hidden min-h-[640px] overflow-hidden rounded-3xl border border-white/10 lg:block">
        <Image src="/shield.jpg" alt="" fill priority sizes="45vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
        <Link href="/" aria-label="StockSense home" className="absolute left-6 top-6"><Brand /></Link>
        <div className="absolute inset-x-6 bottom-6 space-y-4">
          <h2 className="text-3xl font-bold leading-tight">Institutional-level analysis.<br />Automated.</h2>
          <p className="max-w-sm text-sm text-white/70">AI-powered signals and analysis to give every trader a true institutional edge.</p>
          <div className="stagger grid grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.label} className={`flex min-h-[96px] flex-col justify-between rounded-xl p-3 text-xs ${f.hot ? "bg-gradient-to-br from-gold to-[#ffe58a] text-ink" : "glass text-white"}`}>
                <p className="font-medium">{f.label}</p>
                <p className="font-mono text-[11px] opacity-80">&bull; {f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center">{children}</section>
    </main>
  );
}

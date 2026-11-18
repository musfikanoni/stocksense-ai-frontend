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
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-ink">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-[calc(100vh-3rem)]">
        {/* Left Side: Brand Visual Card (Visible on lg screens) */}
        <section className="relative hidden lg:flex flex-col justify-between h-full min-h-[580px] overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl bg-[#0d0b06]">
          <Image
            src="/shield.jpg"
            alt="StockSense AI Analysis"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 z-[1]" />

          <div className="relative z-10">
            <Link href="/" aria-label="StockSense AI home" className="inline-block transition hover:opacity-90">
              <Brand />
            </Link>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Institutional-level analysis.<br />Automated.
            </h2>
            <p className="max-w-md text-sm text-white/80 leading-relaxed">
              AI-powered signals and analysis to give every trader a true institutional edge.
            </p>
            <div className="stagger grid grid-cols-3 gap-3 pt-2">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className={`flex min-h-[96px] flex-col justify-between rounded-xl p-3 text-xs transition duration-200 ${
                    f.hot
                      ? "bg-gradient-to-br from-gold to-[#ffe58a] text-ink font-semibold shadow-lg"
                      : "glass text-white"
                  }`}
                >
                  <p className="font-medium">{f.label}</p>
                  <p className="font-mono text-[11px] opacity-80">&bull; {f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Form Container (Always visible & centered) */}
        <section className="flex w-full items-center justify-center py-4">
          {children}
        </section>
      </div>
    </main>
  );
}

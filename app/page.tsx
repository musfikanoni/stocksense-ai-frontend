import Image from "next/image";
import Link from "next/link";
import { Brand, Icon } from "@/components/icons";
import ContactModal from "@/components/ContactModal";
import LandingPricing from "@/components/LandingPricing";

const nav = [["Home", "#home"], ["Feature", "#feature"], ["Review", "#review"], ["Pricing", "#pricing"], ["Contact", "#contact"]];
const stats = [["15K+", "Active Traders"], ["500K+", "Signals Delivered"], ["125K+", "Levels Generated"], ["92%", "Accuracy Percentage"]];
const features = [
  { t: "Real-Time Market Sentiment", img: "sentiment", d: "Understand overall market momentum with AI-powered sentiment analysis and trend detection." },
  { t: "AI Confidence Score", img: "confidence", d: "AI analysis evaluates market conditions, trend strength, and price movement to generate high-confidence trading insights." },
  { t: "Smart Support & Resistance", img: "support", d: "Automatically identify key price zones and potential breakout areas using intelligent analysis." },
  { t: "Real-Time Alerts", img: "alerts", d: "Instant notifications when your target stocks hit critical price levels or generate new trade signals." },
];
const reviews = [
  { q: "The AI signals have completely transformed my trading. Up 34% this quarter following the setups.", n: "Samantha Patel", r: "Day Trader" },
  { q: "I never thought I could automate my strategies this efficiently. 20% increase in profitability!", n: "Marcus Chen", r: "Swing Trader" },
  { q: "The insights provided by AI are invaluable, helping me make more informed decisions in real-time.", n: "David Kim", r: "Options Trader" },
  { q: "AI tools have transformed my workflow, allowing for greater efficiency and accuracy in my analyses.", n: "Sarah Chen", r: "Data Analyst" },
  { q: "With AI's predictive capabilities, I can anticipate market moves and adjust my strategies accordingly.", n: "John Doe", r: "Financial Consultant" },
  { q: "The alerts catch breakouts I would have missed while working on my research.", n: "Aisha Patel", r: "Market Researcher" },
];

const Title = ({ a, b, c }: { a?: string; b: string; c?: string }) => (
  <h2 className="text-3xl font-bold sm:text-4xl">{a} <span className="text-gold">{b}</span> {c}</h2>
);

export default function Landing() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <a href="#home" aria-label="StockSense home"><Brand /></a>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            {nav.map(([l, h], i) => <a key={l} href={h} className={`transition hover:text-gold ${i === 0 ? "text-gold" : "text-white/80"}`}>{l}</a>)}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="rounded-lg border border-gold/40 px-4 py-2 font-medium text-gold transition hover:bg-gold/10">Log In</Link>
            <Link href="/signup" className="btn-gold !px-4 !py-2">Get Start</Link>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden pb-4 pt-20 text-center">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[640px] bg-[url('/landing/wave.svg')] bg-cover bg-top opacity-70" />
          <div className="relative mx-auto max-w-3xl animate-fade-up px-6">
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Trade With <span className="text-gold">Precision</span> Intelligence</h1>
            <p className="mx-auto mt-6 max-w-2xl text-white/80">StockSense delivers institutional-grade AI analysis for US equities — real-time signals, support/resistance mapping, and price targets with confidence scoring.</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/signup" className="btn-gold inline-flex items-center gap-2">Get Started <Icon name="arrow" /></Link>
              <Link href="/login" className="btn-outline !py-2.5">Sign In</Link>
            </div>
          </div>
          <div className="relative mx-auto mt-14 max-w-5xl animate-fade-up px-6 [animation-delay:200ms]">
            <Image src="/landing/monitor.webp" alt="StockSense dashboard shown on a monitor" width={1600} height={738} priority className="h-auto w-full" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          </div>
        </section>

        <div className="group overflow-hidden py-10 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-label="Platform statistics">
          <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
            {[...stats, ...stats, ...stats, ...stats].map(([v, l], i) => (
              <div key={i} aria-hidden={i >= stats.length} className="min-w-[210px] rounded-2xl border border-line bg-gradient-to-b from-[#16130b] to-black px-6 py-5">
                <p className="text-2xl font-bold">{v}</p><p className="mt-1 text-sm text-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <section id="feature" className="mx-auto max-w-5xl px-6 py-20 text-center">
          <Title b="Everything" c="You Need to Win" />
          <p className="mb-10 mt-3 text-white/70">Professional tools, simplified for serious retail traders.</p>
          <div className="grid gap-5 text-left sm:grid-cols-2">
            {features.map((f) => (
              <article key={f.t} className="reveal card-hover overflow-hidden rounded-2xl border border-gold/40 bg-black">
                <div className="relative h-52">
                  <Image src={`/landing/${f.img}.webp`} alt="" fill sizes="(min-width: 640px) 45vw, 100vw" className="object-cover" />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
                </div>
                <div className="px-6 pb-6"><h3 className="text-lg font-semibold">{f.t}</h3><p className="mt-2 text-sm text-mute">{f.d}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="review" className="py-16 text-center">
          <Title a="Trusted By" b="Traders" />
          <p className="mb-10 mt-3 text-white/70">Helping traders make smarter decisions with intelligent market insights.</p>
          <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="flex w-max animate-marquee gap-5 [animation-duration:70s] group-hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((r, i) => (
                <figure key={i} aria-hidden={i >= reviews.length} className="flex min-h-[200px] w-[340px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-b from-[#121009] to-black p-6 text-left">
                  <p className="text-gold" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                  <blockquote className="my-3 text-sm text-white/80">&ldquo;{r.q}&rdquo;</blockquote>
                  <figcaption><b className="block">{r.n}</b><span className="text-xs text-mute">{r.r}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Title a="Choose Your" b="Plan" />
          <p className="mb-10 mt-3 text-white/70">Upgrade to unlock full AI analysis</p>
          <LandingPricing />
        </section>
      </main>

      <footer id="contact" className="border-t border-line bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-6 text-sm text-mute lg:flex-row">
          <Brand iconClass="h-7 w-7" textClass="text-base text-white" />
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ContactModal />
            <span className="flex items-center gap-2"><Icon name="mail" />example123@gmail.com</span>
            <span className="flex items-center gap-2"><Icon name="phone" />+1234567854</span>
          </div>
          <p className="text-xs">&copy; 2026 StockSense. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

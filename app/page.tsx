"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand, Icon } from "@/components/icons";
import ContactModal from "@/components/ContactModal";
import LandingPricing from "@/components/LandingPricing";
import LandingProfileMenu from "@/components/LandingProfileMenu";
import Avatar from "@/components/Avatar";
import Helmet from "@/components/Helmet";
import { useAuth } from "@/lib/authContext";
import { useGetPublicReviewsQuery } from "@/redux/api/reviewsApi";

const nav = [["Home", "#home"], ["Feature", "#feature"], ["Review", "#review"], ["Pricing", "#pricing"], ["Contact", "#contact"]];
const stats = [["15K+", "Active Traders"], ["500K+", "Signals Delivered"], ["125K+", "Levels Generated"], ["92%", "Accuracy Percentage"]];
const features = [
  { t: "Real-Time Market Sentiment", img: "sentiment", d: "Understand overall market momentum with AI-powered sentiment analysis and trend detection." },
  { t: "AI Confidence Score", img: "confidence", d: "AI analysis evaluates market conditions, trend strength, and price movement to generate high-confidence trading insights." },
  { t: "Smart Support & Resistance", img: "support", d: "Automatically identify key price zones and potential breakout areas using intelligent analysis." },
  { t: "Real-Time Alerts", img: "alerts", d: "Instant notifications when your target stocks hit critical price levels or generate new trade signals." },
];
interface ReviewCardItem {
  q: string;
  n: string;
  r: string;
  rating?: number;
  avatar?: string;
}

const Title = ({ a, b, c }: { a?: string; b: string; c?: string }) => (
  <h2 className="text-3xl font-bold sm:text-4xl">{a} <span className="text-gold">{b}</span> {c}</h2>
);

export default function Landing() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: dynamicReviews } = useGetPublicReviewsQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && Boolean(user);
  const dashboardHref = user?.role === "admin" ? "/admin/users" : "/dashboard";

  const formattedDynamic = (dynamicReviews || []).map((r) => ({
    q: r.comment,
    n: r.name,
    r: r.role,
    rating: r.rating || 5,
    avatar: r.avatarUrl,
  }));

  const displayReviews: ReviewCardItem[] = formattedDynamic;

  return (
    <>
      <Helmet
        title="StockSense AI | Intelligent Market Insights"
        description="Real-time sentiment, AI confidence scores, smart support & resistance, and instant stock trading alerts."
        keywords="stock analysis, AI trading signals, stock market alerts, sentiment analysis"
      />
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 md:gap-4 lg:gap-8 px-4 py-2.5 sm:px-6 sm:py-3">
          <a
            href="#home"
            aria-label="StockSense AI home"
            onClick={() => setMobileMenuOpen(false)}
            className="shrink-0 flex items-center"
          >
            <Brand
              iconClass="h-7 w-auto md:h-7 lg:h-8"
              textClass="text-sm md:text-sm lg:text-base xl:text-lg"
            />
          </a>
          <nav className="hidden items-center md:flex md:gap-3 lg:gap-6 xl:gap-8 text-xs lg:text-sm font-medium">
            {nav.map(([l, h], i) => (
              <a
                key={l}
                href={h}
                className={`whitespace-nowrap transition hover:text-gold ${
                  i === 0 ? "text-gold" : "text-white/80"
                }`}
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isLoggedIn ? (
              <LandingProfileMenu />
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="whitespace-nowrap rounded-lg border border-gold/40 px-2.5 py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 font-medium text-gold transition hover:bg-gold/10 text-xs lg:text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-gold whitespace-nowrap !px-3 !py-1.5 md:!px-3.5 md:!py-1.5 lg:!px-4 lg:!py-2 text-xs lg:text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-mute transition hover:bg-white/5 hover:text-white md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? "x" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="animate-fade-in border-b border-line bg-panel/95 px-4 py-4 backdrop-blur-lg md:hidden">
            <nav className="flex flex-col space-y-3 pb-4 border-b border-line/60">
              {nav.map(([l, h], i) => (
                <a
                  key={l}
                  href={h}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/5 ${
                    i === 0 ? "text-gold" : "text-white/80 hover:text-white"
                  }`}
                >
                  {l}
                </a>
              ))}
            </nav>
            <div className="pt-3">
              {isLoggedIn ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gold flex w-full items-center justify-center gap-2 text-sm"
                >
                  Go to Dashboard <Icon name="arrow" />
                </Link>
              ) : (
                <div className="flex flex-col gap-2.5 sm:hidden">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-gold/40 py-2.5 text-center font-medium text-gold transition hover:bg-gold/10 text-sm"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gold block text-center text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden pb-4 pt-12 sm:pt-20 text-center">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[640px] bg-[url('/landing/wave.svg')] bg-cover bg-top opacity-70" />
          <div className="relative mx-auto max-w-3xl animate-fade-up px-4 sm:px-6">
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Trade With <span className="text-gold">Precision</span> Intelligence
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-white/80">
              StockSense AI delivers institutional-grade AI analysis for US equities — real-time signals, support/resistance mapping, and price targets with confidence scoring.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
              {isLoggedIn ? (
                <Link href={dashboardHref} className="btn-gold inline-flex items-center gap-2 text-sm sm:text-base">
                  Go to Dashboard <Icon name="arrow" />
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="btn-gold inline-flex items-center gap-2 text-sm sm:text-base">
                    Get Started <Icon name="arrow" />
                  </Link>
                  <Link href="/login" className="btn-outline !py-2.5 text-sm sm:text-base">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="relative mx-auto mt-10 sm:mt-14 max-w-5xl animate-fade-up px-4 sm:px-6 [animation-delay:200ms]">
            <Image src="/landing/monitor-1.png" alt="StockSense AI dashboard shown on a monitor" width={1024} height={480} priority className="h-auto w-full" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
          </div>
        </section>

        <div className="group overflow-hidden py-8 sm:py-10 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-label="Platform statistics">
          <div className="flex w-max animate-marquee gap-3 sm:gap-4 group-hover:[animation-play-state:paused]">
            {[...stats, ...stats, ...stats, ...stats].map(([v, l], i) => (
              <div key={i} aria-hidden={i >= stats.length} className="min-w-[170px] sm:min-w-[210px] rounded-2xl border border-line bg-gradient-to-b from-[#16130b] to-black px-4 sm:px-6 py-4 sm:py-5">
                <p className="text-xl sm:text-2xl font-bold">{v}</p><p className="mt-1 text-xs sm:text-sm text-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <section id="feature" className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20 text-center">
          <Title b="Everything" c="You Need to Win" />
          <p className="mb-8 sm:mb-10 mt-3 text-sm sm:text-base text-white/70">Professional tools, simplified for serious retail traders.</p>
          <div className="grid gap-4 sm:gap-5 text-left sm:grid-cols-2">
            {features.map((f) => (
              <article key={f.t} className="reveal card-hover overflow-hidden rounded-2xl border border-gold/40 bg-black">
                <div className="relative h-44 sm:h-52">
                  <Image src={`/landing/${f.img}.webp`} alt="" fill sizes="(min-width: 640px) 45vw, 100vw" className="object-cover" />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
                </div>
                <div className="p-5 sm:p-6"><h3 className="text-base sm:text-lg font-semibold">{f.t}</h3><p className="mt-2 text-xs sm:text-sm text-mute">{f.d}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="review" className="py-12 sm:py-16 text-center px-4 sm:px-6">
          <Title a="Trusted By" b="Traders" />
          <p className="mb-8 sm:mb-10 mt-3 text-sm sm:text-base text-white/70">Helping traders make smarter decisions with intelligent market insights.</p>
          {displayReviews.length === 0 ? (
            <p className="text-sm text-mute">No reviews yet.</p>
          ) : displayReviews.length < 4 ? (
            <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-6 text-left">
              {displayReviews.map((r, i) => (
                <figure
                  key={i}
                  className="flex min-h-[210px] w-full max-w-[340px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-b from-[#121009] to-black p-5 sm:p-6"
                >
                  <p className="text-gold tracking-wide" aria-label={`${r.rating || 5} out of 5 stars`}>
                    {"★".repeat(r.rating || 5)}
                    {"☆".repeat(Math.max(0, 5 - (r.rating || 5)))}
                  </p>
                  <blockquote className="my-3 text-sm text-white/80 leading-relaxed line-clamp-4">
                    &ldquo;{r.q}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <Avatar name={r.n} url={r.avatar} size={34} />
                    <div className="min-w-0 flex-1">
                      <b className="block truncate text-xs text-white">{r.n}</b>
                      <span className="block truncate text-[11px] text-mute">{r.r}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
              <div className="flex w-max animate-marquee gap-4 sm:gap-5 [animation-duration:70s] group-hover:[animation-play-state:paused]">
                {[...displayReviews, ...displayReviews].map((r, i) => (
                  <figure
                    key={i}
                    aria-hidden={i >= displayReviews.length}
                    className="flex min-h-[210px] w-[290px] sm:w-[340px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-b from-[#121009] to-black p-5 sm:p-6 text-left"
                  >
                    <p className="text-gold tracking-wide" aria-label={`${r.rating || 5} out of 5 stars`}>
                      {"★".repeat(r.rating || 5)}
                      {"☆".repeat(Math.max(0, 5 - (r.rating || 5)))}
                    </p>
                    <blockquote className="my-3 text-sm text-white/80 leading-relaxed line-clamp-4">
                      &ldquo;{r.q}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3 pt-2 border-t border-white/5">
                      <Avatar name={r.n} url={r.avatar} size={34} />
                      <div className="min-w-0 flex-1">
                        <b className="block truncate text-xs text-white">{r.n}</b>
                        <span className="block truncate text-[11px] text-mute">{r.r}</span>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </section>

        <section id="pricing" className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20 text-center">
          <Title a="Choose Your" b="Plan" />
          <p className="mb-8 sm:mb-10 mt-3 text-sm sm:text-base text-white/70">Upgrade to unlock full AI analysis</p>
          <LandingPricing />
        </section>
      </main>

      <footer id="contact" className="border-t border-line bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:gap-5 px-4 sm:px-6 py-6 text-sm text-mute lg:flex-row">
          <Brand iconClass="h-7 w-auto" textClass="text-base text-white" />
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <ContactModal />
            <span className="flex items-center gap-2"><Icon name="mail" />example123@gmail.com</span>
            <span className="flex items-center gap-2"><Icon name="phone" />+1234567854</span>
          </div>
          <p className="text-xs">&copy; 2026 StockSense AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

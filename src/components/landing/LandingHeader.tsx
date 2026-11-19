// src/components/landing/LandingHeader.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Brand, Icon } from "@/components/icons";
import LandingProfileMenu from "@/components/LandingProfileMenu";
import { useAuth } from "@/lib/authContext";
import { LANDING_NAV } from "@/constants/nav";

export default function LandingHeader() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = user?.role === "admin" ? "/admin/users" : "/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 md:gap-4 lg:gap-8 px-4 py-2.5 sm:px-6 sm:py-3">
        <a
          href="#home"
          aria-label="StockSense AI home"
          onClick={() => setMobileMenuOpen(false)}
          className="shrink-0 flex items-center"
        >
          <Brand iconClass="h-7 w-auto md:h-7 lg:h-8" textClass="text-sm md:text-sm lg:text-base xl:text-lg" />
        </a>

        <nav className="hidden items-center md:flex md:gap-3 lg:gap-6 xl:gap-8 text-xs lg:text-sm font-medium">
          {LANDING_NAV.map(([label, href], i) => (
            <a
              key={label}
              href={href}
              className={`whitespace-nowrap transition hover:text-gold ${i === 0 ? "text-gold" : "text-white/80"}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
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
            {LANDING_NAV.map(([label, href], i) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/5 ${
                  i === 0 ? "text-gold" : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="pt-3">
            {user ? (
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
  );
}

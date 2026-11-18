"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Brand, Icon } from "./icons";
import { Settings } from "lucide-react";
import { useSidebar } from "@/lib/sidebarContext";

type Item = { label: string; href: string; icon: string };

export default function Sidebar({
  items,
  tag,
  premium,
}: {
  items: Item[];
  tag?: string;
  premium?: boolean;
}) {
  const path = usePathname();
  const from = useSearchParams().get("from");
  const { mobileOpen, closeMobile } = useSidebar();
  const prevPathRef = useRef(path);

  // Close drawer ONLY when route actually changes
  useEffect(() => {
    if (prevPathRef.current !== path) {
      prevPathRef.current = path;
      closeMobile();
    }
  }, [path, closeMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen, closeMobile]);

 
  const current = path.startsWith("/stocks") ? `/${from ?? "dashboard"}` : path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:h-screen md:w-64 md:shrink-0 md:sticky md:top-0 md:flex-col md:border-r md:border-line md:p-4 bg-ink/50 backdrop-blur-sm z-30">
        <Link href="/" aria-label="StockSense AI home" className="mb-6 flex items-center justify-between gap-2.5">
          <Brand iconClass="h-8 w-auto" textClass="text-base font-bold" />
          {tag && (
            <span className="shrink-0 rounded bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold tracking-wide">
              {tag}
            </span>
          )}
        </Link>
        <nav className="flex flex-col gap-1.5 flex-1">
          {items.map((i) => {
            const on = current.startsWith(i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition duration-200 ${
                  on
                    ? "bg-gold/15 font-semibold text-gold shadow-[inset_2px_0_0_#f5c84b]"
                    : "text-mute hover:bg-white/5 hover:text-white"
                }`}
              >
                {i.icon === "gear" || i.icon === "settings" ? (
                  <Settings className="h-4 w-4 shrink-0" />
                ) : (
                  <Icon name={i.icon} className="h-4 w-4 shrink-0" />
                )}
                {i.label}
              </Link>
            );
          })}
        </nav>
        {premium && (
          <Link
            href="/subscription"
            className="btn-gold mt-auto flex items-center justify-center gap-2 text-sm !py-2.5"
          >
            <Icon name="crown" className="h-4 w-4" />
            Get Premium
          </Link>
        )}
      </aside>

      {/* Mobile Drawer (Overlay + Drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="animate-fade-in fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="animate-scale-in fixed inset-y-0 left-0 z-10 flex w-72 sm:w-80 max-w-[85vw] flex-col justify-between border-r border-line bg-[#0d0b06] p-5 shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <Link
                  href="/"
                  aria-label="StockSense AI home"
                  onClick={closeMobile}
                  className="flex items-center gap-2.5"
                >
                  <Brand iconClass="h-7 w-auto" textClass="text-base" />
                  {tag && (
                    <span className="shrink-0 rounded bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold tracking-wide">
                      {tag}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="rounded-lg p-1.5 text-mute transition hover:bg-white/10 hover:text-white"
                  aria-label="Close navigation"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-5 flex flex-col gap-1.5">
                {items.map((i) => {
                  const on = current.startsWith(i.href);
                  return (
                    <Link
                      key={i.href}
                      href={i.href}
                      onClick={closeMobile}
                      aria-current={on ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition duration-200 ${
                        on
                          ? "bg-gold/15 font-semibold text-gold shadow-[inset_2px_0_0_#f5c84b]"
                          : "text-mute hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {i.icon === "gear" || i.icon === "settings" ? (
                        <Settings className="h-4 w-4 shrink-0" />
                      ) : (
                        <Icon name={i.icon} className="h-4 w-4 shrink-0" />
                      )}
                      {i.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {premium && (
              <div className="pt-4 border-t border-line">
                <Link
                  href="/subscription"
                  onClick={closeMobile}
                  className="btn-gold flex w-full items-center justify-center gap-2 text-sm !py-2.5"
                >
                  <Icon name="crown" className="h-4 w-4" />
                  Get Premium
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

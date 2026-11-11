"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Brand, Icon } from "./icons";

type Item = { label: string; href: string; icon: string };

export default function Sidebar({ items, tag, premium }: { items: Item[]; tag?: string; premium?: boolean }) {
  const path = usePathname();
  const from = useSearchParams().get("from");
  // A stock page keeps the section you came from highlighted (Dashboard, Watchlist or Alerts)
  const current = path.startsWith("/stocks") ? `/${from ?? "dashboard"}` : path;
  return (
    <aside className="flex flex-col border-b border-line p-4 md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <Link href="/" aria-label="StockSense home" className="mb-4 flex items-center gap-2">
        <Brand iconClass="h-8 w-8" textClass="hidden text-base md:inline" />{tag && <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] text-gold">{tag}</span>}
      </Link>
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {items.map((i) => {
          const on = current.startsWith(i.href);
          return (
            <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition duration-200 ${on ? "bg-gold/15 font-semibold text-gold shadow-[inset_2px_0_0_#f5c84b]" : "text-mute hover:bg-white/5 hover:text-white"}`}>
              <Icon name={i.icon} />{i.label}
            </Link>
          );
        })}
      </nav>
      {premium && (
        <Link href="/subscription" className="btn-gold mt-3 flex items-center justify-center gap-2 text-sm md:mt-auto"><Icon name="crown" />Get Premium</Link>
      )}
    </aside>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "./icons";
import { adminNotifications, userNotifications } from "@/lib/adminData";

const titles: [string, string][] = [
  ["/admin/users", "User Management"], ["/admin/plans", "Plan Management"], ["/admin/billing", "Revenue & Billing Info"],
  ["/admin/policy", "Edit Policy & Agreement"], ["/admin/settings", "Admin Settings"],
  ["/dashboard", "Dashboard"], ["/watchlist", "Watchlist"], ["/alerts", "Alerts"], ["/settings", "Settings"], ["/subscription", "Subscription"],
];
const titleOf = (p: string) => titles.find(([k]) => p.startsWith(k))?.[1] ?? "";

export default function Topbar() {
  const path = usePathname();
  const from = useSearchParams().get("from");
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const admin = path.startsWith("/admin");
  const title = path.startsWith("/stocks") ? titleOf(`/${from ?? "dashboard"}`) : titleOf(path);
  const list = admin ? adminNotifications : userNotifications;

  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-ink/80 px-6 py-4 backdrop-blur">
      <span className="text-lg font-semibold text-gold">{title}</span>
      <form role="search" className="relative hidden w-full max-w-sm sm:block"
        onSubmit={(e) => { e.preventDefault(); if (q.trim() && !admin) router.push(`/stocks/${q.trim().toUpperCase()}?from=${from ?? "dashboard"}`); }}>
        <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        <input className="input !rounded-full !pl-9" placeholder={admin ? "Search here..." : "Search here... (e.g. AAPL)"} aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      <div className="flex items-center gap-4">
        <div ref={box} className="relative">
          <button aria-label="Notifications" aria-expanded={open} onClick={() => { setOpen(!open); setSeen(true); }} className="relative rounded-full p-1 text-mute transition hover:text-white">
            <Icon name="bell" className="h-5 w-5" />{!seen && <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-down" />}
          </button>
          {open && (
            <div role="dialog" aria-label="Notifications" className="card animate-scale-in absolute right-0 top-full z-30 mt-2 w-80 !p-4">
              <p className="mb-3 font-semibold">Notification</p>
              <ul className="divide-y divide-line">
                {list.map((n) => (<li key={n.text} className="py-2.5 text-sm"><p>{n.text}</p><p className="mt-0.5 text-xs text-mute">{n.time}</p></li>))}
              </ul>
            </div>
          )}
        </div>
        <span className="flex items-center gap-2 text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/20 text-xs font-semibold text-gold">HA</span>
          <span className="hidden leading-tight sm:block">Hasan Arif{admin && <span className="block text-[11px] text-mute">Admin</span>}</span>
          <Icon name="caret" className="h-3 w-3 text-mute" />
        </span>
      </div>
    </header>
  );
}

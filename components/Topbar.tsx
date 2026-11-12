"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "./icons";
import { useAuth } from "@/lib/authContext";
import Avatar from "./Avatar";
import {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
} from "@/redux/api/notificationsApi";
import { useGetAdminNotificationsQuery } from "@/redux/api/adminApi";

const titles: [string, string][] = [
  ["/admin/users", "User Management"],
  ["/admin/plans", "Plan Management"],
  ["/admin/billing", "Revenue & Billing Info"],
  ["/admin/policy", "Edit Policy & Agreement"],
  ["/admin/settings", "Admin Settings"],
  ["/dashboard", "Dashboard"],
  ["/watchlist", "Watchlist"],
  ["/alerts", "Alerts"],
  ["/settings", "Settings"],
  ["/subscription", "Subscription"],
];
const titleOf = (p: string) => titles.find(([k]) => p.startsWith(k))?.[1] ?? "";

export default function Topbar() {
  const path = usePathname();
  const from = useSearchParams().get("from");
  const router = useRouter();
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [openNotif, setOpenNotif] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const notifBox = useRef<HTMLDivElement>(null);
  const userBox = useRef<HTMLDivElement>(null);

  const admin = path.startsWith("/admin");
  const title = path.startsWith("/stocks") ? titleOf(`/${from ?? "dashboard"}`) : titleOf(path);

  // Notifications – admin vs user
  const { data: userNotif, refetch: refetchUser } = useGetNotificationsQuery(undefined, { skip: admin || !user });
  const { data: adminNotif } = useGetAdminNotificationsQuery(undefined, { skip: !admin || !user });
  const [markAllRead] = useMarkAllReadMutation();

  const unread = userNotif?.unread ?? 0;
  const notifList = admin
    ? (adminNotif ?? []).map((n) => ({ text: n.text, time: new Date(n.at).toLocaleDateString() }))
    : (userNotif?.items ?? []).map((n) => ({ text: n.text, time: new Date(n.createdAt).toLocaleTimeString() }));

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!notifBox.current?.contains(e.target as Node)) setOpenNotif(false);
      if (!userBox.current?.contains(e.target as Node)) setOpenUserMenu(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNotif(false);
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, []);

  const handleBell = () => {
    setOpenNotif(!openNotif);
    if (!openNotif && !admin && unread > 0) {
      markAllRead().then(() => refetchUser());
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const fullName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Account");

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-ink/80 px-6 py-4 backdrop-blur">
      <span className="text-lg font-semibold text-gold">{title}</span>
      <form
        role="search"
        className="relative hidden w-full max-w-sm sm:block"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim() && !admin)
            router.push(`/stocks/${q.trim().toUpperCase()}?from=${from ?? "dashboard"}`);
        }}
      >
        <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        <input
          className="input !rounded-full !pl-9"
          placeholder={admin ? "Search admin records..." : "Search stocks... (e.g. AAPL)"}
          aria-label="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div ref={notifBox} className="relative">
          <button
            aria-label="Notifications"
            aria-expanded={openNotif}
            onClick={handleBell}
            className="relative rounded-full p-1.5 text-mute transition hover:text-white"
          >
            <Icon name="bell" className="h-5 w-5" />
            {unread > 0 && !openNotif && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-down ring-2 ring-ink" />
            )}
          </button>
          {openNotif && (
            <div
              role="dialog"
              aria-label="Notifications"
              className="card animate-scale-in absolute right-0 top-full z-30 mt-2 w-80 !p-4 shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-sm">Notifications</p>
                {unread > 0 && <span className="rounded bg-gold/15 px-2 py-0.5 text-xs text-gold">{unread} new</span>}
              </div>
              {notifList.length === 0 ? (
                <p className="py-4 text-center text-xs text-mute">No notifications yet.</p>
              ) : (
                <ul className="max-h-72 divide-y divide-line overflow-y-auto">
                  {notifList.map((n, i) => (
                    <li key={i} className="py-2.5 text-xs leading-relaxed">
                      <p className="text-white/90">{n.text}</p>
                      <p className="mt-1 text-[11px] text-mute">{n.time}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={userBox} className="relative">
          <button
            onClick={() => setOpenUserMenu(!openUserMenu)}
            aria-expanded={openUserMenu}
            className="flex items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-white/5 text-sm"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={fullName} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <Avatar name={fullName} size={32} />
            )}
            <span className="hidden text-left leading-tight sm:block">
              <span className="block font-medium">{fullName}</span>
              <span className="block text-[11px] text-mute">
                {user?.role === "admin" ? "Admin" : user?.planLabel || "Free Tier"}
              </span>
            </span>
            <Icon name="caret" className={`h-3 w-3 text-mute transition ${openUserMenu ? "rotate-180" : ""}`} />
          </button>

          {openUserMenu && (
            <div className="card animate-scale-in absolute right-0 top-full z-30 mt-2 w-56 !p-2 shadow-2xl">
              <div className="border-b border-line px-3 py-2">
                <p className="font-semibold text-sm truncate">{fullName}</p>
                <p className="text-xs text-mute truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href={admin ? "/admin/settings" : "/settings"}
                  onClick={() => setOpenUserMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition hover:bg-white/5"
                >
                  <Icon name="gear" className="h-4 w-4 text-mute" />
                  Settings & Profile
                </Link>
                {!admin && (
                  <Link
                    href="/subscription"
                    onClick={() => setOpenUserMenu(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition hover:bg-white/5"
                  >
                    <Icon name="crown" className="h-4 w-4 text-gold" />
                    Subscription Plan
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    href={admin ? "/dashboard" : "/admin/users"}
                    onClick={() => setOpenUserMenu(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition hover:bg-white/5 text-gold"
                  >
                    <Icon name="grid" className="h-4 w-4" />
                    {admin ? "Switch to User App" : "Switch to Admin Panel"}
                  </Link>
                )}
              </div>
              <div className="border-t border-line pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-down transition hover:bg-down/10"
                >
                  <Icon name="logout" className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

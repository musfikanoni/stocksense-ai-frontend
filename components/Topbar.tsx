"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "./icons";
import { useAuth } from "@/lib/authContext";
import Avatar from "./Avatar";
import CompanyLogo from "./CompanyLogo";
import { Change, usd } from "./ui";
import { useGetStocksQuery } from "@/redux/api/stocksApi";
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
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [openNotif, setOpenNotif] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const notifBox = useRef<HTMLDivElement>(null);
  const userBox = useRef<HTMLDivElement>(null);
  const searchBox = useRef<HTMLDivElement>(null);

  const admin = path.startsWith("/admin");
  const title = path.startsWith("/stocks") ? titleOf(`/${from ?? "dashboard"}`) : titleOf(path);

  // Debounced live search
  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [q]);

  const { data: searchResults = [], isFetching: isSearching } = useGetStocksQuery(
    { q: debouncedQ },
    { skip: !debouncedQ || admin }
  );

  const showDropdown = openSearch && q.trim().length > 0 && !admin;

  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQ]);

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
      if (!searchBox.current?.contains(e.target as Node)) setOpenSearch(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNotif(false);
        setOpenUserMenu(false);
        setOpenSearch(false);
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

  const handleSelectStock = (symbol: string) => {
    setOpenSearch(false);
    setQ("");
    router.push(`/stocks/${symbol}?from=${from ?? "dashboard"}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim() || admin) return;
    if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
      handleSelectStock(searchResults[selectedIndex].symbol);
    } else if (searchResults.length > 0) {
      handleSelectStock(searchResults[0].symbol);
    } else {
      handleSelectStock(q.trim().toUpperCase());
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    }
  };

  const fullName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Account");

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-ink/80 px-6 py-4 backdrop-blur">
      <span className="text-lg font-semibold text-gold shrink-0">{title}</span>

      {/* Live Search Bar for User Dashboard */}
      {!admin ? (
        <div ref={searchBox} className="relative flex-1 max-w-sm">
          <form role="search" onSubmit={handleSearchSubmit} className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute pointer-events-none"
            />
            <input
              className="input !rounded-full !pl-9 !pr-8 text-sm w-full transition focus:border-gold/60"
              placeholder="Search stocks... (e.g. AAPL, Tesla)"
              aria-label="Search stocks"
              value={q}
              onFocus={() => {
                if (q.trim()) setOpenSearch(true);
              }}
              onChange={(e) => {
                setQ(e.target.value);
                setOpenSearch(true);
              }}
              onKeyDown={handleSearchKeyDown}
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setOpenSearch(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mute hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>

          {showDropdown && (
            <div className="card animate-scale-in absolute left-0 top-full z-40 mt-2 w-full !p-2 shadow-2xl max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-mute animate-pulse">
                  Searching equities...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-white/90">No stocks found</p>
                  <p className="mt-1 text-xs text-mute">
                    No matching stocks for &ldquo;{debouncedQ}&rdquo;.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-mute uppercase tracking-wider">
                    Equities ({searchResults.length})
                  </div>
                  <ul className="divide-y divide-line/40">
                    {searchResults.map((s, idx) => (
                      <li key={s.symbol}>
                        <button
                          type="button"
                          onClick={() => handleSelectStock(s.symbol)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left rounded-lg text-sm transition ${
                            selectedIndex === idx
                              ? "bg-white/10 text-gold"
                              : "hover:bg-white/5 text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <CompanyLogo symbol={s.symbol} size={28} />
                            <div className="min-w-0">
                              <span className="font-bold text-sm leading-tight block">
                                {s.symbol}
                              </span>
                              <span className="text-xs text-mute truncate block max-w-[140px] sm:max-w-[180px]">
                                {s.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {s.price !== null && (
                              <div className="font-medium text-xs">
                                {usd(s.price)}
                              </div>
                            )}
                            <div className="text-[11px]">
                              {s.change !== null && <Change v={s.change} />}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}
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

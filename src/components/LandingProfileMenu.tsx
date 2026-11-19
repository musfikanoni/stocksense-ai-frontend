"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import { Settings } from "lucide-react";

export default function LandingProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!user) return null;

  const fullName =
    user.name ||
    (user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Account");
  const isAdmin = user.role === "admin";
  const dashboardHref = isAdmin ? "/admin/users" : "/dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 transition hover:border-gold/40 hover:bg-white/10 text-sm"
      >
        <Avatar name={fullName} url={user.avatarUrl} size={32} />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block font-medium text-white">{fullName}</span>
          <span className="block text-[11px] text-mute">
            {isAdmin ? "Admin" : user.planLabel || "Free Tier"}
          </span>
        </span>
        <Icon
          name="caret"
          className={`h-3 w-3 text-mute transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="card animate-scale-in absolute right-0 top-full z-40 mt-2 w-56 !p-2 shadow-2xl border border-line bg-card">
          <div className="border-b border-line px-3 py-2">
            <p className="font-semibold text-sm truncate text-white">{fullName}</p>
            <p className="text-xs text-mute truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-gold transition hover:bg-white/5"
            >
              <Icon name="grid" className="h-4 w-4" />
              Go to Dashboard
            </Link>
            <Link
              href={isAdmin ? "/admin/settings" : "/settings"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-white/90 transition hover:bg-white/5"
            >
              <Settings className="h-4 w-4 text-mute" />
              Settings & Profile
            </Link>
            {!isAdmin && (
              <Link
                href="/subscription"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-white/90 transition hover:bg-white/5"
              >
                <Icon name="crown" className="h-4 w-4 text-gold" />
                Subscription Plan
              </Link>
            )}
          </div>
          <div className="border-t border-line pt-1">
            <button
              type="button"
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
  );
}

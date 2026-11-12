import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Watchlist", href: "/watchlist", icon: "bookmark" },
  { label: "Alerts", href: "/alerts", icon: "bell" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="md:flex">
        <Suspense fallback={null}><Sidebar items={items} premium /></Suspense>
        <div className="min-w-0 flex-1">
          <Suspense fallback={null}><Topbar /></Suspense>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

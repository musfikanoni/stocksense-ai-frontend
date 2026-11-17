import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";
import { SidebarProvider } from "@/lib/sidebarContext";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Watchlist", href: "/watchlist", icon: "bookmark" },
  { label: "Alerts", href: "/alerts", icon: "bell" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen md:flex bg-ink">
          <Suspense fallback={null}><Sidebar items={items} premium /></Suspense>
          <div className="flex min-w-0 flex-1 flex-col">
            <Suspense fallback={null}><Topbar /></Suspense>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

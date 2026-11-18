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
        <div className="min-h-screen w-full md:flex bg-ink">
          <Suspense fallback={null}><Sidebar items={items} premium /></Suspense>
          <div className="flex min-w-0 w-full flex-1 flex-col">
            <Suspense fallback={null}><Topbar /></Suspense>
            <main className="flex-1 w-full min-w-0 p-3 sm:p-5 lg:p-6 overflow-x-hidden">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

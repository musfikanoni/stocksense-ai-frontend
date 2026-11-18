import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";
import { SidebarProvider } from "@/lib/sidebarContext";

const items = [
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "Plan Management", href: "/admin/plans", icon: "tag" },
  { label: "Review Management", href: "/admin/reviews", icon: "star" },
  { label: "Revenue & Billing Info", href: "/admin/billing", icon: "wallet" },
  { label: "Edit Policy & Agreement", href: "/admin/policy", icon: "doc" },
  { label: "Admin Settings", href: "/admin/settings", icon: "gear" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard adminOnly>
      <SidebarProvider>
        <div className="min-h-screen w-full md:flex bg-ink">
          <Suspense fallback={null}><Sidebar items={items} tag="Admin" /></Suspense>
          <div className="flex min-w-0 w-full flex-1 flex-col">
            <Suspense fallback={null}><Topbar /></Suspense>
            <main className="flex-1 w-full min-w-0 p-3 sm:p-5 lg:p-6 overflow-x-hidden">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

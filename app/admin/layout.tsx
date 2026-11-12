import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

const items = [
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "Plan Management", href: "/admin/plans", icon: "tag" },
  { label: "Revenue & Billing Info", href: "/admin/billing", icon: "wallet" },
  { label: "Edit Policy & Agreement", href: "/admin/policy", icon: "doc" },
  { label: "Admin Settings", href: "/admin/settings", icon: "gear" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard adminOnly>
      <div className="md:flex">
        <Suspense fallback={null}><Sidebar items={items} tag="Admin" /></Suspense>
        <div className="min-w-0 flex-1">
          <Suspense fallback={null}><Topbar /></Suspense>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

import type { Metadata } from "next";
import AdminUsersView from "@/components/admin/AdminUsersView";

export const metadata: Metadata = {
  title: "User Management | Admin",
  description: "Manage registered users, roles, subscription tiers, and account status.",
  robots: "noindex, nofollow",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}

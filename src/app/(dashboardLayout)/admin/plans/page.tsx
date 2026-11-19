import type { Metadata } from "next";
import AdminPlansView from "@/components/admin/AdminPlansView";

export const metadata: Metadata = {
  title: "Plan Management | Admin",
  description: "Configure subscription plans, features, and pricing.",
  robots: "noindex, nofollow",
};

export default function AdminPlansPage() {
  return <AdminPlansView />;
}

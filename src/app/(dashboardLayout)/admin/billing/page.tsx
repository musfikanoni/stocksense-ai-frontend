import type { Metadata } from "next";
import AdminBillingView from "@/components/admin/AdminBillingView";

export const metadata: Metadata = {
  title: "Revenue & Billing | Admin",
  description: "View revenue statistics, subscription transactions, and invoice history.",
  robots: "noindex, nofollow",
};

export default function AdminBillingPage() {
  return <AdminBillingView />;
}

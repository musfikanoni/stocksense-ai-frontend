import type { Metadata } from "next";
import AdminPolicyView from "@/components/admin/AdminPolicyView";

export const metadata: Metadata = {
  title: "Policy & Agreement | Admin",
  description: "Edit terms of service, privacy policy, and user agreements.",
  robots: "noindex, nofollow",
};

export default function AdminPolicyPage() {
  return <AdminPolicyView />;
}

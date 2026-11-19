import type { Metadata } from "next";
import AdminUserDetailView from "@/components/admin/AdminUserDetailView";

export const metadata: Metadata = {
  title: "User Profile | Admin",
  description: "View user profile details and billing history.",
  robots: "noindex, nofollow",
};

interface Props {
  params: { id: string };
}

export default function AdminUserDetailPage({ params }: Props) {
  return <AdminUserDetailView id={params.id} />;
}

import type { Metadata } from "next";
import AdminReviewsView from "@/components/admin/AdminReviewsView";

export const metadata: Metadata = {
  title: "Review Management | Admin",
  description: "Moderate trader reviews and testimonials.",
  robots: "noindex, nofollow",
};

export default function AdminReviewsPage() {
  return <AdminReviewsView />;
}

import type { Metadata } from "next";
import UserSubscriptionView from "@/components/user/UserSubscriptionView";

export const metadata: Metadata = {
  title: "Subscription & Plans | StockSense AI",
  description: "View current subscription status, upgrade plans, and invoice history.",
};

export default function UserSubscriptionPage() {
  return <UserSubscriptionView />;
}

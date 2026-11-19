import type { Metadata } from "next";
import UserAlertsView from "@/components/user/UserAlertsView";

export const metadata: Metadata = {
  title: "Price & Signal Alerts | StockSense AI",
  description: "Manage real-time price alerts, breakout alerts, and AI signal notifications.",
};

export default function UserAlertsPage() {
  return <UserAlertsView />;
}

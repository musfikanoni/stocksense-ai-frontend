import type { Metadata } from "next";
import UserDashboardView from "@/components/user/UserDashboardView";

export const metadata: Metadata = {
  title: "Dashboard | StockSense AI",
  description: "Overview of top stock opportunities, market bias, high-confidence setups, and recent alerts.",
};

export default function UserDashboardPage() {
  return <UserDashboardView />;
}

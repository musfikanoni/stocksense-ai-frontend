import type { Metadata } from "next";
import UserWatchlistView from "@/components/user/UserWatchlistView";

export const metadata: Metadata = {
  title: "Watchlist | StockSense AI",
  description: "Monitor saved stocks, real-time price changes, and AI signals.",
};

export default function UserWatchlistPage() {
  return <UserWatchlistView />;
}

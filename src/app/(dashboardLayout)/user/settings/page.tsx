import type { Metadata } from "next";
import SettingsView from "@/components/SettingsView";

export const metadata: Metadata = {
  title: "Account Settings | StockSense AI",
  description: "Manage your StockSense AI profile, security, and subscription billing.",
};

export default function UserSettingsPage() {
  return <SettingsView tabs={["profile", "security", "billing", "policy", "review"]} />;
}

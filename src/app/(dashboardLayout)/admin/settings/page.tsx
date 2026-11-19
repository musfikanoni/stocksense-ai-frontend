import type { Metadata } from "next";
import SettingsView from "@/components/SettingsView";

export const metadata: Metadata = {
  title: "Admin Settings | StockSense AI",
  description: "Administrator profile and security settings.",
  robots: "noindex, nofollow",
};

export default function AdminSettingsPage() {
  return <SettingsView tabs={["profile", "security"]} />;
}

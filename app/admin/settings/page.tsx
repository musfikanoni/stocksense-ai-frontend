import type { Metadata } from "next";
import SettingsView from "@/components/SettingsView";
import Helmet from "@/components/Helmet";

export const metadata: Metadata = {
  title: "Admin Settings | StockSense AI",
  description: "Administrator profile and security settings.",
  robots: "noindex, nofollow",
};

export default function AdminSettings() {
  return (
    <>
      <Helmet
        title="Admin Settings | Admin"
        description="Administrator profile and security settings."
        noIndex
      />
      <SettingsView tabs={["profile", "security"]} />
    </>
  );
}

import type { Metadata } from "next";
import SettingsView from "@/components/SettingsView";
import Helmet from "@/components/Helmet";

export const metadata: Metadata = {
  title: "Account Settings | StockSense AI",
  description: "Manage your StockSense AI profile, security, and subscription billing.",
};

export default function Settings() {
  return (
    <>
      <Helmet
        title="Settings"
        description="Manage your StockSense AI profile, security credentials, and billing."
      />
      <SettingsView tabs={["profile", "security", "billing", "policy", "review"]} />
    </>
  );
}

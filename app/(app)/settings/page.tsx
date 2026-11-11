import SettingsView from "@/components/SettingsView";

export default function Settings() {
  return <SettingsView tabs={["profile", "security", "billing", "policy"]} />;
}

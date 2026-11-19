import { Suspense } from "react";
import DashboardLayoutShell from "@/components/DashboardLayoutShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </Suspense>
  );
}

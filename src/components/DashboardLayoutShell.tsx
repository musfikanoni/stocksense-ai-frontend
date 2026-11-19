"use client";
import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";
import { SidebarProvider } from "@/lib/sidebarContext";
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from "@/constants/nav";

export default function DashboardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AuthGuard adminOnly={isAdmin}>
      <SidebarProvider>
        <div className="min-h-screen w-full md:flex bg-ink">
          <Suspense fallback={null}>
            <Sidebar
              items={isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS}
              tag={isAdmin ? "Admin" : undefined}
              premium={!isAdmin}
            />
          </Suspense>
          <div className="flex min-w-0 w-full flex-1 flex-col">
            <Suspense fallback={null}>
              <Topbar />
            </Suspense>
            <main className="flex-1 w-full min-w-0 p-3 sm:p-5 lg:p-6 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

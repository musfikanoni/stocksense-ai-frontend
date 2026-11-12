"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (adminOnly && user.role !== "admin") { router.replace("/dashboard"); }
  }, [user, isLoading, adminOnly, router]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><span className="animate-pulse text-gold">Loading…</span></div>;
  if (!user) return null;
  if (adminOnly && user.role !== "admin") return null;
  return <>{children}</>;
}


"use client";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { useAuth } from "@/lib/authContext";

export default function LandingHeroCTA() {
  const { user } = useAuth();
  const dashboardHref = user?.role === "admin" ? "/admin/users" : "/dashboard";

  if (user) {
    return (
      <Link
        href={dashboardHref}
        className="btn-gold inline-flex items-center gap-2 text-sm sm:text-base"
      >
        Go to Dashboard <Icon name="arrow" />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/signup"
        className="btn-gold inline-flex items-center gap-2 text-sm sm:text-base"
      >
        Get Started <Icon name="arrow" />
      </Link>
      <Link href="/login" className="btn-outline !py-2.5 text-sm sm:text-base">
        Sign In
      </Link>
    </>
  );
}

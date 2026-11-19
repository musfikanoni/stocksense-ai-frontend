// src/constants/nav.ts
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const LANDING_NAV = [
  ["Home", "#home"],
  ["Feature", "#feature"],
  ["Review", "#review"],
  ["Pricing", "#pricing"],
  ["Contact", "#contact"],
] as const;

export const USER_NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Watchlist", href: "/watchlist", icon: "bookmark" },
  { label: "Alerts", href: "/alerts", icon: "bell" },
  { label: "Settings", href: "/settings", icon: "gear" },
] as const;

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "Plan Management", href: "/admin/plans", icon: "tag" },
  { label: "Review Management", href: "/admin/reviews", icon: "star" },
  { label: "Revenue & Billing Info", href: "/admin/billing", icon: "wallet" },
  { label: "Edit Policy & Agreement", href: "/admin/policy", icon: "doc" },
  { label: "Admin Settings", href: "/admin/settings", icon: "gear" },
] as const;

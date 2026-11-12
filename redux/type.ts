export type Signal = "Bullish" | "Neutral" | "Bearish";
export type Range = "1D" | "1W" | "1M" | "1Y";
export type AlertKind = "price" | "breakout" | "signal" | "volume";

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  volume: string | null;
  volumeM: number | null;
  signal: Signal | null;
  confidence: number | null;
  support: number | null;
  resistance: number | null;
  breakout: number | null;
  target: number | null;
  reason: string | null;
  asOf: string | null;
  marketOpen: boolean | null;
  dataSource: "Twelve Data" | "simulated";
}

export interface AlertItem {
  id: string;
  symbol: string;
  name: string;
  kind: AlertKind;
  value: number | Signal;
  channels: { email: boolean; push: boolean; discord: boolean };
  active: boolean;
  createdAt: string;
  lastTriggeredAt: string | null;
}

export interface Plan {
  _id: string;
  id?: string;
  name: string;
  price: number;
  highlight: boolean;
  features: string[];
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: "user" | "admin";
  planName: string;
  planLabel: string;
  billingCycle?: string;
  avatarUrl?: string;
  watchlist: string[];
  blocked: boolean;
  googleLinked: boolean;
  discordConnected: boolean;
  subscriptionStatus?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  joinedAt: string;
}

export interface DashboardData {
  topOpportunities: {
    symbol: string;
    name: string;
    signal: Signal;
    confidence: number;
    target: number | null;
  }[];
  outlook: {
    date: string;
    summary: string;
    bias: number;
    confidence: number;
    bullish: number;
    neutral: number;
    bearish: number;
    reason: string | null;
  } | null;
  highConfidence: {
    symbol: string;
    name: string;
    label: string;
    reason: string | null;
  } | null;
  recentAlerts: {
    id: string;
    symbol: string;
    kind: AlertKind;
    value: number | Signal;
    active: boolean;
    lastTriggeredAt: string | null;
  }[];
  dataReady: boolean;
}

export interface MarketBiasItem {
  symbol: string;
  name: string;
  signal: Signal | null;
  pct: number | null;
}

export interface NotificationItem {
  _id: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface BillingInfo {
  plan: {
    name: string;
    billing: string | null;
    label: string;
    status: string | null;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  };
  invoices: {
    _id: string;
    tx: string;
    planLabel: string;
    amount: number;
    status: string;
    date: string;
    hostedUrl: string | null;
  }[];
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  planName: string;
  billingCycle?: string;
  planLabel: string;
  blocked: boolean;
  joinedAt: string;
  lastLoginAt?: string;
  role: string;
}

export interface AdminStat {
  total: number;
  active: number;
  paid: number;
  blocked: number;
  newThisMonth: number;
}

export interface AdminBillingRow {
  id: string;
  tx: string;
  plan: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  date: string;
  hostedUrl: string | null;
  user: { id: string; name: string; email: string } | null;
}

export interface PolicyDoc {
  title: string;
  text: string;
  updatedAt: string;
}


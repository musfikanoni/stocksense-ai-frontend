export type Plan = { id: number; name: string; price: number; highlight: boolean; features: string[] };

export const planSeed: Plan[] = [
  { id: 1, name: "Free", price: 0, highlight: false,
    features: ["5 stocks on watchlist", "Basic AI signals (delayed)", "End-of-day price alerts (3 max)", "Daily market summary", "Community forum access"] },
  { id: 2, name: "Premium", price: 120, highlight: true,
    features: ["Unlimited watchlist", "Real-time AI buy/sell signals", "Unlimited instant alerts", "Multi-timeframe S/R analysis", "AI price target projections", "Volume confirmation signals", "Momentum & trend scoring", "Premium Discord community", "Priority email support", "API access (coming soon)"] },
];

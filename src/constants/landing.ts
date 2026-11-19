// src/constants/landing.ts
export const LANDING_STATS = [
  ["15K+", "Active Traders"],
  ["500K+", "Signals Delivered"],
  ["125K+", "Levels Generated"],
  ["92%", "Accuracy Percentage"],
] as const;

export const LANDING_FEATURES = [
  {
    title: "Real-Time Market Sentiment",
    img: "sentiment",
    description:
      "Understand overall market momentum with AI-powered sentiment analysis and trend detection.",
  },
  {
    title: "AI Confidence Score",
    img: "confidence",
    description:
      "AI analysis evaluates market conditions, trend strength, and price movement to generate high-confidence trading insights.",
  },
  {
    title: "Smart Support & Resistance",
    img: "support",
    description:
      "Automatically identify key price zones and potential breakout areas using intelligent analysis.",
  },
  {
    title: "Real-Time Alerts",
    img: "alerts",
    description:
      "Instant notifications when your target stocks hit critical price levels or generate new trade signals.",
  },
] as const;

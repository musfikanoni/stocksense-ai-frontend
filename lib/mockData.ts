// Demo data copied from the Figma design. Replaced by the real API in store/api.ts later.
export type Signal = "Bullish" | "Neutral" | "Bearish";
export type Stock = {
  symbol: string; name: string; exchange: string; price: number; change: number;
  confidence: number; volume: string; signal: Signal; signalScore?: number;
};

const S = (symbol: string, name: string, price: number, change: number, confidence: number, volume: string, signal: Signal, signalScore?: number): Stock =>
  ({ symbol, name, exchange: "NASDAQ", price, change, confidence, volume, signal, signalScore });

export const stocks: Stock[] = [
  S("AAPL", "Apple Inc.", 241.5, 3.24, 64, "24M", "Bullish", 89),
  S("MSFT", "Microsoft Corporation", 315.45, 4.15, 58, "18M", "Bullish", 81),
  S("GOOGL", "Alphabet Inc.", 126.0, 2.75, 70, "15M", "Bullish", 77),
  S("AMZN", "Amazon.com, Inc.", 138.9, -1.6, 62, "20M", "Neutral"),
  S("TSLA", "Tesla, Inc.", 707.1, 9.05, 53, "12M", "Neutral"),
  S("META", "Meta Platforms, Inc.", 325.5, -5.3, 59, "10M", "Neutral"),
  S("NFLX", "Netflix, Inc.", 487.75, 8.1, 67, "8M", "Bullish", 74),
  S("NVDA", "NVIDIA Corporation", 220.3, -6.25, 72, "9M", "Bearish"),
  S("ADBE", "Adobe Inc.", 550.9, 10.5, 65, "7M", "Bullish", 70),
  S("PYPL", "PayPal Holdings, Inc.", 88.45, 1.75, 50, "6M", "Neutral"),
  S("INTC", "Intel Corporation", 30.8, -0.4, 48, "5M", "Bearish"),
  S("CSCO", "Cisco Systems, Inc.", 54.7, 0.6, 55, "5M", "Neutral"),
  S("SPCX", "Space Exploration Technologies.", 241.5, 3.24, 61, "4M", "Bullish", 72),
  S("KRAKEN", "Payward Inc.", 241.5, 3.24, 52, "3M", "Neutral"),
  S("STRIPE", "Stripe Inc.", 241.5, 3.24, 66, "3M", "Bullish", 71),
];

export const watchSeed = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NFLX", "NVDA", "ADBE", "PYPL", "INTC"];

export const pct = (s: Stock) => (s.change / (s.price - s.change)) * 100;
export const score = (s: Stock) => s.signalScore ?? s.confidence;

export function levels(s: Stock) {
  if (s.symbol === "AAPL") return { support: 232.8, resistance: 248.2, breakout: 250, target: 241.5 };
  const p = s.price, r = (n: number) => +n.toFixed(2);
  return { support: r(p * 0.964), resistance: r(p * 1.028), breakout: r(p * 1.035), target: r(p * 1.05) };
}

export function reasonFor(s: Stock) {
  if (s.symbol === "AAPL") return "Price broke above key resistance level with strong volume confirmation.";
  return { Bullish: "Price is holding above support with rising volume.", Neutral: "Price is moving sideways between support and resistance.", Bearish: "Price fell below support with heavy selling volume." }[s.signal];
}

export const marketBias: { symbol: string; name: string; signal: Signal; pct: number }[] = [
  { symbol: "SPY", name: "S&P 500", signal: "Bullish", pct: 78 },
  { symbol: "QQQ", name: "NASDAQ 100", signal: "Neutral", pct: 52 },
  { symbol: "IWM", name: "Russell 2000", signal: "Bearish", pct: 67 },
];

export const outlook = {
  date: "Oct 29, 2026",
  summary: "Large-cap tech continues leading with NVDA and META showing institutional accumulation. SPY holding above key 20-day MA. Sector rotation into AI/semis. Watch IWM for broader market confirmation.",
  bias: 89, confidence: 90, bullish: 68, neutral: 24, bearish: 18,
  reason: "Breakout confirmed with strong volume.",
};

export const recentAlertSymbols = ["AAPL", "TSLA", "AMZN", "GOOGL", "MSFT"];

export type Range = "1D" | "1W" | "1M" | "1Y";
const labelSets: Record<Range, string[]> = {
  "1D": ["9:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"],
  "1W": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "1M": Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`),
  "1Y": ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
};
const vol: Record<Range, number> = { "1D": 0.004, "1W": 0.01, "1M": 0.018, "1Y": 0.05 };

// Same symbol and range always give the same chart; the last point equals the current price.
export function history(symbol: string, range: Range) {
  const price = stocks.find((s) => s.symbol === symbol)?.price ?? 100;
  let seed = [...symbol + range].reduce((a, c) => a + c.charCodeAt(0), 7);
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const labels = labelSets[range];
  let p = 100;
  const raw = labels.map(() => (p += (rnd() - 0.45) * 100 * vol[range]));
  const k = price / raw[raw.length - 1];
  return labels.map((label, i) => ({ label, price: +(raw[i] * k).toFixed(2) }));
}

export type AlertKind = "price" | "breakout" | "signal" | "volume";
export type AlertItem = {
  id: number; symbol: string; kind: AlertKind; value: number | Signal;
  channels: { email: boolean; push: boolean; discord: boolean }; created: string; active: boolean;
};
const none = { email: false, push: false, discord: false };
export const alertSeed: AlertItem[] = [
  { id: 1, symbol: "AAPL", kind: "price", value: 235, channels: { ...none, email: true }, created: "Jun 10, 2026", active: true },
  { id: 2, symbol: "TSLA", kind: "signal", value: "Bullish", channels: { ...none, push: true }, created: "Jun 10, 2026", active: true },
  { id: 3, symbol: "NVDA", kind: "volume", value: 2.5, channels: none, created: "Jun 10, 2026", active: false },
  { id: 4, symbol: "MSFT", kind: "breakout", value: 330, channels: { ...none, discord: true }, created: "Jun 10, 2026", active: true },
  { id: 5, symbol: "AMZN", kind: "price", value: 140, channels: none, created: "Jun 10, 2026", active: false },
];

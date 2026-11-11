import type { AlertItem, AlertKind, Signal } from "./mockData";

export type AlertConfig = { price?: number; breakout?: number; signal?: Signal; volume?: number; email: boolean; push: boolean; discord: boolean };

export const alertLabel = (a: AlertItem) =>
  ({ price: `Price Alert In $${a.value}`, breakout: `Breakout Alert In $${a.value}`, signal: `Signal Alert: ${a.value}`, volume: `Volume Alert In ${a.value}M` })[a.kind];

const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// One alert row per condition the user ticked in the modal.
export function configToAlerts(symbol: string, c: AlertConfig, base = Date.now()): AlertItem[] {
  const channels = { email: c.email, push: c.push, discord: c.discord };
  const out: AlertItem[] = [];
  const add = (kind: AlertKind, value: number | Signal) => out.push({ id: base + out.length, symbol, kind, value, channels, created: today(), active: true });
  if (c.price !== undefined) add("price", c.price);
  if (c.breakout !== undefined) add("breakout", c.breakout);
  if (c.signal !== undefined) add("signal", c.signal);
  if (c.volume !== undefined) add("volume", c.volume);
  return out;
}

export const alertToConfig = (a: AlertItem): AlertConfig => ({ [a.kind]: a.value, ...a.channels }) as AlertConfig;

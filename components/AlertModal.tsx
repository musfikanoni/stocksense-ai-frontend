"use client";
import { useEffect, useState } from "react";
import type { Signal } from "@/lib/mockData";
import type { AlertConfig } from "@/lib/alerts";

type Props = { symbol: string; mode: "create" | "edit"; basePrice?: number; initial?: AlertConfig; onSubmit: (c: AlertConfig) => void; onClose: () => void };

function Stepper({ v, set, step = 1, label }: { v: number; set: (n: number) => void; step?: number; label: string }) {
  const btn = "grid h-6 w-6 place-items-center rounded border border-line text-mute hover:text-white";
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={`Decrease ${label}`} className={btn} onClick={() => set(Math.max(0, +(v - step).toFixed(1)))}>-</button>
      <span className="w-12 text-center text-sm tabular-nums">{v}</span>
      <button type="button" aria-label={`Increase ${label}`} className={btn} onClick={() => set(+(v + step).toFixed(1))}>+</button>
    </div>
  );
}

export default function AlertModal({ symbol, mode, basePrice = 241, initial, onSubmit, onClose }: Props) {
  const init: AlertConfig = initial ?? { price: Math.round(basePrice), email: false, push: false, discord: false };
  const [on, setOn] = useState({ price: init.price !== undefined, breakout: init.breakout !== undefined, signal: init.signal !== undefined, volume: init.volume !== undefined });
  const [val, setVal] = useState({ price: init.price ?? Math.round(basePrice), breakout: init.breakout ?? Math.round(basePrice * 1.03), volume: init.volume ?? 2.5 });
  const [signal, setSignal] = useState<Signal>(init.signal ?? "Bullish");
  const [ch, setCh] = useState({ email: init.email, push: init.push, discord: init.discord });

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const any = Object.values(on).some(Boolean);
  const submit = () => onSubmit({
    ...(on.price && { price: val.price }), ...(on.breakout && { breakout: val.breakout }),
    ...(on.signal && { signal }), ...(on.volume && { volume: val.volume }), ...ch,
  });
  const check = "accent-[#f5c84b]";
  const row = (id: "price" | "breakout" | "signal" | "volume", label: string, control: React.ReactNode) => (
    <div className="flex items-center justify-between gap-3 text-sm">
      <label className="flex items-center gap-3"><input type="checkbox" className={check} checked={on[id]} onChange={() => setOn({ ...on, [id]: !on[id] })} />{label}</label>
      {control}
    </div>
  );

  return (
    <div className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Alert for ${symbol}`} onClick={onClose}>
      <div className="card animate-scale-in w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold">{mode === "edit" ? "Change & Edit Alert" : "Set Alert"} <span className="text-mute">({symbol})</span></h2>
          <button onClick={onClose} aria-label="Close" className="text-mute hover:text-white">x</button>
        </div>
        <div className="space-y-4">
          {row("price", "Price Alert ($)", <Stepper v={val.price} set={(n) => setVal({ ...val, price: n })} label="price" />)}
          {row("breakout", "Breakout Alert ($)", <Stepper v={val.breakout} set={(n) => setVal({ ...val, breakout: n })} label="breakout price" />)}
          {row("signal", "Signal Alert", (
            <select aria-label="Signal" className="input !w-28 !py-1" value={signal} onChange={(e) => setSignal(e.target.value as Signal)}>
              {["Bullish", "Neutral", "Bearish"].map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {row("volume", "Volume Alert (Million)", <Stepper v={val.volume} step={0.5} set={(n) => setVal({ ...val, volume: n })} label="volume" />)}
          {(["email", "push", "discord"] as const).map((k) => (
            <label key={k} className="flex items-center gap-3 text-sm">
              <input type="checkbox" className={check} checked={ch[k]} onChange={() => setCh({ ...ch, [k]: !ch[k] })} />
              {{ email: "Email", push: "Push Notification", discord: "Discord Alerts" }[k]}
            </label>
          ))}
        </div>
        <button className="btn-gold mt-6 w-full disabled:opacity-50" disabled={!any} onClick={submit}>{mode === "edit" ? "Confirm" : "Set Alert"}</button>
        {!any && <p className="mt-2 text-center text-xs text-mute">Tick at least one alert type.</p>}
      </div>
    </div>
  );
}

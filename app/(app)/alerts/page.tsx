"use client";
import { useState } from "react";
import Link from "next/link";
import {
  useGetAlertsQuery,
  useUpdateAlertMutation,
  useDeleteAlertMutation,
  useCreateAlertMutation,
} from "@/redux/api/alertsApi";
import { useGetStocksQuery } from "@/redux/api/stocksApi";
import type { AlertItem, Signal } from "@/redux/type";
import AlertModal from "@/components/AlertModal";
import { Icon } from "@/components/icons";
import type { AlertConfig } from "@/lib/alerts";

const tabs = ["All Alert", "Active Alert", "Disable Alert"] as const;

function alertLabel(a: AlertItem) {
  return ({ price: `Price Alert In $${a.value}`, breakout: `Breakout Alert In $${a.value}`, signal: `Signal Alert: ${a.value}`, volume: `Volume Alert In ${a.value}M` })[a.kind];
}

export default function Alerts() {
  const { data: alerts = [], isLoading } = useGetAlertsQuery();
  const { data: stocks = [] } = useGetStocksQuery();
  const [updateAlert] = useUpdateAlertMutation();
  const [deleteAlert] = useDeleteAlertMutation();
  const [createAlert] = useCreateAlertMutation();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All Alert");
  const [editing, setEditing] = useState<AlertItem | null>(null);

  const rows = alerts.filter((a) => tab === "All Alert" || (tab === "Active Alert") === a.active);
  const nameOf = (sym: string) => stocks.find((s) => s.symbol === sym)?.name ?? "";

  const handleEdit = async (c: AlertConfig) => {
    if (!editing) return;
    const conditions: Record<string, unknown> = {};
    if (c.price !== undefined) conditions.price = c.price;
    if (c.breakout !== undefined) conditions.breakout = c.breakout;
    if (c.signal !== undefined) conditions.signal = c.signal;
    if (c.volume !== undefined) conditions.volume = c.volume;
    const kind = (Object.keys(conditions)[0] as AlertItem["kind"]) ?? editing.kind;
    const value = Object.values(conditions)[0] ?? editing.value;
    await updateAlert({ id: editing.id, body: { kind, value: value as number | Signal, channels: { email: c.email, push: c.push, discord: c.discord } } });
    setEditing(null);
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }, (_, i) => <div key={i} className="card h-16 animate-pulse" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="tablist" aria-label="Filter alerts">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-xs transition duration-200 ${tab === t ? "border-gold bg-gold/15 text-gold" : "border-line text-mute hover:text-white"}`}>{t}</button>
        ))}
      </div>
      {rows.length === 0 && <p className="card text-sm text-mute">No alerts here yet. Open a stock and press Set Alert.</p>}
      <ul className="stagger space-y-3">
        {rows.map((a) => (
          <li key={a.id} className="card card-hover flex flex-wrap items-center gap-x-6 gap-y-2 !p-4 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/15 text-gold"><Icon name="bell" /></span>
            <b className="min-w-[10rem]">{alertLabel(a)}</b>
            <Link href={`/stocks/${a.symbol}?from=alerts`} className="min-w-[9rem] hover:text-gold">{a.symbol} <span className="text-mute">({nameOf(a.symbol)})</span></Link>
            <span className="text-xs text-mute">Created {new Date(a.createdAt).toLocaleDateString()}</span>
            <span className="ml-auto flex items-center gap-4">
              <span className={`text-xs ${a.active ? "text-up" : "text-mute"}`}>{a.active ? "Active" : "Disable"}</span>
              <button role="switch" aria-checked={a.active} aria-label={`${a.active ? "Disable" : "Enable"} ${alertLabel(a)} for ${a.symbol}`}
                onClick={() => updateAlert({ id: a.id, body: { active: !a.active } })}
                className={`h-6 w-11 rounded-full p-0.5 transition ${a.active ? "bg-up" : "bg-line"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${a.active ? "translate-x-5" : ""}`} />
              </button>
              <button aria-label={`Delete ${alertLabel(a)} for ${a.symbol}`} onClick={() => deleteAlert(a.id)} className="text-down hover:opacity-80"><Icon name="trash" className="h-[18px] w-[18px]" /></button>
              <button aria-label={`Edit ${alertLabel(a)} for ${a.symbol}`} onClick={() => setEditing(a)} className="text-mute hover:text-white"><Icon name="gear" className="h-[18px] w-[18px]" /></button>
            </span>
          </li>
        ))}
      </ul>
      {editing && (
        <AlertModal symbol={editing.symbol} mode="edit"
          initial={{ [editing.kind]: editing.value, email: editing.channels.email, push: editing.channels.push, discord: editing.channels.discord } as AlertConfig}
          basePrice={stocks.find((s) => s.symbol === editing.symbol)?.price ?? undefined}
          onClose={() => setEditing(null)}
          onSubmit={handleEdit} />
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
import { Settings } from "lucide-react";
import Helmet from "@/components/Helmet";
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
    try {
      await updateAlert({ id: editing.id, body: { kind, value: value as number | Signal, channels: { email: c.email, push: c.push, discord: c.discord } } }).unwrap();
      toast.success("Alert updated successfully!");
      setEditing(null);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not update alert.";
      toast.error(msg);
    }
  };

  const handleToggle = async (a: AlertItem) => {
    try {
      await updateAlert({ id: a.id, body: { active: !a.active } }).unwrap();
      toast.success(a.active ? "Alert disabled." : "Alert enabled.");
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not toggle alert.";
      toast.error(msg);
    }
  };

  const handleDelete = async (a: AlertItem) => {
    try {
      await deleteAlert(a.id).unwrap();
      toast.success("Alert deleted.");
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not delete alert.";
      toast.error(msg);
    }
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }, (_, i) => <div key={i} className="card h-16 animate-pulse" />)}</div>;

  return (
    <div className="space-y-4 w-full min-w-0">
      <Helmet
        title="Alerts"
        description="Manage your custom stock price, breakout, and signal alerts."
      />
      <div className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter alerts">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs transition duration-200 ${tab === t ? "border-gold bg-gold/15 text-gold" : "border-line text-mute hover:text-white"}`}>{t}</button>
        ))}
      </div>
      {rows.length === 0 && <p className="card w-full text-sm text-mute">No alerts here yet. Open a stock and press Set Alert.</p>}
      <ul className="stagger space-y-3 w-full">
        {rows.map((a) => (
          <li key={a.id} className="card card-hover w-full flex flex-col md:flex-row md:items-center justify-between gap-3 !p-4 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Icon name="bell" />
              </span>
              <div className="min-w-0">
                <b className="block text-sm sm:text-base leading-snug">{alertLabel(a)}</b>
                <div className="flex flex-wrap items-center gap-2 text-xs text-mute mt-0.5">
                  <Link href={`/stocks/${a.symbol}?from=alerts`} className="font-semibold text-white/90 hover:text-gold transition">
                    {a.symbol} {nameOf(a.symbol) && `(${nameOf(a.symbol)})`}
                  </Link>
                  <span>•</span>
                  <span>Created {new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t border-line/40 md:border-t-0 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs ${a.active ? "text-up font-medium" : "text-mute"}`}>
                  {a.active ? "Active" : "Disabled"}
                </span>
                <button
                  role="switch"
                  aria-checked={a.active}
                  aria-label={`${a.active ? "Disable" : "Enable"} ${alertLabel(a)} for ${a.symbol}`}
                  onClick={() => handleToggle(a)}
                  className={`h-6 w-11 rounded-full p-0.5 transition ${a.active ? "bg-up" : "bg-line"}`}
                >
                  <span className={`block h-5 w-5 rounded-full bg-white transition ${a.active ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  aria-label={`Edit ${alertLabel(a)} for ${a.symbol}`}
                  onClick={() => setEditing(a)}
                  className="rounded-lg p-1 text-mute hover:text-white transition"
                >
                  <Settings className="h-[18px] w-[18px]" />
                </button>
                <button
                  aria-label={`Delete ${alertLabel(a)} for ${a.symbol}`}
                  onClick={() => handleDelete(a)}
                  className="rounded-lg p-1 text-down hover:opacity-80 transition"
                >
                  <Icon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
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

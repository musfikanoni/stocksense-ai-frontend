"use client";
import { useState } from "react";
import Link from "next/link";
import { useGetStocksQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { alertsSlice } from "@/store/slices";
import { alertLabel, alertToConfig, configToAlerts } from "@/lib/alerts";
import type { AlertItem } from "@/lib/mockData";
import AlertModal from "@/components/AlertModal";
import { Icon } from "@/components/icons";

const tabs = ["All Alert", "Active Alert", "Disable Alert"] as const;

export default function Alerts() {
  const alerts = useAppSelector((s) => s.alerts);
  const dispatch = useAppDispatch();
  const { data: stocks = [] } = useGetStocksQuery();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All Alert");
  const [editing, setEditing] = useState<AlertItem | null>(null);
  const rows = alerts.filter((a) => tab === "All Alert" || (tab === "Active Alert") === a.active);
  const nameOf = (sym: string) => stocks.find((s) => s.symbol === sym)?.name ?? "";

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
            <span className="text-xs text-mute">Created {a.created}</span>
            <span className="ml-auto flex items-center gap-4">
              <span className={`text-xs ${a.active ? "text-up" : "text-mute"}`}>{a.active ? "Active" : "Disable"}</span>
              <button role="switch" aria-checked={a.active} aria-label={`${a.active ? "Disable" : "Enable"} ${alertLabel(a)} for ${a.symbol}`} onClick={() => dispatch(alertsSlice.actions.toggle(a.id))}
                className={`h-6 w-11 rounded-full p-0.5 transition ${a.active ? "bg-up" : "bg-line"}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${a.active ? "translate-x-5" : ""}`} /></button>
              <button aria-label={`Delete ${alertLabel(a)} for ${a.symbol}`} onClick={() => dispatch(alertsSlice.actions.remove(a.id))} className="text-down hover:opacity-80"><Icon name="trash" className="h-[18px] w-[18px]" /></button>
              <button aria-label={`Edit ${alertLabel(a)} for ${a.symbol}`} onClick={() => setEditing(a)} className="text-mute hover:text-white"><Icon name="gear" className="h-[18px] w-[18px]" /></button>
            </span>
          </li>
        ))}
      </ul>
      {editing && (
        <AlertModal symbol={editing.symbol} mode="edit" initial={alertToConfig(editing)}
          basePrice={stocks.find((s) => s.symbol === editing.symbol)?.price}
          onClose={() => setEditing(null)}
          onSubmit={(c) => {
            const [first, ...rest] = configToAlerts(editing.symbol, c);
            dispatch(alertsSlice.actions.replace({ ...first, id: editing.id, created: editing.created, active: editing.active }));
            if (rest.length) dispatch(alertsSlice.actions.addMany(rest));
            setEditing(null);
          }} />
      )}
    </div>
  );
}

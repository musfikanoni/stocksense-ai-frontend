"use client";
import { useState } from "react";
import { adminUsers, billingRows, planOptions, type BillingRow } from "@/lib/adminData";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import { Icon } from "@/components/icons";

const tone = { Paid: "bg-up/15 text-up", Pending: "bg-gold/15 text-gold", Failed: "bg-down/15 text-down" } as const;
const nameOf = (id: number) => adminUsers.find((u) => u.id === id);

function download(r: BillingRow) {
  const u = nameOf(r.userId);
  const blob = new Blob([`Invoice\nTransaction: ${r.tx}\nUser: ${u?.name}\nEmail: ${u?.email}\nPlan: ${r.plan}\nDate: ${r.date}\nStatus: ${r.status}\n`], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `invoice-${r.tx}.txt`; a.click(); URL.revokeObjectURL(a.href);
}

export default function AdminBilling() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All Status");
  const [plan, setPlan] = useState("All Plan");
  const rows = billingRows.filter((r) => {
    const u = nameOf(r.userId);
    return (status === "All Status" || r.status === status) && (plan === "All Plan" || r.plan === plan) && `${u?.name} ${u?.email} ${r.tx}`.toLowerCase().includes(q.toLowerCase());
  });
  return (
    <div className="space-y-6">
      <div className="stagger grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
        <StatCard label="Total Revenue" value="$2,013" delta="+311 user" note="vs last month" />
        <StatCard label="Paid User" value={248} delta="+311 user" note="vs last month" />
      </div>
      <section className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Billing Information</h2>
          <div className="flex flex-wrap gap-2">
            <input className="input !w-48" placeholder="Search here..." aria-label="Search billing" value={q} onChange={(e) => setQ(e.target.value)} />
            <select aria-label="Filter by status" className="input !w-32" value={status} onChange={(e) => setStatus(e.target.value)}>{["All Status", "Pending", "Paid", "Failed"].map((o) => <option key={o}>{o}</option>)}</select>
            <select aria-label="Filter by plan" className="input !w-44" value={plan} onChange={(e) => setPlan(e.target.value)}>{["All Plan", ...planOptions.filter((p) => p !== "Free")].map((o) => <option key={o}>{o}</option>)}</select>
          </div>
        </div>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-xs text-mute"><tr className="border-b border-line"><th className="pb-3 font-normal">User Profile</th><th className="font-normal">Transaction ID</th><th className="font-normal">Plan Name</th><th className="font-normal">Date</th><th className="font-normal">Status</th><th className="text-right font-normal">Action</th></tr></thead>
          <tbody className="stagger divide-y divide-line/60">
            {rows.map((r) => {
              const u = nameOf(r.userId);
              return (
                <tr key={r.tx} className="transition hover:bg-white/5">
                  <td className="py-3"><span className="flex items-center gap-3"><Avatar name={u?.name ?? "?"} size={36} /><span><b className="block">{u?.name}</b><span className="text-xs text-mute">{u?.email}</span></span></span></td>
                  <td className="font-mono text-xs text-mute">{r.tx}</td><td>{r.plan}</td><td className="text-mute">{r.date}</td>
                  <td><span className={`rounded-full px-2.5 py-0.5 text-xs ${tone[r.status]}`}>{r.status}</span></td>
                  <td className="text-right"><button onClick={() => download(r)} aria-label={`Download invoice ${r.tx}`} className="rounded-lg bg-blue-600 p-2 text-white transition hover:brightness-110 active:scale-95"><Icon name="download" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-6 text-center text-sm text-mute">No transactions match these filters.</p>}
      </section>
    </div>
  );
}

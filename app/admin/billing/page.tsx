"use client";
import { useState } from "react";
import { useGetAdminBillingQuery } from "@/redux/api/adminApi";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";
import { Icon } from "@/components/icons";

const tone = { Paid: "bg-up/15 text-up", Pending: "bg-gold/15 text-gold", Failed: "bg-down/15 text-down" } as const;

export default function AdminBilling() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All Status");
  const [plan, setPlan] = useState("All Plan");

  const { data, isLoading } = useGetAdminBillingQuery({
    q: q || undefined,
    status: status !== "All Status" ? status : undefined,
    plan: plan !== "All Plan" ? plan : undefined,
  });

  const rows = data?.rows ?? [];

  return (
    <div className="space-y-6">
      <div className="stagger grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
        <StatCard label="Total Revenue" value={`$${data?.totalRevenue ?? 0}`} delta="" note="all-time collected" />
        <StatCard label="Paid Users" value={data?.paidUsers ?? 0} delta="" note="subscribers" />
      </div>
      <section className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Billing Information ({data?.total ?? 0})</h2>
          <div className="flex flex-wrap gap-2">
            <input className="input !w-48" placeholder="Search here..." aria-label="Search billing" value={q} onChange={(e) => setQ(e.target.value)} />
            <select aria-label="Filter by status" className="input !w-32" value={status} onChange={(e) => setStatus(e.target.value)}>{["All Status", "Pending", "Paid", "Failed"].map((o) => <option key={o}>{o}</option>)}</select>
            <select aria-label="Filter by plan" className="input !w-44" value={plan} onChange={(e) => setPlan(e.target.value)}>{["All Plan", "Premium (Monthly)", "Premium (Yearly)"].map((o) => <option key={o}>{o}</option>)}</select>
          </div>
        </div>
        {isLoading ? <div className="space-y-2 py-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-10 animate-pulse bg-white/5 rounded" />)}</div> : (
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs text-mute"><tr className="border-b border-line"><th className="pb-3 font-normal">User Profile</th><th className="font-normal">Transaction ID</th><th className="font-normal">Plan Name</th><th className="font-normal">Date</th><th className="font-normal">Amount</th><th className="font-normal">Status</th><th className="text-right font-normal">Invoice</th></tr></thead>
            <tbody className="stagger divide-y divide-line/60">
              {rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-white/5">
                  <td className="py-3"><span className="flex items-center gap-3"><Avatar name={r.user?.name ?? "?"} size={36} /><span><b className="block">{r.user?.name ?? "Unknown"}</b><span className="text-xs text-mute">{r.user?.email ?? "—"}</span></span></span></td>
                  <td className="font-mono text-xs text-mute">{r.tx}</td>
                  <td>{r.plan}</td>
                  <td className="text-mute">{new Date(r.date).toLocaleDateString()}</td>
                  <td>${r.amount}</td>
                  <td><span className={`rounded-full px-2.5 py-0.5 text-xs ${tone[r.status]}`}>{r.status}</span></td>
                  <td className="text-right">
                    {r.hostedUrl
                      ? <a href={r.hostedUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-blue-600 p-2 inline-block text-white transition hover:brightness-110 active:scale-95"><Icon name="download" /></a>
                      : <span className="text-xs text-mute">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {rows.length === 0 && !isLoading && <p className="py-6 text-center text-sm text-mute">No transactions match these filters.</p>}
      </section>
    </div>
  );
}

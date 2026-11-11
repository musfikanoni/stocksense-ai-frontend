"use client";
import { useState } from "react";
import Link from "next/link";
import { adminStats, adminUsers, planOptions } from "@/lib/adminData";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";

export default function AdminUsers() {
  const [users, setUsers] = useState(adminUsers);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All Status");
  const [plan, setPlan] = useState("All Plan");
  const rows = users.filter((u) =>
    (status === "All Status" || (status === "Blocked") === u.blocked) && (plan === "All Plan" || u.plan === plan) && `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: number) => setUsers((l) => l.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)));
  return (
    <div className="space-y-6">
      <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{adminStats.map((s) => <StatCard key={s.label} {...s} />)}</div>
      <section className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">All User List</h2>
          <div className="flex flex-wrap gap-2">
            <input className="input !w-48" placeholder="Search here..." aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
            <select aria-label="Filter by status" className="input !w-32" value={status} onChange={(e) => setStatus(e.target.value)}>{["All Status", "Active", "Blocked"].map((o) => <option key={o}>{o}</option>)}</select>
            <select aria-label="Filter by plan" className="input !w-44" value={plan} onChange={(e) => setPlan(e.target.value)}>{["All Plan", ...planOptions].map((o) => <option key={o}>{o}</option>)}</select>
          </div>
        </div>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs text-mute"><tr className="border-b border-line"><th className="pb-3 font-normal">User Profile</th><th className="font-normal">Current Plan</th><th className="font-normal">Joining Date</th><th className="font-normal">Status</th><th className="text-right font-normal">Action</th></tr></thead>
          <tbody className="stagger divide-y divide-line/60">
            {rows.map((u) => (
              <tr key={u.id} className="transition hover:bg-white/5">
                <td className="py-3"><span className="flex items-center gap-3"><Avatar name={u.name} size={36} /><span><b className="block">{u.name}</b><span className="text-xs text-mute">{u.email}</span></span></span></td>
                <td>{u.plan}</td><td className="text-mute">{u.joined}</td>
                <td><span className={`rounded-full px-2.5 py-0.5 text-xs ${u.blocked ? "bg-down/15 text-down" : "bg-up/15 text-up"}`}>{u.blocked ? "Blocked" : "Active"}</span></td>
                <td className="text-right"><span className="inline-flex gap-2">
                  <Link href={`/admin/users/${u.id}`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110">View Profile</Link>
                  <button onClick={() => toggle(u.id)} className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 ${u.blocked ? "bg-up/80" : "bg-down"}`}>{u.blocked ? "Unblock" : "Block"}</button>
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-6 text-center text-sm text-mute">No users match these filters.</p>}
      </section>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useBlockUserMutation,
} from "@/redux/api/adminApi";
import Avatar from "@/components/Avatar";
import StatCard from "@/components/StatCard";

const planOptions = ["All Plan", "Free", "Premium (Monthly)", "Premium (Yearly)"] as const;

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All Status");
  const [plan, setPlan] = useState("All Plan");

  const { data: stats } = useGetAdminStatsQuery();
  const { data: usersData, isLoading } = useGetAdminUsersQuery({
    q: q || undefined,
    status: status !== "All Status" ? status : undefined,
    plan: plan !== "All Plan" ? plan : undefined,
  });
  const [blockUser] = useBlockUserMutation();

  const handleBlock = async (u: { id: string; name: string; blocked: boolean }) => {
    try {
      await blockUser({ id: u.id, blocked: !u.blocked }).unwrap();
      toast.success(u.blocked ? `Unblocked ${u.name}.` : `Blocked ${u.name}.`);
    } catch (e: unknown) {
      const msg = (e as { data?: { message?: string } })?.data?.message ?? "Could not update user status.";
      toast.error(msg);
    }
  };

  const users = usersData?.users ?? [];

  const statCards = [
    { label: "Total User", value: stats?.total ?? 0, delta: `+${stats?.newThisMonth ?? 0} new`, note: "last 30 days", up: true },
    { label: "Active User", value: stats?.active ?? 0, delta: "past 24h", note: "logged in", up: true },
    { label: "Paid User", value: stats?.paid ?? 0, delta: "paying", note: "vs free tier", up: true },
    { label: "Blocked User", value: stats?.blocked ?? 0, delta: "restricted", note: "access revoked", up: false },
  ];

  return (
    <div className="space-y-6">
      <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <section className="card overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">All User List ({usersData?.total ?? 0})</h2>
          <div className="flex flex-wrap gap-2">
            <input className="input !w-48" placeholder="Search here..." aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
            <select aria-label="Filter by status" className="input !w-32" value={status} onChange={(e) => setStatus(e.target.value)}>{["All Status", "Active", "Blocked"].map((o) => <option key={o}>{o}</option>)}</select>
            <select aria-label="Filter by plan" className="input !w-44" value={plan} onChange={(e) => setPlan(e.target.value)}>{planOptions.map((o) => <option key={o}>{o}</option>)}</select>
          </div>
        </div>
        {isLoading ? <div className="space-y-2 py-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-10 animate-pulse bg-white/5 rounded" />)}</div> : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs text-mute"><tr className="border-b border-line"><th className="pb-3 font-normal">User Profile</th><th className="font-normal">Current Plan</th><th className="font-normal">Joining Date</th><th className="font-normal">Status</th><th className="text-right font-normal">Action</th></tr></thead>
            <tbody className="stagger divide-y divide-line/60">
              {users.map((u) => (
                <tr key={u.id} className="transition hover:bg-white/5">
                  <td className="py-3"><span className="flex items-center gap-3"><Avatar name={u.name} size={36} /><span><b className="block">{u.name}</b><span className="text-xs text-mute">{u.email}</span></span></span></td>
                  <td>{u.planLabel}</td>
                  <td className="text-mute">{new Date(u.joinedAt).toLocaleDateString()}</td>
                  <td><span className={`rounded-full px-2.5 py-0.5 text-xs ${u.blocked ? "bg-down/15 text-down" : "bg-up/15 text-up"}`}>{u.blocked ? "Blocked" : "Active"}</span></td>
                  <td className="text-right"><span className="inline-flex gap-2">
                    <Link href={`/admin/users/${u.id}`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110">View Profile</Link>
                    <button onClick={() => handleBlock(u)} className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 ${u.blocked ? "bg-up/80" : "bg-down"}`}>{u.blocked ? "Unblock" : "Block"}</button>
                  </span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {users.length === 0 && !isLoading && <p className="py-6 text-center text-sm text-mute">No users match these filters.</p>}
      </section>
    </div>
  );
}

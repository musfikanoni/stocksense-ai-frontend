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
import Helmet from "@/components/Helmet";

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
      <Helmet
        title="User Management | Admin"
        description="View, search, filter, and manage registered StockSense AI users."
        noIndex
      />
      <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <section className="card !p-4 sm:!p-6 w-full min-w-0">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="font-semibold text-base sm:text-lg shrink-0">All User List ({usersData?.total ?? 0})</h2>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <input className="input flex-1 sm:w-44 text-xs sm:text-sm" placeholder="Search here..." aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
            <select aria-label="Filter by status" className="input w-28 sm:w-32 text-xs sm:text-sm shrink-0" value={status} onChange={(e) => setStatus(e.target.value)}>{["All Status", "Active", "Blocked"].map((o) => <option key={o}>{o}</option>)}</select>
            <select aria-label="Filter by plan" className="input w-36 sm:w-40 text-xs sm:text-sm shrink-0" value={plan} onChange={(e) => setPlan(e.target.value)}>{planOptions.map((o) => <option key={o}>{o}</option>)}</select>
          </div>
        </div>
        {isLoading ? <div className="space-y-2 py-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-10 animate-pulse bg-white/5 rounded" />)}</div> : (
          <div className="w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(245,200,75,0.25)_transparent] -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs text-mute"><tr className="border-b border-line"><th className="pb-3 font-normal">User Profile</th><th className="font-normal">Current Plan</th><th className="font-normal">Joining Date</th><th className="font-normal">Status</th><th className="text-right font-normal">Action</th></tr></thead>
              <tbody className="stagger divide-y divide-line/60">
                {users.map((u) => (
                  <tr key={u.id} className="transition hover:bg-white/5">
                    <td className="py-3"><span className="flex items-center gap-2.5 sm:gap-3"><Avatar name={u.name} url={u.avatarUrl} size={32} /><span><b className="block text-xs sm:text-sm">{u.name}</b><span className="text-[11px] sm:text-xs text-mute truncate block max-w-[140px] sm:max-w-none">{u.email}</span></span></span></td>
                    <td className="whitespace-nowrap text-xs sm:text-sm">{u.planLabel}</td>
                    <td className="whitespace-nowrap text-xs text-mute">{new Date(u.joinedAt).toLocaleDateString()}</td>
                    <td><span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs ${u.blocked ? "bg-down/15 text-down" : "bg-up/15 text-up"}`}>{u.blocked ? "Blocked" : "Active"}</span></td>
                    <td className="text-right"><span className="inline-flex gap-2 whitespace-nowrap">
                      <Link href={`/admin/users/${u.id}`} className="whitespace-nowrap rounded-lg bg-blue-600 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-white transition hover:brightness-110">View Profile</Link>
                      <button onClick={() => handleBlock(u)} className={`whitespace-nowrap rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-white transition hover:brightness-110 ${u.blocked ? "bg-up/80" : "bg-down"}`}>{u.blocked ? "Unblock" : "Block"}</button>
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {users.length === 0 && !isLoading && <p className="py-6 text-center text-sm text-mute">No users match these filters.</p>}
      </section>
    </div>
  );
}

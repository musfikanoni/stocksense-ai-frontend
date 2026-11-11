"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminUsers, invoicesFor } from "@/lib/adminData";
import Avatar from "@/components/Avatar";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const user = adminUsers.find((u) => String(u.id) === id);
  if (!user) return <p className="text-down">We could not find that user. <Link href="/admin/users" className="underline">Back to users</Link></p>;
  const free = user.plan === "Free";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/users" className="text-sm text-mute transition hover:text-gold">&larr; Back to users</Link>
      <section className="card flex flex-col items-center gap-3 text-center"><h2 className="self-start font-semibold">User Profile</h2>
        <Avatar name={user.name} size={80} /><div><p className="text-lg font-semibold">{user.name}</p><p className="text-sm text-mute">{user.email}</p></div></section>
      <section className="card flex items-center justify-between"><div><h2 className="font-semibold">Current Plan</h2><p className="mt-1 text-sm text-mute">{free ? "Free plan" : user.plan}</p></div>
        <span className={`rounded-full px-3 py-1 text-xs ${user.blocked ? "bg-down/15 text-down" : "bg-up/15 text-up"}`}>{user.blocked ? "Blocked" : "Active"}</span></section>
      <section className="card overflow-x-auto"><h2 className="mb-3 font-semibold">Invoice History</h2>
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-xs text-mute"><tr><th className="pb-2 font-normal">Date</th><th className="font-normal">Plan</th><th className="font-normal">Billing</th><th className="text-right font-normal">Amount</th></tr></thead>
          <tbody className="divide-y divide-line/60">{invoicesFor(user.id).map((r, i) => (<tr key={i}><td className="py-2.5">{r.date}</td><td>{r.plan}</td><td className="text-mute">{r.billing}</td><td className="text-right">{r.amount}</td></tr>))}</tbody>
        </table></section>
    </div>
  );
}

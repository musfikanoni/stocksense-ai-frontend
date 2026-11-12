"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useGetAdminUserQuery,
  useBlockUserMutation,
} from "@/redux/api/adminApi";
import Avatar from "@/components/Avatar";
import Skeleton from "@/components/Skeleton";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetAdminUserQuery(id);
  const [blockUser] = useBlockUserMutation();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-60" /></div>;
  if (!data?.user) return <p className="text-down">We could not find that user. <Link href="/admin/users" className="underline">Back to users</Link></p>;

  const { user, invoices } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/users" className="text-sm text-mute transition hover:text-gold">&larr; Back to users</Link>
      <section className="card flex flex-col items-center gap-3 text-center">
        <h2 className="self-start font-semibold">User Profile</h2>
        <Avatar name={user.name} size={80} />
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-mute">{user.email}</p>
          <p className="text-xs text-mute mt-1">Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
        </div>
        <button onClick={() => blockUser({ id: user.id, blocked: !user.blocked })} className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition hover:brightness-110 ${user.blocked ? "bg-up/80" : "bg-down"}`}>
          {user.blocked ? "Unblock User" : "Block User"}
        </button>
      </section>
      <section className="card flex items-center justify-between">
        <div><h2 className="font-semibold">Current Plan</h2><p className="mt-1 text-sm text-mute">{user.planLabel}</p></div>
        <span className={`rounded-full px-3 py-1 text-xs ${user.blocked ? "bg-down/15 text-down" : "bg-up/15 text-up"}`}>{user.blocked ? "Blocked" : "Active"}</span>
      </section>
      <section className="card overflow-x-auto">
        <h2 className="mb-3 font-semibold">Invoice History</h2>
        {invoices.length === 0
          ? <p className="text-sm text-mute">No invoices for this user.</p>
          : <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs text-mute"><tr><th className="pb-2 font-normal">Date</th><th className="font-normal">Plan</th><th className="font-normal">Status</th><th className="text-right font-normal">Amount</th></tr></thead>
              <tbody className="divide-y divide-line/60">
                {invoices.map((r) => (
                  <tr key={r._id}>
                    <td className="py-2.5">{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.planLabel}</td>
                    <td className="text-mute">{r.status}</td>
                    <td className="text-right">${r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </section>
    </div>
  );
}

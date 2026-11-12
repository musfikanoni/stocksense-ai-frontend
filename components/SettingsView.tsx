"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import {
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetAvatarSignatureMutation,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
} from "@/redux/api/authApi";
import {
  useGetBillingQuery,
  useCreatePortalMutation,
} from "@/redux/api/billingApi";
import { useGetPolicyQuery } from "@/redux/api/plansApi";
import { useAuth } from "@/lib/authContext";

export type Tab = "profile" | "security" | "billing" | "policy";
const labels: Record<Tab, string> = {
  profile: "Profile",
  security: "Security & Privacy",
  billing: "Payment & Billing",
  policy: "Policy & Agreement",
};
const note =
  "animate-fade-up rounded-lg bg-up/15 px-4 py-2 text-center text-sm text-up";

export default function SettingsView({ tabs }: { tabs: Tab[] }) {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    first: user?.firstName ?? "",
    last: user?.lastName ?? "",
  });
  const [msg, setMsg] = useState("");
  const [pw, setPw] = useState({ cur: "", next: "", again: "" });
  const [err, setErr] = useState("");
  const [delPw, setDelPw] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  const { data: billing } = useGetBillingQuery(undefined, {
    skip: !tabs.includes("billing") || !user,
  });
  const { data: policy } = useGetPolicyQuery(undefined, {
    skip: !tabs.includes("policy"),
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [createPortal, { isLoading: isPortalLoading }] = useCreatePortalMutation();
  const [updateMe, { isLoading: isUpdatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPw }] = useChangePasswordMutation();
  const [deleteAccountApi, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const [getAvatarSignature] = useGetAvatarSignatureMutation();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const busy =
    isPortalLoading || isUpdatingProfile || isChangingPw || isDeletingAccount || isUploadingAvatar;
  const full = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  useEffect(() => {
    if (!confirmDel) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setConfirmDel(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [confirmDel]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setIsUploadingAvatar(true);

    try {
      const ticket = await getAvatarSignature().unwrap();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", ticket.apiKey);
      formData.append("timestamp", String(ticket.timestamp));
      formData.append("signature", ticket.signature);
      if (ticket.fields) {
        Object.entries(ticket.fields).forEach(([k, v]) => {
          formData.append(k, String(v));
        });
      }

      const res = await fetch(ticket.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error?.message || "Failed to upload image to cloud storage.");
      }

      const data = await res.json();
      if (!data.secure_url) {
        throw new Error("No image URL returned from upload provider.");
      }

      const updated = await updateAvatar({ url: data.secure_url }).unwrap();
      setUser(updated.user);
      setAvatarPreview(null);
      toast.success("Profile picture updated successfully!");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as Error)?.message ||
        "Could not update profile picture. Please verify backend cloud storage credentials.";
      toast.error(errorMsg);
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const updated = await deleteAvatar().unwrap();
      setUser(updated.user);
      setAvatarPreview(null);
      toast.success("Profile picture removed.");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Could not remove profile picture.";
      toast.error(errorMsg);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateMe({
        firstName: draft.first,
        lastName: draft.last,
      }).unwrap();
      setUser(res.user);
      setEditing(false);
      setMsg("Profile saved.");
      toast.success("Profile saved successfully!");
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Could not save profile.";
      setErr(msg);
      toast.error(msg);
    }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.again) {
      const msg = "New passwords do not match.";
      setErr(msg);
      toast.error(msg);
      return;
    }
    try {
      const res = await changePassword({
        currentPassword: pw.cur,
        newPassword: pw.next,
      }).unwrap();
      setUser(res.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("ss_token", res.token);
      }
      setErr("");
      setPw({ cur: "", next: "", again: "" });
      setMsg("Password updated.");
      toast.success("Password updated successfully!");
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Could not change password.";
      setErr(msg);
      toast.error(msg);
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteAccountApi({ password: delPw }).unwrap();
      toast.success("Account deleted successfully.");
      logout();
      router.push("/");
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Could not delete account.";
      setErr(msg);
      toast.error(msg);
      setConfirmDel(false);
    }
  };

  const openPortal = async () => {
    try {
      const { url } = await createPortal().unwrap();
      window.location.href = url;
    } catch {
      const msg = "Billing portal is not configured yet.";
      setMsg(msg);
      toast.info(msg);
    }
  };

  const box = "mx-auto w-full max-w-md";

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Settings sections"
      >
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => {
              setTab(t);
              setMsg("");
              setErr("");
            }}
            className={`rounded-full border px-4 py-1.5 text-xs transition duration-200 ${
              tab === t
                ? "border-gold bg-gold/15 text-gold"
                : "border-line text-mute hover:text-white"
            }`}
          >
            {labels[t]}
          </button>
        ))}
      </div>
      {msg && <p role="status" className={`${note} ${box}`}>{msg}</p>}

      {tab === "profile" && !editing && (
        <section className={`card animate-fade-up ${box} space-y-4 text-center`}>
          <div className="flex justify-center">
            <Avatar name={full} url={user?.avatarUrl} size={88} />
          </div>
          <div>
            <p className="text-lg font-semibold">{full}</p>
            <p className="text-sm text-mute">{user?.email}</p>
            <p className="text-xs text-gold mt-1 font-medium">{user?.planLabel || "Free Tier"}</p>
          </div>
          <button
            className="btn-gold w-full"
            onClick={() => {
              setDraft({
                first: user?.firstName ?? "",
                last: user?.lastName ?? "",
              });
              setEditing(true);
              setMsg("");
            }}
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-down/60 py-2.5 text-sm text-down transition hover:bg-down/10"
          >
            <Icon name="logout" />
            Log Out
          </button>
        </section>
      )}
      {tab === "profile" && editing && (
        <form
          className={`card animate-fade-up ${box} space-y-4`}
          onSubmit={saveProfile}
        >
          {/* Profile Picture Upload & Edit */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <div className="relative group">
              <Avatar
                name={`${draft.first} ${draft.last}`}
                url={avatarPreview || user?.avatarUrl}
                size={84}
              />
              <label
                htmlFor="avatar-file-upload"
                className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs text-white"
                title="Change profile picture"
              >
                <Icon name="camera" className="h-5 w-5 mb-0.5 text-gold" />
                <span className="text-[11px] font-medium">Change</span>
              </label>

              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/75">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                </div>
              )}
            </div>

            <input
              id="avatar-file-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
            />

            <div className="flex items-center gap-3 text-xs">
              <label
                htmlFor="avatar-file-upload"
                className={`font-medium transition ${
                  isUploadingAvatar
                    ? "text-mute cursor-not-allowed"
                    : "text-gold hover:underline cursor-pointer"
                }`}
              >
                {isUploadingAvatar ? "Uploading picture..." : "Upload Photo"}
              </label>

              {(user?.avatarUrl || avatarPreview) && (
                <>
                  <span className="text-mute">•</span>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    className="text-down hover:underline font-medium transition disabled:opacity-50"
                  >
                    Remove Photo
                  </button>
                </>
              )}
            </div>
            <p className="text-[11px] text-mute">JPG, PNG, or WEBP (Max 5MB)</p>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block text-mute">First Name</span>
            <input
              required
              className="input"
              value={draft.first}
              onChange={(e) => setDraft({ ...draft, first: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-mute">Last Name</span>
            <input
              required
              className="input"
              value={draft.last}
              onChange={(e) => setDraft({ ...draft, last: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-mute">Email (Not Changeable)</span>
            <input
              disabled
              className="input opacity-60"
              value={user?.email ?? ""}
              readOnly
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-outline flex-1"
              onClick={() => {
                setEditing(false);
                setAvatarPreview(null);
              }}
            >
              Cancel
            </button>
            <button className="btn-gold flex-1" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Confirm"}
            </button>
          </div>
        </form>
      )}

      {tab === "security" && (
        <div className={`${box} space-y-6`}>
          <form className="card animate-fade-up space-y-3" onSubmit={changePw}>
            <h2 className="flex items-center gap-2 font-semibold">
              <Icon name="gear" className="h-4 w-4 text-gold" />
              Change Password
            </h2>
            <label className="block text-sm">
              <span className="mb-1 block text-mute">Current Password</span>
              <input
                type="password"
                required
                className="input"
                placeholder="Enter your current password"
                value={pw.cur}
                onChange={(e) => setPw({ ...pw, cur: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-mute">New Password</span>
              <input
                type="password"
                required
                minLength={8}
                className="input"
                placeholder="Enter a new password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-mute">Confirm Password</span>
              <input
                type="password"
                required
                className="input"
                placeholder="Enter new confirm password"
                value={pw.again}
                onChange={(e) => setPw({ ...pw, again: e.target.value })}
              />
            </label>
            {err && (
              <p role="alert" className="text-sm text-down">
                {err}
              </p>
            )}
            <button className="btn-gold w-full" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Confirm"}
            </button>
          </form>
          <form
            className="card animate-fade-up space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setConfirmDel(true);
            }}
          >
            <h2 className="flex items-center gap-2 font-semibold text-down">
              <Icon name="trash" className="h-4 w-4" />
              Delete Account
            </h2>
            <label className="block text-sm">
              <span className="mb-1 block text-mute">Password</span>
              <input
                type="password"
                required
                className="input"
                placeholder="Enter your password"
                value={delPw}
                onChange={(e) => setDelPw(e.target.value)}
              />
            </label>
            <button className="btn-gold w-full" type="submit">
              Continue
            </button>
          </form>
        </div>
      )}

      {tab === "billing" && (
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <section className="card animate-fade-up flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Current Plan</h2>
              <p className="mt-1 text-sm text-mute">
                {billing?.plan.label ?? "Free"}{" "}
                <span className="ml-2 rounded-full bg-up/15 px-2 py-0.5 text-xs text-up">
                  {billing?.plan.status ?? "Active"}
                </span>
              </p>
              {billing?.plan.currentPeriodEnd && (
                <p className="text-xs text-mute mt-1">
                  Renews {new Date(billing.plan.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {billing?.plan.name !== "Free" && (
                <button
                  onClick={openPortal}
                  disabled={busy}
                  className="btn-outline !py-2 text-sm"
                >
                  Manage
                </button>
              )}
              <Link href="/subscription" className="btn-gold !py-2 text-sm">
                Upgrade
              </Link>
            </div>
          </section>
          <section className="card animate-fade-up overflow-x-auto">
            <h2 className="mb-3 font-semibold">Invoice History</h2>
            {billing?.invoices.length === 0 ? (
              <p className="text-sm text-mute">No invoices yet.</p>
            ) : (
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="text-xs text-mute">
                  <tr>
                    <th className="pb-2 font-normal">Date</th>
                    <th className="font-normal">Plan</th>
                    <th className="font-normal">Status</th>
                    <th className="text-right font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {(billing?.invoices ?? []).map((r) => (
                    <tr key={r._id}>
                      <td className="py-2.5">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td>{r.planLabel}</td>
                      <td className="text-mute">{r.status}</td>
                      <td className="text-right">${r.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}

      {tab === "policy" && (
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {policy &&
            Object.entries(policy).map(([key, doc]) => (
              <section key={key} className="card animate-fade-up">
                <h2 className="mb-3 flex items-center gap-2 font-semibold">
                  <Icon name="doc" className="h-4 w-4 text-gold" />
                  {doc.title}
                </h2>
                <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-mute">
                  {doc.text}
                </pre>
              </section>
            ))}
        </div>
      )}

      {confirmDel && (
        <div
          className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Delete account"
          onClick={() => setConfirmDel(false)}
        >
          <div
            className="card animate-scale-in w-full max-w-sm space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-down/15 text-down">
              <Icon name="trash" className="h-6 w-6" />
            </span>
            <h2 className="font-semibold">Delete Account</h2>
            <p className="text-sm text-mute">
              This removes your account and data. It cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-outline flex-1"
                onClick={() => setConfirmDel(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-lg bg-down py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                disabled={busy}
                onClick={deleteAccount}
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

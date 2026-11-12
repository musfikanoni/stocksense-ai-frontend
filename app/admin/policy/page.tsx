"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetPolicyQuery } from "@/redux/api/plansApi";
import { useAdminUpdatePolicyMutation } from "@/redux/api/adminApi";
import { Icon } from "@/components/icons";

export default function AdminPolicy() {
  const { data: policy, isLoading } = useGetPolicyQuery();
  const [updatePolicy] = useAdminUpdatePolicyMutation();

  const [texts, setTexts] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (policy) {
      setTexts({
        privacy: policy.privacy?.text ?? "",
        terms: policy.terms?.text ?? "",
      });
    }
  }, [policy]);

  const save = async (key: string) => {
    setBusy(key);
    const title = key === "privacy" ? "Privacy Policy" : "Terms & Conditions";
    try {
      await updatePolicy({ key, text: texts[key] ?? "" }).unwrap();
      const successMsg = `Saved ${title}. It is now live.`;
      setMsg(successMsg);
      toast.success(successMsg);
    } catch {
      const errorMsg = `Could not save ${title}.`;
      setMsg(errorMsg);
      toast.error(errorMsg);
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) return <div className="card text-center text-mute">Loading policies…</div>;

  const docs = [
    { key: "privacy", title: "Privacy Policy", updated: policy?.privacy?.updatedAt ? new Date(policy.privacy.updatedAt).toLocaleDateString() : "—" },
    { key: "terms", title: "Terms & Conditions", updated: policy?.terms?.updatedAt ? new Date(policy.terms.updatedAt).toLocaleDateString() : "—" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {msg && <p role="status" className="animate-fade-up rounded-lg bg-up/15 px-4 py-2 text-sm text-up">{msg}</p>}
      <div className="stagger space-y-6">
        {docs.map((d) => (
          <section key={d.key} className="card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-semibold"><Icon name="doc" className="h-4 w-4 text-gold" />{d.title}</h2>
              <span className="text-xs text-mute">Last Update: {d.updated}</span>
            </div>
            <textarea aria-label={`${d.title} text`} rows={12} className="input leading-relaxed"
              value={texts[d.key] ?? ""} onChange={(e) => { setTexts({ ...texts, [d.key]: e.target.value }); setMsg(""); }} />
            <div className="mt-3 flex justify-end">
              <button disabled={busy === d.key} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]" onClick={() => save(d.key)}>
                {busy === d.key ? "Saving…" : "Update Changes"}
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

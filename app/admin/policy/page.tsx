"use client";
import { useState } from "react";
import { privacyText, termsText } from "@/lib/policy";
import { Icon } from "@/components/icons";

type Doc = { key: string; title: string; text: string; updated: string };

export default function AdminPolicy() {
  const [docs, setDocs] = useState<Doc[]>([
    { key: "privacy", title: "Privacy Policy", text: privacyText, updated: "20/06/2026" },
    { key: "terms", title: "Terms & Conditions", text: termsText, updated: "20/06/2026" },
  ]);
  const [msg, setMsg] = useState("");
  const edit = (key: string, text: string) => setDocs((d) => d.map((x) => (x.key === key ? { ...x, text } : x)));
  const save = (key: string) => {
    const t = new Date().toLocaleDateString("en-GB");
    setDocs((d) => d.map((x) => (x.key === key ? { ...x, updated: t } : x)));
    setMsg("Saved. The updated policy is now live.");
  };
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {msg && <p role="status" className="animate-fade-up rounded-lg bg-up/15 px-4 py-2 text-sm text-up">{msg}</p>}
      <div className="stagger space-y-6">
        {docs.map((d) => (
          <section key={d.key} className="card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-semibold"><Icon name="doc" className="h-4 w-4 text-gold" />{d.title}</h2><span className="text-xs text-mute">Last Update: {d.updated}</span></div>
            <textarea aria-label={`${d.title} text`} rows={12} className="input leading-relaxed" value={d.text} onChange={(e) => { edit(d.key, e.target.value); setMsg(""); }} />
            <div className="mt-3 flex justify-end"><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]" onClick={() => save(d.key)}>Update Changes</button></div>
          </section>
        ))}
      </div>
    </div>
  );
}

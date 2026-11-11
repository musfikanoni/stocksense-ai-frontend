"use client";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <>
      <button onClick={() => { setSent(false); setOpen(true); }} className="flex items-center gap-2 text-sm text-mute transition hover:text-white"><Icon name="chat" />Message Us</button>
      {open && (
        <div className="animate-fade-in fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Message us" onClick={() => setOpen(false)}>
          <div className="card animate-scale-in w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Message Us</h2><button onClick={() => setOpen(false)} aria-label="Close" className="text-mute hover:text-white"><Icon name="x" /></button></div>
            {sent ? <p role="status" className="py-6 text-center text-up">Thanks! We will get back to you soon.</p> : (
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <input required aria-label="Name" placeholder="Your name" className="input" />
                <input required type="email" aria-label="Email" placeholder="Your email" className="input" />
                <textarea required rows={4} aria-label="Message" placeholder="How can we help?" className="input" />
                <button className="btn-gold w-full" type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

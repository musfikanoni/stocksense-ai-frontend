"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/icons";
import Terms from "@/components/Terms";

function Otp({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, d: string) => { const v = [...value]; v[i] = d; onChange(v); };
  return (
    <div className="flex gap-2" role="group" aria-label="6 digit code">
      {value.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`} value={d}
          className="input min-w-0 !border-gold/20 !px-0 !py-3 text-center text-lg"
          onChange={(e) => { const c = e.target.value.replace(/\D/g, "").slice(-1); set(i, c); if (c && i < 5) refs.current[i + 1]?.focus(); }}
          onKeyDown={(e) => { if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus(); }}
          onPaste={(e) => {
            const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (t) { e.preventDefault(); onChange(Array.from({ length: 6 }, (_, k) => t[k] ?? "")); refs.current[Math.min(t.length, 5)]?.focus(); }
          }} />
      ))}
    </div>
  );
}

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (step === 2) {
      if (pw !== pw2) { setErr("Passwords do not match."); return; }
      router.push("/login"); return;
    }
    setStep(step + 1);
  };
  const titles = ["Forgot Password", "Verification Code", "Set New Password"];
  const hints = [
    "No worries, we'll send you reset instructions. Give us your email address",
    `Please enter the code sent to ${email || "example123@gmail.com"}`,
    "Your new password must be different to previously used passwords.",
  ];

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form key={step} onSubmit={next} className="animate-scale-in w-full max-w-md space-y-5 rounded-3xl border border-gold/20 bg-gradient-to-b from-[#1b1608] to-[#0c0a05] p-8 shadow-[0_20px_60px_-20px_rgba(245,200,75,0.25)]">
        <Link href="/" aria-label="StockSense home" className="flex justify-center"><Brand /></Link>
        <div className="space-y-1 text-center">
          <p className="text-xs text-mute">Step {step + 1} of 3</p>
          <h1 className="text-2xl font-bold">{titles[step]}</h1>
          <p className="text-xs text-mute">{hints[step]}</p>
        </div>
        {step === 0 && <input type="email" required autoFocus aria-label="Email address" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input !border-gold/20 !py-3" />}
        {step === 1 && <Otp value={otp} onChange={setOtp} />}
        {step === 2 && (
          <div className="space-y-3">
            <input type="password" required minLength={8} autoFocus aria-label="New password" placeholder="Create a new password" value={pw} onChange={(e) => setPw(e.target.value)} className="input !border-gold/20 !py-3" />
            <input type="password" required aria-label="Confirm password" placeholder="Confirm password" value={pw2} onChange={(e) => setPw2(e.target.value)} className="input !border-gold/20 !py-3" />
          </div>
        )}
        {err && <p role="alert" className="text-center text-sm text-down">{err}</p>}
        <button className="btn-gold w-full !py-3" type="submit" disabled={step === 1 && otp.some((d) => !d)}>{["Continue", "Confirm OTP", "Confirm"][step]}</button>
        <Link href="/login" className="block text-center text-sm text-mute transition hover:text-white">Back to log in</Link>
        <Terms />
      </form>
    </main>
  );
}

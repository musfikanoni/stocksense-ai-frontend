"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import Terms from "./Terms";
import { Brand } from "./icons";

type Field = { name: string; type: string; ph: string };

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const signup = mode === "signup";
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fields: Field[] = signup
    ? [{ name: "name", type: "text", ph: "Enter your name" }, { name: "email", type: "email", ph: "Enter an email address" },
       { name: "password", type: "password", ph: "Enter a password" }, { name: "confirm", type: "password", ph: "Enter confirm password" }]
    : [{ name: "email", type: "email", ph: "Enter your email" }, { name: "password", type: "password", ph: "Enter your password" }];

  const go = () => { setBusy(true); setTimeout(() => router.push("/dashboard"), 500); };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    if (signup && d.get("password") !== d.get("confirm")) { setError("Passwords do not match."); return; }
    setError(""); go();
  };

  return (
    <AuthShell>
      <form onSubmit={submit} className="animate-scale-in w-full max-w-md space-y-4 rounded-3xl border border-gold/20 bg-gradient-to-b from-[#1b1608] to-[#0c0a05] p-8 shadow-[0_20px_60px_-20px_rgba(245,200,75,0.25)]">
        <Link href="/" aria-label="StockSense home" className="mb-2 flex justify-center lg:hidden"><Brand /></Link>
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">{signup ? "Create Account" : "Welcome back!"}</h1>
          <p className="text-xs text-mute">{signup ? "Please provide your required information to create an account" : "Already have an account? Please enter your email & password to log in"}</p>
        </div>
        <div className="space-y-3 pt-2">
          {fields.map((f) => (
            <div key={f.name} className="relative">
              <input name={f.name} aria-label={f.ph} placeholder={f.ph} required minLength={f.type === "password" ? 6 : undefined}
                type={f.type === "password" && show ? "text" : f.type} autoComplete={f.type === "password" ? (signup ? "new-password" : "current-password") : f.type === "email" ? "email" : "name"}
                className="input !border-gold/20 !py-3 !pr-14" />
              {f.type === "password" && f.name === "password" && (
                <button type="button" onClick={() => setShow(!show)} aria-pressed={show} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mute transition hover:text-gold">{show ? "Hide" : "Show"}</button>
              )}
            </div>
          ))}
        </div>
        {error && <p role="alert" className="text-center text-sm text-down">{error}</p>}
        <button className="btn-gold w-full !py-3" type="submit" disabled={busy}>{busy ? "Please wait..." : signup ? "Create Account" : "Log In"}</button>
        {!signup && <Link href="/forgot-password" className="block text-center text-sm text-gold transition hover:underline">Forgot Password?</Link>}
        <div className="flex items-center gap-3 text-xs text-mute"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        {/* Demo only: Google sign-in is connected when the backend is added */}
        <button type="button" onClick={go} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold/20 bg-white/5 py-3 text-sm transition duration-200 hover:border-gold/60 hover:bg-white/10 active:scale-[0.98]"><GoogleG />Continue With Google</button>
        <Link href={signup ? "/login" : "/signup"} className="block rounded-lg border border-gold/40 py-3 text-center text-sm font-medium text-gold transition duration-200 hover:bg-gold/10 active:scale-[0.98]">{signup ? "Log In" : "Create Account"}</Link>
        {!signup && <p className="text-center text-xs"><Link href="/dashboard" className="text-mute transition hover:text-white">Try demo without an account</Link></p>}
        <Terms />
      </form>
    </AuthShell>
  );
}

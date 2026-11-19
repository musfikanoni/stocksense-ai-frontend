"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Brand } from "@/components/icons";
import Terms from "@/components/Terms";
import Helmet from "@/components/Helmet";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/redux/api/authApi";

function Otp({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, d: string) => {
    const v = [...value];
    v[i] = d;
    onChange(v);
  };
  return (
    <div className="flex gap-2" role="group" aria-label="6 digit code">
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={d}
          className="input min-w-0 !border-gold/20 !px-0 !py-3 text-center text-lg"
          onChange={(e) => {
            const c = e.target.value.replace(/\D/g, "").slice(-1);
            set(i, c);
            if (c && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0)
              refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (t) {
              e.preventDefault();
              onChange(Array.from({ length: 6 }, (_, k) => t[k] ?? ""));
              refs.current[Math.min(t.length, 5)]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordView() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [forgotPasswordApi, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [verifyOtpApi, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [resetPasswordApi, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const busy = isForgotLoading || isVerifyLoading || isResetLoading;

  const handleResend = async () => {
    if (resendCooldown > 0 || busy) return;
    try {
      await forgotPasswordApi({ email }).unwrap();
      toast.success("Verification code resent to your email!");
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      interface ErrorResponse {
        data?: { message?: string };
        error?: string;
        message?: string;
      }
      const e = error as ErrorResponse;
      toast.error(e?.data?.message || "Failed to resend code. Please try again.");
    }
  };

  const next = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      if (step === 0) {
        await forgotPasswordApi({ email }).unwrap();
        toast.success("Verification code sent to your email!");
        setStep(1);
      } else if (step === 1) {
        const res = await verifyOtpApi({
          email,
          otp: otp.join(""),
        }).unwrap();
        setResetToken(res.resetToken);
        toast.success("Code verified successfully!");
        setStep(2);
      } else {
        if (pw !== pw2) {
          const m = "Passwords do not match.";
          setErr(m);
          toast.error(m);
          return;
        }
        await resetPasswordApi({ resetToken, password: pw }).unwrap();
        toast.success("Password reset successfully! Redirecting to login...");
        router.push("/login");
      }
    } catch (error: unknown) {
      interface ErrorResponse {
        data?: { message?: string };
        error?: string;
        message?: string;
        status?: number | string;
      }
      const e = error as ErrorResponse;
      const msg =
        e?.data?.message ||
        (e?.error?.includes("Failed to fetch")
          ? "Cannot reach the API server. Please check your network."
          : e?.error) ||
        e?.message ||
        "Something went wrong. Try again.";
      setErr(msg);
      toast.error(msg);
    }
  };

  const titles = ["Forgot Password", "Verification Code", "Set New Password"];
  const hints = [
    "No worries, we'll send you reset instructions. Give us your email address",
    `Please enter the code sent to ${email || "example123@gmail.com"}`,
    "Your new password must be different to previously used passwords.",
  ];

  return (
    <>
      <Helmet
        title={titles[step]}
        description="Reset your StockSense AI account password via secure 6-digit verification code."
      />
      <form
        key={step}
        onSubmit={next}
        className="animate-scale-in w-full max-w-md space-y-5 rounded-3xl border border-gold/20 bg-gradient-to-b from-[#1b1608] to-[#0c0a05] p-8 shadow-[0_20px_60px_-20px_rgba(245,200,75,0.25)]"
      >
        <Link href="/" aria-label="StockSense AI home" className="flex justify-center">
          <Brand />
        </Link>
        <div className="space-y-1 text-center">
          <p className="text-xs text-mute">Step {step + 1} of 3</p>
          <h1 className="text-2xl font-bold">{titles[step]}</h1>
          <p className="text-xs text-mute">{hints[step]}</p>
        </div>
        {step === 0 && (
          <input
            type="email"
            required
            autoFocus
            aria-label="Email address"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input !border-gold/20 !py-3"
          />
        )}
        {step === 1 && (
          <div className="space-y-3">
            <Otp value={otp} onChange={setOtp} />
            <div className="flex items-center justify-between text-xs text-mute pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setOtp(Array(6).fill(""));
                }}
                className="text-mute hover:text-white transition"
              >
                &larr; Change email
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || busy}
                onClick={handleResend}
                className="text-gold hover:underline disabled:opacity-50 disabled:no-underline font-medium"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <input
              type="password"
              required
              minLength={8}
              autoFocus
              aria-label="New password"
              placeholder="Create a new password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="input !border-gold/20 !py-3"
            />
            <input
              type="password"
              required
              aria-label="Confirm password"
              placeholder="Confirm password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="input !border-gold/20 !py-3"
            />
          </div>
        )}
        {err && (
          <p role="alert" className="text-center text-sm text-down">
            {err}
          </p>
        )}
        <button
          className="btn-gold w-full !py-3"
          type="submit"
          disabled={busy || (step === 1 && otp.some((d) => !d))}
        >
          {busy ? "Please wait..." : ["Continue", "Confirm OTP", "Confirm"][step]}
        </button>
        <Link
          href="/login"
          className="block text-center text-sm text-mute transition hover:text-white"
        >
          Back to log in
        </Link>
        <Terms />
      </form>
    </>
  );
}

import type { Metadata } from "next";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView";

export const metadata: Metadata = {
  title: "Forgot Password | StockSense AI",
  description: "Reset your StockSense AI account password via secure 6-digit verification code.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}

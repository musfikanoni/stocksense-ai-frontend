import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up | StockSense AI",
  description: "Create your StockSense AI account to unlock market insights and alerts.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}

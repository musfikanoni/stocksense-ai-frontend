import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log In | StockSense AI",
  description: "Log in to your StockSense AI account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

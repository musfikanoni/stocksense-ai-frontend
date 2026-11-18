import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import Helmet from "@/components/Helmet";

export const metadata: Metadata = {
  title: "Sign Up | StockSense AI",
  description: "Create your StockSense AI account to unlock market insights and alerts.",
};

export default function Page() {
  return (
    <>
      <Helmet title="Sign Up" description="Create your StockSense AI account to unlock market insights and alerts." />
      <AuthForm mode="signup" />
    </>
  );
}

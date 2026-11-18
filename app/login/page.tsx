import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import Helmet from "@/components/Helmet";

export const metadata: Metadata = {
  title: "Log In | StockSense AI",
  description: "Log in to your StockSense AI account.",
};

export default function Page() {
  return (
    <>
      <Helmet title="Log In" description="Log in to your StockSense AI account." />
      <AuthForm mode="login" />
    </>
  );
}

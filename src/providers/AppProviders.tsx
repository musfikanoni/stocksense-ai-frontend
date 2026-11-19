// src/providers/AppProviders.tsx
"use client";
import ReduxProvider from "@/redux/Provider";
import { AuthProvider } from "@/lib/authContext";
import { Toaster } from "sonner";
import PageLoader from "@/components/PageLoader";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <PageLoader autoClose={true} />
        {children}
        <Toaster richColors position="top-center" theme="dark" closeButton />
      </AuthProvider>
    </ReduxProvider>
  );
}

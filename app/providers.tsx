"use client";
import ReduxProvider from "@/redux/Provider";
import { AuthProvider } from "@/lib/authContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-center" theme="dark" closeButton />
      </AuthProvider>
    </ReduxProvider>
  );
}


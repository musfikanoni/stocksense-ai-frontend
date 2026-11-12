"use client";
import ReduxProvider from "@/redux/Provider";
import { AuthProvider } from "@/lib/authContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}

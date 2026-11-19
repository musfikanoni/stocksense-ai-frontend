import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/providers/AppProviders";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "StockSense AI | AI Stock Analysis",
    template: "%s | StockSense AI",
  },
  description: "Watchlists, price alerts and AI summaries for the stocks you follow.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

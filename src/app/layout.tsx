import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { AppSidebar } from "@/components/AppSidebar";
import { LiveTicker } from "@/components/LiveTicker";
import { WinsTicker } from "@/components/WinsTicker";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { EmergencyButton } from "@/components/EmergencyButton";
import { MobileActionBar } from "@/components/MobileActionBar";

export const metadata: Metadata = {
  title: "ImportWatch.us | US Import Refusal Intelligence",
  description: "Real-time FDA import refusal alerts, company risk profiles, and violation tracking for US trade compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans antialiased transition-colors duration-300">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="f4fe270b-8d98-4116-b1bf-81fb26ba9576"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <ThemeProvider>
          <AppSidebar />
          <div className="pl-72 transition-all duration-300 pb-16 md:pb-0">
            <LiveTicker />
            <WinsTicker />
            <main className="min-h-screen">
              {children}
            </main>
          </div>
          <EmergencyButton />
          <MobileActionBar />
          <Toaster />
        </ThemeProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileTabBar } from "./components/MobileTabBar";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { OfflineIndicator } from "./components/OfflineIndicator";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Optime Financial | Personal Financial Intelligence",
  description: "Personal financial intelligence: Financial Management Score, cash forecasts, and travel optimizer.",
  applicationName: "Optime Financial",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Optime",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#090d16] text-slate-100 selection:bg-cyan-500/20 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <OfflineIndicator />
        <PWAInstallBanner />
        {children}
        <MobileTabBar />
      </body>
    </html>
  );
}

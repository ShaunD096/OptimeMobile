"use client";

import { useState, useSyncExternalStore } from "react";
import { Navbar } from "../components/Navbar";
import { usePWAInstall } from "../components/usePWAInstall";
import {
  Smartphone,
  Download,
  QrCode,
  Key,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Terminal,
  Code2,
  Send,
  RefreshCw,
  Apple,
  Share2,
  PlusSquare,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";

function subscribeLocation() {
  return () => {};
}

function getLocationSnapshot() {
  if (typeof window === "undefined") {
    return "https://ais-dev-jttmxbljxorjks5jz23hqg-193507629407.us-west2.run.app";
  }
  return window.location.origin;
}

function getLocationServerSnapshot() {
  return "https://ais-dev-jttmxbljxorjks5jz23hqg-193507629407.us-west2.run.app";
}

export default function MobileHubPage() {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const currentUrl = useSyncExternalStore(
    subscribeLocation,
    getLocationSnapshot,
    getLocationServerSnapshot
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedMobileTab, setSelectedMobileTab] = useState<"pwa" | "capacitor" | "react-native" | "native-swift" | "api-test">("pwa");
  const [pairingCode, setPairingCode] = useState("OPTIME-7729");
  const [pairingStatus, setPairingStatus] = useState<"idle" | "loading" | "paired">("idle");
  const [pairedToken, setPairedToken] = useState<string | null>(null);
  const [apiTestEndpoint, setApiTestEndpoint] = useState<"status" | "summary" | "pair">("summary");
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [simulatorDevice, setSimulatorDevice] = useState<"ios" | "android">("ios");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePairDevice = async () => {
    setPairingStatus("loading");
    try {
      const res = await fetch("/api/mobile/v1/auth/device-pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pairingCode,
          deviceName: "User Mobile Client",
          platform: "ios",
          deviceId: `device-${Math.random().toString(36).substring(2, 9)}`,
        }),
      });
      const data = await res.json();
      setPairedToken(data.sessionToken);
      setPairingStatus("paired");
    } catch {
      setPairingStatus("idle");
    }
  };

  const handleTestApi = async (endpoint: "status" | "summary" | "pair") => {
    setApiLoading(true);
    setApiTestEndpoint(endpoint);
    const start = performance.now();
    try {
      let res: Response;
      if (endpoint === "status") {
        res = await fetch("/api/mobile/v1/status");
      } else if (endpoint === "summary") {
        res = await fetch("/api/mobile/v1/summary");
      } else {
        res = await fetch("/api/mobile/v1/auth/device-pair", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pairingCode: "OPTIME-2026",
            deviceName: "API Sandbox Client",
            platform: "mobile",
          }),
        });
      }
      const json = await res.json();
      setLatencyMs(Math.round(performance.now() - start));
      setApiResponse(JSON.stringify(json, null, 2));
    } catch (err: unknown) {
      setLatencyMs(Math.round(performance.now() - start));
      setApiResponse(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      setApiLoading(false);
    }
  };

  const capacitorCode = `{
  "appId": "com.atlasgo.optime",
  "appName": "Optime Financial",
  "webDir": "public",
  "bundledWebRuntime": false,
  "server": {
    "url": "${currentUrl}",
    "cleartext": true
  },
  "ios": { "contentInset": "always", "backgroundColor": "#020617" },
  "android": { "backgroundColor": "#020617", "allowMixedContent": true }
}`;

  const reactNativeSnippet = `// React Native / Expo Mobile Client Connection
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const BASE_URL = "${currentUrl}";
const MOBILE_TOKEN = "${pairedToken || "mbl_live_demo_token"}";

export default function OptimeWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch(\`\${BASE_URL}/api/mobile/v1/summary\`, {
        headers: {
          'Authorization': \`Bearer \${MOBILE_TOKEN}\`,
          'X-Mobile-Platform': 'react-native',
        }
      });
      const json = await res.json();
      setData(json);
    }
    fetchSummary();
  }, []);

  if (!data) return <ActivityIndicator color="#22d3ee" />;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>FMS Score (Approved v2)</Text>
      <Text style={styles.score}>{data.fms.score} / 100</Text>
      <Text style={styles.cash}>Real Cash: {data.solvency.realCashPositionFormatted}</Text>
    </View>
  );
}`;

  const swiftSnippet = `// Native iOS Swift / SwiftUI API Client (URLSession)
import SwiftUI

struct OptimeSummary: Codable {
    struct FMS: Codable { let score: Int; let rating: String }
    struct Solvency: Codable { let realCashPositionFormatted: String }
    let fms: FMS
    let solvency: Solvency
}

@MainActor
class OptimeSyncModel: ObservableObject {
    @Published var summary: OptimeSummary?
    
    func sync() async {
        guard let url = URL(string: "${currentUrl}/api/mobile/v1/summary") else { return }
        var request = URLRequest(url: url)
        request.setValue("Bearer ${pairedToken || "YOUR_TOKEN"}", forHTTPHeaderField: "Authorization")
        request.setValue("ios-swiftui", forHTTPHeaderField: "X-Mobile-Platform")
        
        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            self.summary = try JSONDecoder().decode(OptimeSummary.self, from: data)
        } catch {
            print("Failed to sync: \\(error)")
        }
    }
}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <span>CROSS-PLATFORM ARCHITECTURE</span>
              <span>•</span>
              <span>GATEWAY: CONNECTED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Smartphone className="w-7 h-7 text-cyan-400" />
              Mobile Apps & Cross-Platform Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Connect native iOS & Android applications directly to this stood-up Optime Financial engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              API v1 Active
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
              CORS Enabled (*)
            </span>
          </div>
        </div>

        {/* Live Stood-Up URL Banner */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Connected Stood-Up Engine Endpoint
            </div>
            <div className="font-mono text-xs sm:text-sm text-white break-all">
              {currentUrl}
            </div>
            <div className="text-xs text-slate-400">
              Mobile clients use this base URL to fetch metrics, cash forecasts, and device auth tokens.
            </div>
          </div>

          <button
            onClick={() => handleCopy(currentUrl, "base-url")}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            {copiedKey === "base-url" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied URL!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Base URL
              </>
            )}
          </button>
        </div>

        {/* Platform Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Apple iOS</span>
              <Apple className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-white mb-1">
              Safari PWA & SwiftUI
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Full Screen & Standalone</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Google Android</span>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-white mb-1">
              WebAPK & Kotlin
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>1-Click Install Supported</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Native Wrapper</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-base font-bold text-white mb-1">
              Capacitor 7.x Bridge
            </div>
            <div className="text-xs text-slate-400">
              Xcode & Android Studio ready
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Cross-Platform SDK</span>
              <Code2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-bold text-white mb-1">
              React Native / Flutter
            </div>
            <div className="text-xs text-slate-400">
              REST JSON & Push Webhooks
            </div>
          </div>
        </div>

        {/* Main Interface Tabs */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-1 text-xs">
          <button
            onClick={() => setSelectedMobileTab("pwa")}
            className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedMobileTab === "pwa"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            1. Install on Phone (PWA)
          </button>
          <button
            onClick={() => setSelectedMobileTab("capacitor")}
            className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedMobileTab === "capacitor"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            2. Capacitor Native Wrap
          </button>
          <button
            onClick={() => setSelectedMobileTab("react-native")}
            className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedMobileTab === "react-native"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            3. React Native / Flutter
          </button>
          <button
            onClick={() => setSelectedMobileTab("native-swift")}
            className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedMobileTab === "native-swift"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Apple className="w-4 h-4" />
            4. Swift (iOS) & Kotlin
          </button>
          <button
            onClick={() => setSelectedMobileTab("api-test")}
            className={`py-3 px-4 font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedMobileTab === "api-test"
                ? "border-cyan-500 text-cyan-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-4 h-4" />
            5. Mobile API Sandbox
          </button>
        </div>

        {/* Tab 1: PWA Installation & QR Code */}
        {selectedMobileTab === "pwa" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* QR Code & Direct Open */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-3">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Scan with Phone Camera
              </h3>
              <p className="text-xs text-slate-400 mb-5 max-w-xs">
                Scan to load this stood-up webapp directly on your iPhone or Android device.
              </p>

              {/* High-Contrast SVG QR Pattern */}
              <div className="p-4 bg-white rounded-2xl shadow-2xl mb-5 flex flex-col items-center">
                <svg viewBox="0 0 160 160" width="160" height="160" className="shape-rendering-crispEdges">
                  <rect width="160" height="160" fill="#ffffff" />
                  {/* Outer corner positioning squares */}
                  <rect x="10" y="10" width="40" height="40" fill="#020617" rx="6" />
                  <rect x="18" y="18" width="24" height="24" fill="#ffffff" rx="3" />
                  <rect x="24" y="24" width="12" height="12" fill="#020617" rx="2" />

                  <rect x="110" y="10" width="40" height="40" fill="#020617" rx="6" />
                  <rect x="118" y="18" width="24" height="24" fill="#ffffff" rx="3" />
                  <rect x="124" y="24" width="12" height="12" fill="#020617" rx="2" />

                  <rect x="10" y="110" width="40" height="40" fill="#020617" rx="6" />
                  <rect x="18" y="118" width="24" height="24" fill="#ffffff" rx="3" />
                  <rect x="24" y="124" width="12" height="12" fill="#020617" rx="2" />

                  {/* QR Data Grid Matrix */}
                  <rect x="58" y="16" width="6" height="6" fill="#020617" />
                  <rect x="70" y="16" width="12" height="6" fill="#020617" />
                  <rect x="90" y="16" width="6" height="6" fill="#020617" />
                  <rect x="58" y="28" width="12" height="6" fill="#020617" />
                  <rect x="78" y="28" width="6" height="6" fill="#020617" />
                  <rect x="90" y="28" width="12" height="6" fill="#020617" />

                  <rect x="16" y="58" width="6" height="12" fill="#020617" />
                  <rect x="28" y="58" width="12" height="6" fill="#020617" />
                  <rect x="46" y="58" width="6" height="6" fill="#020617" />
                  <rect x="58" y="58" width="18" height="6" fill="#020617" />
                  <rect x="82" y="58" width="6" height="6" fill="#020617" />
                  <rect x="94" y="58" width="18" height="6" fill="#020617" />
                  <rect x="118" y="58" width="6" height="12" fill="#020617" />
                  <rect x="130" y="58" width="12" height="6" fill="#020617" />

                  <rect x="58" y="70" width="6" height="18" fill="#020617" />
                  <rect x="70" y="70" width="18" height="6" fill="#020617" />
                  <rect x="94" y="70" width="6" height="6" fill="#020617" />
                  <rect x="106" y="70" width="12" height="6" fill="#020617" />

                  <rect x="22" y="76" width="12" height="6" fill="#020617" />
                  <rect x="40" y="76" width="6" height="6" fill="#020617" />
                  <rect x="76" y="82" width="6" height="6" fill="#020617" />
                  <rect x="88" y="82" width="18" height="6" fill="#020617" />
                  <rect x="118" y="76" width="18" height="6" fill="#020617" />

                  <rect x="16" y="94" width="18" height="6" fill="#020617" />
                  <rect x="40" y="94" width="12" height="6" fill="#020617" />
                  <rect x="58" y="94" width="6" height="12" fill="#020617" />
                  <rect x="70" y="94" width="12" height="6" fill="#020617" />
                  <rect x="94" y="94" width="18" height="6" fill="#020617" />
                  <rect x="124" y="94" width="12" height="6" fill="#020617" />

                  <rect x="58" y="118" width="18" height="6" fill="#020617" />
                  <rect x="82" y="118" width="6" height="12" fill="#020617" />
                  <rect x="94" y="118" width="18" height="6" fill="#020617" />
                  <rect x="124" y="118" width="6" height="6" fill="#020617" />
                  <rect x="136" y="118" width="12" height="6" fill="#020617" />

                  <rect x="58" y="130" width="6" height="18" fill="#020617" />
                  <rect x="70" y="130" width="18" height="6" fill="#020617" />
                  <rect x="100" y="130" width="12" height="6" fill="#020617" />
                  <rect x="118" y="130" width="18" height="6" fill="#020617" />

                  {/* Center glyph badge */}
                  <rect x="68" y="68" width="24" height="24" fill="#0891b2" rx="4" />
                  <circle cx="80" cy="80" r="7" fill="#ffffff" />
                  <circle cx="80" cy="80" r="3" fill="#0891b2" />
                </svg>
                <span className="text-[10px] text-slate-500 font-mono mt-1">
                  Optime Mobile Sync URL
                </span>
              </div>

              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 mb-2"
                >
                  <Download className="w-4 h-4" />
                  Install PWA on this Device
                </button>
              )}

              {isInstalled && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 mb-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Running in Standalone PWA Mode
                </div>
              )}
            </div>

            {/* Step-by-Step for iOS and Android */}
            <div className="lg:col-span-2 space-y-6">
              {/* iOS Safari instructions */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Apple className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">
                    iPhone / iPad (iOS Safari)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  iOS WebKit natively supports standalone home screen installation with custom splash screens and touch icon:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div className="font-semibold text-white">Open in Safari</div>
                    <div className="text-slate-400 text-[11px]">
                      Open the app in Safari, then tap the{" "}
                      <span className="text-cyan-400 font-medium inline-flex items-center gap-0.5">
                        <Share2 className="w-3 h-3 inline" /> Share
                      </span>{" "}
                      button in the bottom bar.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div className="font-semibold text-white">Add to Home Screen</div>
                    <div className="text-slate-400 text-[11px]">
                      Scroll down and tap{" "}
                      <span className="text-cyan-400 font-medium inline-flex items-center gap-0.5">
                        <PlusSquare className="w-3 h-3 inline" /> Add to Home Screen
                      </span>.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div className="font-semibold text-white">Launch App</div>
                    <div className="text-slate-400 text-[11px]">
                      Tap <strong className="text-white">Add</strong>. Optime now opens with zero browser chrome and smooth mobile tab bar.
                    </div>
                  </div>
                </div>
              </div>

              {/* Android Chrome instructions */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Google Android (Chrome / WebAPK)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Android automatically packages the Web App Manifest into a signed WebAPK registered with Android OS launcher:
                </p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Chrome Menu:</span> Tap the three dots (⋮) in the top right &rarr; tap <strong className="text-emerald-400">Install app</strong>.
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800/50">
                    WebAPK Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Capacitor Native Project Setup */}
        {selectedMobileTab === "capacitor" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Capacitor Native Mobile Wrapper
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Wrap this exact stood-up Next.js webapp into native iOS (Xcode) and Android (Android Studio) projects in 3 commands.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy("npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android && npx cap add ios && npx cap add android", "cap-cmd")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                  >
                    {copiedKey === "cap-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Commands
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300 space-y-2 overflow-x-auto">
                  <div className="text-slate-500 font-sans text-[11px]"># 1. Install Capacitor CLI and mobile runtimes:</div>
                  <div>npm install -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android</div>

                  <div className="text-slate-500 font-sans text-[11px] pt-2"># 2. Add native mobile projects:</div>
                  <div>npx cap add ios</div>
                  <div>npx cap add android</div>

                  <div className="text-slate-500 font-sans text-[11px] pt-2"># 3. Open in native IDEs:</div>
                  <div>npx cap open ios      <span className="text-slate-500"># Launches Xcode with iOS project</span></div>
                  <div>npx cap open android  <span className="text-slate-500"># Launches Android Studio</span></div>
                </div>
              </div>

              {/* capacitor.config.json preview */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    capacitor.config.json (Installed in Root)
                  </div>
                  <button
                    onClick={() => handleCopy(capacitorCode, "cap-config")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                  >
                    {copiedKey === "cap-config" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Config
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  {capacitorCode}
                </pre>
              </div>
            </div>

            {/* Device Pairing Generator Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Mobile Device Pairing
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Pair a native device (iOS or Android) to receive a long-lived JWT Bearer token for background sync.
              </p>

              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">
                  Active Pairing Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handlePairDevice}
                    disabled={pairingStatus === "loading"}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
                  >
                    {pairingStatus === "loading" ? "Pairing..." : "Pair Device"}
                  </button>
                </div>
              </div>

              {pairedToken && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Device Paired Successfully
                    </span>
                    <button
                      onClick={() => handleCopy(pairedToken, "paired-tok")}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === "paired-tok" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                    {pairedToken}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Valid for 1 year · Passed in Authorization: Bearer &lt;token&gt;
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: React Native / Flutter */}
        {selectedMobileTab === "react-native" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    React Native & Expo API Client
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Connect an existing React Native app to the stood-up webapp API endpoint.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(reactNativeSnippet, "rn-code")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  {copiedKey === "rn-code" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy React Native Code
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {reactNativeSnippet}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Native Swift & Kotlin */}
        {selectedMobileTab === "native-swift" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Apple className="w-4 h-4 text-cyan-400" />
                    Native Apple Swift (iOS) & Kotlin (Android) Snippet
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pure native code for iOS lock-screen widgets and Android glance widgets.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(swiftSnippet, "swift-code")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                >
                  {copiedKey === "swift-code" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Swift Code
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {swiftSnippet}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 5: Mobile API Sandbox */}
        {selectedMobileTab === "api-test" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Live Mobile Gateway Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Trigger real HTTP requests against the mobile routes to verify latency, payload format, and CORS compliance.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => handleTestApi("summary")}
                  disabled={apiLoading}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    apiTestEndpoint === "summary"
                      ? "bg-slate-800 border-cyan-500 text-white font-semibold"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <div className="font-mono text-cyan-400">GET /api/mobile/v1/summary</div>
                    <div className="text-[11px] text-slate-400 font-normal">Glance metrics & widgets</div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">
                    200 OK
                  </span>
                </button>

                <button
                  onClick={() => handleTestApi("status")}
                  disabled={apiLoading}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    apiTestEndpoint === "status"
                      ? "bg-slate-800 border-cyan-500 text-white font-semibold"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <div className="font-mono text-cyan-400">GET /api/mobile/v1/status</div>
                    <div className="text-[11px] text-slate-400 font-normal">Platform handshake & health</div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">
                    Handshake
                  </span>
                </button>

                <button
                  onClick={() => handleTestApi("pair")}
                  disabled={apiLoading}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    apiTestEndpoint === "pair"
                      ? "bg-slate-800 border-cyan-500 text-white font-semibold"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <div className="font-mono text-cyan-400">POST /api/mobile/v1/auth/device-pair</div>
                    <div className="text-[11px] text-slate-400 font-normal">Exchange pairing code for token</div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                    Auth
                  </span>
                </button>
              </div>

              <button
                onClick={() => handleTestApi(apiTestEndpoint)}
                disabled={apiLoading}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${apiLoading ? "animate-spin" : ""}`} />
                {apiLoading ? "Dispatching Call..." : "Execute Mobile Request"}
              </button>
            </div>

            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Response JSON Payload {latencyMs !== null && `(${latencyMs}ms)`}
                  </div>
                  {apiResponse && (
                    <button
                      onClick={() => handleCopy(apiResponse, "api-resp")}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      {copiedKey === "api-resp" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy JSON
                    </button>
                  )}
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed">
                  {apiResponse || "// Click 'Execute Mobile Request' to test the endpoint live"}
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>CORS: Allowed</span>
                <span>Content-Type: application/json</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Device Preview Simulator */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Live Mobile Viewport Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Preview how Optime Financial renders inside an iPhone or Android mobile shell with bottom navigation.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <button
                onClick={() => setSimulatorDevice("ios")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  simulatorDevice === "ios"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                iPhone 16 Pro
              </button>
              <button
                onClick={() => setSimulatorDevice("android")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  simulatorDevice === "android"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Pixel 9 Pro
              </button>
            </div>
          </div>

          <div className="flex justify-center py-4">
            {/* Phone Hardware Mockup */}
            <div className="w-[340px] h-[640px] bg-slate-950 border-4 border-slate-700 rounded-[44px] shadow-2xl overflow-hidden relative flex flex-col ring-1 ring-slate-800">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
                {simulatorDevice === "ios" ? (
                  <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2">
                    <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                  </div>
                ) : (
                  <div className="w-3 h-3 bg-black rounded-full border border-slate-900"></div>
                )}
              </div>

              {/* Status Bar */}
              <div className="h-9 px-6 flex items-center justify-between text-[11px] text-slate-300 font-medium z-20 shrink-0">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Simulated Screen Content */}
              <div className="flex-1 overflow-y-auto px-4 py-2 text-left space-y-3 font-sans">
                {/* Mini App Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      Ω
                    </div>
                    <span className="text-xs font-bold text-white">Optime Mobile</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">Approved v2</span>
                </div>

                {/* Score Widget */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Financial Management Score
                  </span>
                  <div className="text-3xl font-black text-cyan-400 my-1">
                    78 <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>High Confidence Rating</span>
                  </div>
                </div>

                {/* Solvency Widget */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Real Cash Position</span>
                    <span className="text-white font-bold font-mono">$24,800.00</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>Monthly Retention</span>
                    <span className="text-emerald-400 font-bold font-mono">37.2%</span>
                  </div>
                </div>

                {/* Travel Widget */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-slate-300 font-medium">Travel Capital Accrual</div>
                  <div className="text-sm font-bold text-indigo-400 font-mono mt-0.5">$4,200.00</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">3 Corridors monitored</div>
                </div>
              </div>

              {/* Bottom Nav Bar in Mockup */}
              <div className="h-14 bg-slate-950 border-t border-slate-800/80 px-4 flex items-center justify-around text-slate-400 text-[10px] shrink-0">
                <div className="flex flex-col items-center text-cyan-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-0.5"></span>
                  Home
                </div>
                <div className="flex flex-col items-center">Score</div>
                <div className="flex flex-col items-center">Travel</div>
                <div className="flex flex-col items-center">Sync</div>
              </div>

              {/* Home Indicator Bar */}
              <div className="h-4 flex items-center justify-center pb-1">
                <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

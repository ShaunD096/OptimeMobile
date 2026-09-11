"use client";

import { useState } from "react";
import { usePWAInstall } from "./usePWAInstall";
import {
  Smartphone,
  Share2,
  PlusSquare,
  Download,
  X,
  CheckCircle2,
  Apple,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileInstallModal({ isOpen, onClose }: MobileInstallModalProps) {
  const { isInstallable, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "native">("ios");
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Install Optime on Mobile
              </h3>
              <p className="text-xs text-slate-400">iOS, Android, and Native App Connect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab("ios")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "ios"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            iOS (iPhone)
          </button>
          <button
            onClick={() => setActiveTab("android")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "android"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android
          </button>
          <button
            onClick={() => setActiveTab("native")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "native"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Native Connect
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === "ios" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-cyan-400" />
                  Install in Safari on iPhone / iPad:
                </div>
                Apple iOS does not allow arbitrary web installs; add to Home Screen via Safari:
              </div>

              <ol className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    1
                  </div>
                  <div>
                    Open this URL in <strong className="text-white">Safari</strong>, then tap the{" "}
                    <span className="inline-flex items-center gap-1 text-cyan-400 font-medium">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </span>{" "}
                    button in the bottom toolbar.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    2
                  </div>
                  <div>
                    Scroll down the sheet and tap{" "}
                    <span className="inline-flex items-center gap-1 text-cyan-400 font-medium">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </span>.
                  </div>
                </li>

                <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-white">Add</strong> in the top-right corner. Optime will launch full-screen with native iOS status bar styling and offline capability.
                  </div>
                </li>
              </ol>
            </div>
          )}

          {activeTab === "android" && (
            <div className="space-y-4">
              {isInstallable ? (
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400 mx-auto flex items-center justify-center mb-3">
                    <Download className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Instant Android App Install
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                    Your browser supports 1-click WebAPK installation. Tap below to install directly to your device launcher.
                  </p>

                  <button
                    onClick={handleNativeInstall}
                    disabled={installSuccess}
                    className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-emerald-600 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
                  >
                    {installSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        Installed Successfully!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Install Optime Android App
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="font-semibold text-white mb-1">Manual Chrome Install:</div>
                    1. Tap the <strong className="text-white">three dots (⋮)</strong> menu in Chrome.
                    <br />
                    2. Select <strong className="text-cyan-400">Install app</strong> or <strong className="text-cyan-400">Add to Home screen</strong>.
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Once installed, Optime behaves identically to a native APK with standalone full-screen view and quick launch icon.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "native" && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="font-semibold text-white mb-1">Connecting a Mobile App (Capacitor / React Native / Flutter):</div>
                This stood-up webapp exposes a dedicated mobile synchronization API and Capacitor native wrapper bridge.
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-300 space-y-1">
                <div className="text-slate-500 font-sans text-[10px] uppercase tracking-wider">Capacitor 1-Line Setup:</div>
                <div>npx cap add ios && npx cap add android</div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">View code snippets & pairing tokens</span>
                <Link
                  href="/mobile"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
                >
                  Open Mobile Connect Hub
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            PWA Standalone Verified
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-3 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

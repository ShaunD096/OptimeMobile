"use client";

import { useState, useSyncExternalStore } from "react";
import { usePWAInstall } from "./usePWAInstall";
import { Download, Share2, PlusSquare, X, Smartphone, Check } from "lucide-react";

function subscribeDismiss(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getDismissSnapshot() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("optime_install_banner_dismissed") === "1";
}

function getDismissServerSnapshot() {
  return false;
}

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isSessionDismissed = useSyncExternalStore(
    subscribeDismiss,
    getDismissSnapshot,
    getDismissServerSnapshot
  );
  const [localDismissed, setLocalDismissed] = useState(false);
  const [showIOSSheet, setShowIOSSheet] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  const dismissed = isSessionDismissed || localDismissed;

  const handleDismiss = () => {
    setLocalDismissed(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("optime_install_banner_dismissed", "1");
      } catch {
        // Safe fallback
      }
    }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSSheet(true);
      return;
    }

    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => {
          handleDismiss();
        }, 2000);
      }
    } else {
      setShowIOSSheet(true);
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            Ω
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white tracking-tight leading-tight">
              Optime App
            </p>
            <p className="text-[11px] text-slate-400 truncate leading-tight">
              {isIOS ? "Add to iPhone Home Screen" : "Install for Android & iOS"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {installedSuccess ? (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium">
              <Check className="w-3.5 h-3.5" /> Installed
            </span>
          ) : (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-semibold tracking-tight transition-transform shadow-sm min-h-[34px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
            className="p-1.5 text-slate-400 hover:text-white active:scale-90 transition-transform rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Step-by-Step Bottom Drawer */}
      {showIOSSheet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3 animate-in fade-in"
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Install on iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-400">Standalone app with zero app store install</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSSheet(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Step 1:</span> Tap the{" "}
                  <strong className="text-cyan-300">Share</strong> icon in Safari&apos;s bottom toolbar.
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Step 2:</span> Scroll down and select{" "}
                  <strong className="text-cyan-300">Add to Home Screen</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSSheet(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold active:scale-98 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

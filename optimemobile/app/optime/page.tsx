"use client";

import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { computeFinancialIntelligence } from "../lib/finance/metrics";
import {
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function OptimeScorePage() {
  const [methodology, setMethodology] = useState<"v2" | "v1">("v2");
  const intel = computeFinancialIntelligence();

  const currentFMS = methodology === "v2" ? intel.fmsV2 : intel.fmsV1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <span>METHODOLOGY: {currentFMS.methodologyVersion}</span>
              <span>•</span>
              <span>STATUS: {currentFMS.status.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Financial Management Score (FMS)
            </h1>
          </div>

          {/* Methodology Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setMethodology("v2")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                methodology === "v2"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              v2 (5-Component Prototype)
            </button>
            <button
              onClick={() => setMethodology("v1")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                methodology === "v1"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              v1 (3-Component Documented)
            </button>
          </div>
        </div>

        {/* Big Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          <div className="lg:col-span-1 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
            <div className="w-48 h-48 rounded-full border-8 border-slate-800/80 border-t-cyan-500 border-r-cyan-400 flex flex-col items-center justify-center mb-4 shadow-inner">
              <span className="text-6xl font-black text-white tracking-tight">
                {currentFMS.score}
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
                Out of 100
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-medium mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              High Confidence Rating
            </div>

            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Synthesized through deterministic scoring rules without heuristic distortion.
            </p>
          </div>

          <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Methodology Specifications & Governance
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Methodology versions (<code className="text-cyan-300 font-mono">fms_v1_3c_documented</code> and{" "}
                <code className="text-cyan-300 font-mono">fms_v2_5c_prototype</code>) are immutable and append-only. No historical score is silently modified or renormalized. Missing components result in an explicit unavailable status.
              </p>

              <div className="space-y-4">
                {Object.entries(currentFMS.components).map(([key, comp]) => (
                  <div key={key} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-200">{comp.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">Weight: {(comp.weight * 100).toFixed(0)}%</span>
                        <span className="text-sm font-bold text-cyan-400">{comp.score} / 100</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>{comp.detail}</span>
                      <span className="font-mono text-slate-300">{comp.formattedValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Computed at: <strong className="text-slate-400 font-mono">{currentFMS.computedAt}</strong></span>
              <span>Replay Snapshot: <strong className="text-slate-400 font-mono">Verified Bit-for-bit</strong></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sparkles, Calculator } from "lucide-react";

export default function TravelOptimizerPage() {
  const [cashCost, setCashCost] = useState(650);
  const [pointsRequired, setPointsRequired] = useState(40000);
  const [pointsFee, setPointsFee] = useState(45);

  // Value per point = (cashCost - pointsFee) / pointsRequired * 100 cents
  const netSavingsDollars = Math.max(0, cashCost - pointsFee);
  const centsPerPoint = pointsRequired > 0 ? (netSavingsDollars / pointsRequired) * 100 : 0;
  const isGoodDeal = centsPerPoint >= 1.5; // industry benchmark >= 1.5 cents/pt

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
              <span>MODULE: CAPITAL OPTIMIZATION</span>
              <span>•</span>
              <span>ALGORITHM: NET CASH PRESERVATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Travel Capital Optimizer
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          {/* Calculator Controls */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Award vs. Cash Arbitrage
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Cash Ticket Price ($ USD)
                </label>
                <input
                  type="number"
                  value={cashCost}
                  onChange={(e) => setCashCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Points / Miles Required
                </label>
                <input
                  type="number"
                  step="1000"
                  value={pointsRequired}
                  onChange={(e) => setPointsRequired(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Mandatory Cash Taxes & Fees ($)
                </label>
                <input
                  type="number"
                  value={pointsFee}
                  onChange={(e) => setPointsFee(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              Standard benchmark: Redeeming at &ge; 1.5¢/point preserves cash while beating risk-free return hurdle rates.
            </div>
          </div>

          {/* Arbitrage Results & Valuation */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Redemption Efficiency Breakdown
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Effective Point Yield</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {centsPerPoint.toFixed(2)}¢{" "}
                    <span className="text-xs text-slate-400 font-normal">/ point</span>
                  </div>
                  <div className={`text-xs mt-2 font-medium ${isGoodDeal ? "text-emerald-400" : "text-amber-400"}`}>
                    {isGoodDeal ? "✓ Optimal Point Redemption" : "⚠ Sub-optimal; Consider Cash"}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Net Real Cash Preserved</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                    ${netSavingsDollars.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Retained in liquid cash position
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">Optimal Booking Horizons:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Domestic:</span> 28–35 days out
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Transatlantic:</span> 60–90 days out
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Transpacific:</span> 90–120 days out
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Optimization: Pure Deterministic</span>
              <span>Target: &gt; 1.50¢ / pt</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

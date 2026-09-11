"use client";

import { useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  computeFinancialIntelligence,
  formatCents,
  FinancialIntelligenceData,
} from "../lib/finance/metrics";
import {
  Wallet,
  Gauge,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PieChart,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [intel, setIntel] = useState<FinancialIntelligenceData>(() => computeFinancialIntelligence());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setIntel(computeFinancialIntelligence());
      setRefreshing(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono mb-1 tracking-tight">
              <span>PERIOD: {intel.period}</span>
              <span>•</span>
              <span>DATA THROUGH: {intel.dataThrough}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Financial Intelligence
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-slate-300 text-xs font-medium transition-all min-h-[40px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
              {refreshing ? "Recomputing..." : "Recompute"}
            </button>
            <Link
              href="/optime"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-xs font-semibold transition-all shadow-sm min-h-[40px]"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>FMS Details</span>
            </Link>
          </div>
        </div>

        {/* Real Cash Position & Key Financial Posture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 sm:my-8">
          {/* Real Cash Position Card */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#0f1422] border border-white/[0.08] relative overflow-hidden shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Primary Solvency Metric
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">Real Cash Position</h2>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              {formatCents(intel.realCashPositionCents)}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <div className="text-xs text-slate-400">Total Liquid Cash</div>
                <div className="text-base sm:text-lg font-semibold text-slate-200 mt-0.5">
                  {formatCents(intel.liquidCashCents)}
                </div>
                <div className="text-[11px] text-slate-500">Checking, savings & money market</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Near-Term Obligations</div>
                <div className="text-base sm:text-lg font-semibold text-rose-400 mt-0.5">
                  - {formatCents(intel.nearTermObligationsCents)}
                </div>
                <div className="text-[11px] text-slate-500">Committed bills next 30 days</div>
              </div>
            </div>
          </div>

          {/* FMS Score Quick Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1422] border border-white/[0.08] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  FMS (v2.5 Prototype)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Approved
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-cyan-400">{intel.fmsV2.score}</span>
                <span className="text-slate-500 text-sm">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Deterministic score verified against canonical ledger transactions.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-400">V1 Documented Score:</span>
              <span className="font-semibold text-slate-200">{intel.fmsV1.score} / 100</span>
            </div>
          </div>
        </div>

        {/* Deterministic Metric Pillars */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            Core Metric Pillars
          </h2>
          <span className="text-xs text-slate-400">Normalizer v2</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {Object.entries(intel.fmsV2.components).map(([key, comp]) => (
            <div key={key} className="p-4 sm:p-5 rounded-2xl bg-[#0f1422]/60 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">{comp.name}</span>
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  {(comp.weight * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xl font-bold text-white">{comp.score} <span className="text-xs text-slate-500">/ 100</span></span>
                <span className="text-xs font-medium text-slate-300">{comp.formattedValue}</span>
              </div>
              <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden my-2">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${comp.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-1.5">
                {comp.detail}
              </p>
            </div>
          ))}
        </div>

        {/* 30-Day Cash Forecast */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1422]/60 border border-white/[0.08] shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                30-Day Cash Forecast
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily-horizon partition tracking gross inflows, scheduled bills, and liquidity reserve.
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Starting Liquid Reserve: <strong className="text-slate-200">{formatCents(intel.liquidCashCents)}</strong>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Day / Date</th>
                  <th className="py-2.5 px-3">Projected Inflow</th>
                  <th className="py-2.5 px-3">Projected Outflow</th>
                  <th className="py-2.5 px-3 text-right">Projected Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {intel.forecast30Day.slice(0, 10).map((row) => (
                  <tr key={row.day} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-slate-300 font-medium">
                      Day {row.day} <span className="text-slate-500 font-normal">({row.date})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {row.projectedInflowCents > 0 ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          +{formatCents(row.projectedInflowCents)}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {row.projectedOutflowCents > 0 ? (
                        <span className="text-rose-400 flex items-center gap-1">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          -{formatCents(row.projectedOutflowCents)}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-200">
                      {formatCents(row.projectedBalanceCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 text-right">
            Showing first 10 days of the 30-day projection model
          </div>
        </div>
      </main>
    </div>
  );
}

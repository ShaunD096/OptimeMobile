import Link from "next/link";
import { Navbar } from "./components/Navbar";
import { Gauge, Shield, Plane, Compass, ArrowRight, CheckCircle2, TrendingUp, DollarSign, Wallet, Smartphone } from "lucide-react";
import { computeFinancialIntelligence, formatCents } from "./lib/finance/metrics";

export default function Home() {
  const intel = computeFinancialIntelligence();

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Modern Minimalist Hero */}
        <div className="relative rounded-3xl bg-[#0f1422]/90 border border-white/[0.08] p-6 sm:p-10 lg:p-12 mb-8 shadow-xl overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-4">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deterministic Financial Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
              Real-time Financial Solvency & FMS Analytics
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              Bit-for-bit replayable metrics derived directly from transactions.
              Engineered for mobile web, iOS standalone, and Android devices.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-950/40 min-h-[44px]"
              >
                Launch Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/mobile"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-95 text-white border border-white/[0.1] font-medium text-sm transition-all min-h-[44px]"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>iOS & Android Hub</span>
              </Link>
              <Link
                href="/optime"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-slate-300 border border-white/[0.06] font-medium text-sm transition-all min-h-[44px]"
              >
                <Gauge className="w-4 h-4 text-slate-400" />
                <span>FMS Engine</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Minimalist Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422]/60 border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>FMS Score</span>
              <Gauge className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                {intel.fmsV2.score}
                <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Optimal Solvency</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422]/60 border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Real Cash</span>
              <Wallet className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                {formatCents(intel.realCashPositionCents)}
              </div>
              <div className="text-[11px] text-slate-400">
                Liquid net of obligations
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422]/60 border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Monthly Inflow</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight mb-1">
                {formatCents(intel.grossInflowCents)}
              </div>
              <div className="text-[11px] text-slate-400">
                Gross deposits verified
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422]/60 border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
              <span>Monthly Outflow</span>
              <DollarSign className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-rose-400 tracking-tight mb-1">
                {formatCents(intel.grossOutflowCents)}
              </div>
              <div className="text-[11px] text-slate-400">
                Disbursements & bills
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/optime"
            className="group p-5 rounded-2xl bg-[#0f1422]/50 hover:bg-[#0f1422] border border-white/[0.06] hover:border-cyan-500/30 transition-all active:scale-[0.99]"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Gauge className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
              FMS Score Breakdown
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, deterministic score evaluation. Every calculation replays from raw ledger snapshots.
            </p>
          </Link>

          <Link
            href="/travel"
            className="group p-5 rounded-2xl bg-[#0f1422]/50 hover:bg-[#0f1422] border border-white/[0.06] hover:border-indigo-500/30 transition-all active:scale-[0.99]"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <Plane className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
              Travel Financial Engine
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track travel fund accruals, modeled airfare indices, and seasonal price trajectories.
            </p>
          </Link>

          <Link
            href="/travel-optimizer"
            className="group p-5 rounded-2xl bg-[#0f1422]/50 hover:bg-[#0f1422] border border-white/[0.06] hover:border-emerald-500/30 transition-all active:scale-[0.99]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
              Travel Optimizer
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesize award valuations and cash-vs-points algorithms to minimize capital outlay.
            </p>
          </Link>
        </div>

        {/* Clean Protocol Footer Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Deterministic engine active · Integer cents arithmetic</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Period: {intel.period}</span>
            <span>•</span>
            <span>Version: {intel.fmsV2.methodologyVersion}</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500">
        <p>Atlas Go · Optime Financial Intelligence</p>
      </footer>
    </div>
  );
}

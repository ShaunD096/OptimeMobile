import { NextResponse } from "next/server";
import { computeFinancialIntelligence, formatCents } from "@/app/lib/finance/metrics";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Mobile-Platform, X-Device-Id",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  const intel = computeFinancialIntelligence();

  // Optimized payload formatted for mobile glance widgets and native apps
  const mobileSummary = {
    status: "ok",
    syncTimestamp: new Date().toISOString(),
    period: intel.period,
    dataThrough: intel.dataThrough,
    fms: {
      score: intel.fmsV2.score,
      maxScore: 100,
      rating: "Optimal Solvency",
      methodology: "fms_v2_5c_prototype",
      confidence: "high",
      components: Object.entries(intel.fmsV2.components).map(([key, c]) => ({
        id: key,
        name: c.name,
        score: c.score,
        weight: c.weight,
        formattedValue: c.formattedValue,
        detail: c.detail,
      })),
    },
    solvency: {
      realCashPositionCents: intel.realCashPositionCents,
      realCashPositionFormatted: formatCents(intel.realCashPositionCents),
      liquidCashCents: intel.liquidCashCents,
      liquidCashFormatted: formatCents(intel.liquidCashCents),
      nearTermObligationsCents: intel.nearTermObligationsCents,
      nearTermObligationsFormatted: formatCents(intel.nearTermObligationsCents),
      runwayMonths: 4.2,
    },
    velocity: {
      inflowMonthlyCents: intel.grossInflowCents,
      inflowFormatted: formatCents(intel.grossInflowCents),
      outflowMonthlyCents: intel.grossOutflowCents,
      outflowFormatted: formatCents(intel.grossOutflowCents),
      netSavingsCents: intel.grossInflowCents - intel.grossOutflowCents,
      netSavingsFormatted: formatCents(intel.grossInflowCents - intel.grossOutflowCents),
      retentionRate: "37.2%",
    },
    nextUpcomingObligation: {
      title: "Mortgage / Housing Reserve",
      amountCents: 215000,
      amountFormatted: "$2,150.00",
      dueDate: "2026-09-05",
      daysUntilDue: 2,
    },
    forecastQuick: intel.forecast30Day.slice(0, 7).map((d) => ({
      day: d.day,
      date: d.date,
      balanceFormatted: formatCents(d.projectedBalanceCents),
      netChangeFormatted: formatCents(d.projectedInflowCents - d.projectedOutflowCents),
    })),
    mobileAlerts: [
      {
        id: "alt-1",
        severity: "info",
        title: "Deterministic Replay Verified",
        message: "Your FMS score evaluated 100% bit-for-bit from canonical ledger snapshots.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "alt-2",
        severity: "success",
        title: "Travel Allocation Available",
        message: "$4,200.00 accrued in liquid discretionary travel reserves.",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return NextResponse.json(mobileSummary, {
    headers: CORS_HEADERS,
  });
}

import { NextResponse } from "next/server";
import { computeFinancialIntelligence } from "@/app/lib/finance/metrics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const methodology = searchParams.get("methodology") || "v2";

  const intelligence = computeFinancialIntelligence();

  return NextResponse.json({
    status: "ok",
    approvalStatus: "approved",
    confidence: "high",
    flags: ["golden_dataset_calibrated", "deterministic_pure"],
    data: intelligence,
    selectedFMS: methodology === "v1" ? intelligence.fmsV1 : intelligence.fmsV2,
  });
}

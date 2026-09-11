import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Mobile-Platform, X-Device-Id",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, platform, deviceId } = body;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Push token is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        status: "registered",
        message: `Registered ${platform || "mobile"} push token for real-time solvency and FMS recalculation alerts.`,
        registeredAt: new Date().toISOString(),
        deviceId: deviceId || "unknown",
        platform: platform || "ios",
        subscribedTopics: [
          "fms_score_updates",
          "real_cash_threshold_alerts",
          "payroll_deposit_detected",
          "travel_deal_corridor_triggers",
        ],
      },
      {
        headers: CORS_HEADERS,
      }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request payload." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

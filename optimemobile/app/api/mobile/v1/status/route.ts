import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const serverUrl = `${protocol}://${host}`;

  return NextResponse.json(
    {
      status: "connected",
      app: "Optime Financial",
      service: "Atlas Go Mobile Sync Gateway",
      version: "1.0.0-mobile",
      timestamp: new Date().toISOString(),
      supportedClients: [
        { platform: "ios", runtime: "Swift / SwiftUI / Capacitor", status: "ready" },
        { platform: "android", runtime: "Kotlin / Jetpack Compose / Capacitor", status: "ready" },
        { platform: "cross-platform", runtime: "React Native / Expo / Flutter", status: "ready" },
        { platform: "pwa", runtime: "WebKit (Safari) / Chromium (Chrome)", status: "ready" },
      ],
      endpoints: {
        handshake: `${serverUrl}/api/mobile/v1/status`,
        summary: `${serverUrl}/api/mobile/v1/summary`,
        devicePair: `${serverUrl}/api/mobile/v1/auth/device-pair`,
        pushToken: `${serverUrl}/api/mobile/v1/push-token`,
        financialIntelligence: `${serverUrl}/api/v1/dashboard/financial-intelligence`,
      },
      pairingProtocol: "ATLAS_GO_MOBILE_V1",
      encryption: "TLS 1.3 Strict",
    },
    {
      headers: CORS_HEADERS,
    }
  );
}

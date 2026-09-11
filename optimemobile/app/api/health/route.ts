import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "Optime Financial (Atlas Go)",
    timestamp: new Date().toISOString(),
  });
}

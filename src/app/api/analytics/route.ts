import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    if (!origin || new URL(origin).host !== request.headers.get("host")) return new NextResponse(null, { status: 403 });
  } catch { return new NextResponse(null, { status: 403 }); }
  let body: { event?: string };
  try { body = await request.json(); } catch { return new NextResponse(null, { status: 400 }); }
  if (body.event !== "page_view" && body.event !== "whatsapp_click") return new NextResponse(null, { status: 400 });
  try {
    await sql`INSERT INTO site_events (event_type) VALUES (${body.event})`;
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}

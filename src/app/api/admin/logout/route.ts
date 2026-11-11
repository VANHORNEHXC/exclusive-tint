import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, logoutAdmin, sameOrigin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  try { await logoutAdmin(request); } catch (error) { console.error("Admin logout failed", error); }
  const response = NextResponse.json({ ok: true });
  clearAdminCookie(response);
  return response;
}

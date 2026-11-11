import { NextRequest, NextResponse } from "next/server";
import { getAdmin, sameOrigin } from "@/lib/admin-auth";
import { saveSiteTexts } from "@/lib/site-data";

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  if (!await getAdmin(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await request.json();
    await saveSiteTexts(body.texts);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Contenido inválido" }, { status: 400 });
  }
}

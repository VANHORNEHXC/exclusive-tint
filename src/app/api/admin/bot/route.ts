import { NextRequest, NextResponse } from "next/server";
import { getAdmin, sameOrigin } from "@/lib/admin-auth";
import { saveBotSettings } from "@/lib/site-data";

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  if (!await getAdmin(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await request.json();
    await saveBotSettings({
      enabled: body.enabled === true,
      start_time: body.start_time,
      end_time: body.end_time,
      timezone: body.timezone,
      reply_template: body.reply_template,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Configuración inválida" }, { status: 400 });
  }
}

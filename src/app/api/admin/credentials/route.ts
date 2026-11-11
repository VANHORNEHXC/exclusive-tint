import { NextRequest, NextResponse } from "next/server";
import { changeAdminCredentials, sameOrigin, setAdminCookie } from "@/lib/admin-auth";

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.currentPassword !== "string" || typeof body.username !== "string" || typeof body.newPassword !== "string") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const token = await changeAdminCredentials(body.currentPassword, body.username.trim(), body.newPassword, request);
    if (!token) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
    const response = NextResponse.json({ ok: true, username: body.username.trim() });
    setAdminCookie(response, request, token);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudieron cambiar las credenciales" }, { status: 400 });
  }
}

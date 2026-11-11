import { NextRequest, NextResponse } from "next/server";
import { loginAdmin, sameOrigin, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  let body: { username?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (typeof body.username !== "string" || typeof body.password !== "string") return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  try {
    const token = await loginAdmin(body.username.trim(), body.password);
    if (!token) return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    setAdminCookie(response, request, token);
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Portal no disponible. Revisa la migración de la base de datos." }, { status: 503 });
  }
}

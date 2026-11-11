import { NextRequest, NextResponse } from "next/server";
import { canStoreIntegrationSecrets, encryptSecret, getAdmin, getIntegrationStatus, INTEGRATION_KEYS, sameOrigin } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  if (!await getAdmin(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!canStoreIntegrationSecrets()) return NextResponse.json({ error: "Falta ADMIN_ENCRYPTION_KEY" }, { status: 503 });
  try {
    const body = await request.json() as { values?: Record<string, string>; clear?: string[] };
    for (const key of INTEGRATION_KEYS) {
      const value = body.values?.[key];
      if (value !== undefined) {
        if (typeof value !== "string" || value.length > 4000) throw new Error("Valor inválido");
        if (value.trim()) await sql`INSERT INTO integration_secrets (key, encrypted_value) VALUES (${key}, ${encryptSecret(value.trim())})
          ON CONFLICT (key) DO UPDATE SET encrypted_value = EXCLUDED.encrypted_value, updated_at = now()`;
      }
      if (body.clear?.includes(key)) await sql`DELETE FROM integration_secrets WHERE key = ${key}`;
    }
    return NextResponse.json({ ok: true, integrations: await getIntegrationStatus() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Credenciales inválidas" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { canStoreIntegrationSecrets, getAdmin, getIntegrationStatus } from "@/lib/admin-auth";
import { getAdminOrders, getAnalytics } from "@/lib/admin-data";
import { getBotSettings, getSiteImages, getSiteOverrides } from "@/lib/site-data";
import { defaultSiteTexts } from "@/lib/site-content";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdmin(request);
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const [orders, analytics, overrides, images, bot, integrations] = await Promise.all([
      getAdminOrders(), getAnalytics(), getSiteOverrides(), getSiteImages(), getBotSettings(), getIntegrationStatus(),
    ]);
    return NextResponse.json({
      admin,
      orders,
      analytics,
      texts: { es: { ...defaultSiteTexts.es, ...overrides.es }, en: { ...defaultSiteTexts.en, ...overrides.en } },
      images,
      bot,
      integrations,
      integrationStorageReady: canStoreIntegrationSecrets(),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Admin state failed", error);
    return NextResponse.json({ error: "No se pudo cargar el portal. Revisa la migración de la base de datos." }, { status: 503 });
  }
}

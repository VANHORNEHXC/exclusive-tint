import { NextResponse } from "next/server";
import { SITE_IMAGE_KEYS } from "@/lib/site-content";
import { getImageObject } from "@/lib/site-data";
import type { SiteImageSlot } from "@/lib/site-content";
import { getPresignedDownloadUrl } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  if (!SITE_IMAGE_KEYS.has(slot)) return new NextResponse(null, { status: 404 });
  try {
    const image = await getImageObject(slot as SiteImageSlot);
    if (!image) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(await getPresignedDownloadUrl(image.object_key, 300), {
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}

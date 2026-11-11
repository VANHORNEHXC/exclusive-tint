import { NextResponse } from "next/server";
import { getSiteImages, getSiteOverrides } from "@/lib/site-data";

export async function GET() {
  try {
    const [texts, images] = await Promise.all([getSiteOverrides(), getSiteImages()]);
    return NextResponse.json({ texts, images }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ texts: { es: {}, en: {} }, images: {} }, { headers: { "Cache-Control": "no-store" } });
  }
}

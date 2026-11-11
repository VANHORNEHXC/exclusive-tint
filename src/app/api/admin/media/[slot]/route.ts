import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdmin, sameOrigin } from "@/lib/admin-auth";
import { SITE_IMAGE_KEYS } from "@/lib/site-content";
import { sql } from "@/lib/db";
import { deleteFile, uploadFile } from "@/lib/storage";
import { getSiteImages } from "@/lib/site-data";

function imageType(buffer: Buffer): { mime: string; ext: string } | null {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { mime: "image/png", ext: "png" };
  if (buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return { mime: "image/jpeg", ext: "jpg" };
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  return null;
}

async function authorize(request: NextRequest, slot: string) {
  return sameOrigin(request) && SITE_IMAGE_KEYS.has(slot) && Boolean(await getAdmin(request));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  if (!await authorize(request, slot)) return NextResponse.json({ error: "No autorizado o espacio inválido" }, { status: 403 });
  if (!process.env.AWS_ENDPOINT_URL_S3 || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return NextResponse.json({ error: "Almacenamiento no configurado" }, { status: 503 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    const altEs = String(form.get("alt_es") ?? "").trim();
    const altEn = String(form.get("alt_en") ?? "").trim();
    if (!(file instanceof File) || file.size < 1 || file.size > 8 * 1024 * 1024 || altEs.length > 250 || altEn.length > 250) {
      return NextResponse.json({ error: "Imagen inválida (máximo 8 MB)" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = imageType(buffer);
    if (!type) return NextResponse.json({ error: "Usa PNG, JPG o WebP" }, { status: 400 });
    const key = `site/${slot}/${randomUUID()}.${type.ext}`;
    await uploadFile(buffer, key, type.mime);
    const [old] = await sql<Array<{ object_key: string }>>`SELECT object_key FROM site_images WHERE slot = ${slot}`;
    await sql`INSERT INTO site_images (slot, object_key, mime_type, alt_es, alt_en)
      VALUES (${slot}, ${key}, ${type.mime}, ${altEs}, ${altEn})
      ON CONFLICT (slot) DO UPDATE SET object_key = EXCLUDED.object_key, mime_type = EXCLUDED.mime_type,
        alt_es = EXCLUDED.alt_es, alt_en = EXCLUDED.alt_en, updated_at = now()`;
    if (old?.object_key && old.object_key !== key) await deleteFile(old.object_key).catch((error) => console.error("Old media cleanup failed", error));
    return NextResponse.json({ ok: true, images: await getSiteImages() });
  } catch (error) {
    console.error("Media upload failed", error);
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  if (!await authorize(request, slot)) return NextResponse.json({ error: "No autorizado o espacio inválido" }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.alt_es !== "string" || typeof body.alt_en !== "string" || body.alt_es.length > 250 || body.alt_en.length > 250) return NextResponse.json({ error: "Texto alternativo inválido" }, { status: 400 });
    await sql`UPDATE site_images SET alt_es = ${body.alt_es.trim()}, alt_en = ${body.alt_en.trim()}, updated_at = now() WHERE slot = ${slot}`;
    return NextResponse.json({ ok: true, images: await getSiteImages() });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  if (!await authorize(request, slot)) return NextResponse.json({ error: "No autorizado o espacio inválido" }, { status: 403 });
  try {
    const [old] = await sql<Array<{ object_key: string }>>`DELETE FROM site_images WHERE slot = ${slot} RETURNING object_key`;
    if (old) await deleteFile(old.object_key).catch((error) => console.error("Media deletion failed", error));
    return NextResponse.json({ ok: true, images: await getSiteImages() });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}

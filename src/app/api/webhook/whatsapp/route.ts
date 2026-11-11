import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function validSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(signature.slice(7), "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

function isNightTime(): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Panama",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date())
  );
  return hour >= 19 || hour < 9;
}

function generateReply(name: string): string {
  return `¡Hola ${name || "cliente"}! Gracias por escribir a Exclusive Tint. Nuestro taller está cerrado en este momento. Para preparar tu cotización, indícanos la marca, el modelo y el año de tu vehículo, el servicio que deseas y la tonalidad preferida. Te responderemos en horario de atención.`;
}

export async function GET(req: NextRequest) {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken) return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });

  const params = req.nextUrl.searchParams;
  if (
    params.get("hub.mode") === "subscribe" &&
    params.get("hub.verify_token") === verifyToken &&
    params.get("hub.challenge")
  ) {
    return new NextResponse(params.get("hub.challenge"), { status: 200 });
  }
  return NextResponse.json({ error: "Verificación inválida" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });

  const rawBody = await req.text();
  if (Buffer.byteLength(rawBody) > 1024 * 1024) {
    return NextResponse.json({ error: "Payload demasiado grande" }, { status: 413 });
  }
  if (!validSignature(rawBody, req.headers.get("x-hub-signature-256"), appSecret)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let payload: {
    entry?: Array<{ changes?: Array<{ value?: {
      messages?: Array<{ id?: string; from?: string; type?: string; text?: { body?: string } }>;
      contacts?: Array<{ profile?: { name?: string } }>;
    } }> }>;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const value = payload.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];
  if (!message || message.type !== "text" || !message.from || !isNightTime()) {
    return NextResponse.json({ success: true, processed: false });
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION;
  if (!accessToken || !phoneNumberId || !apiVersion || !/^v\d+\.\d+$/.test(apiVersion)) {
    return NextResponse.json({ error: "Respuesta automática no configurada" }, { status: 503 });
  }

  const name = value?.contacts?.[0]?.profile?.name?.slice(0, 80) || "cliente";
  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${encodeURIComponent(phoneNumberId)}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: message.from,
          type: "text",
          text: { body: generateReply(name) },
        }),
        cache: "no-store",
      }
    );
    if (!response.ok) {
      console.error("WhatsApp reply failed with status", response.status);
      return NextResponse.json({ error: "No se pudo enviar la respuesta" }, { status: 502 });
    }
    return NextResponse.json({ success: true, processed: true });
  } catch {
    return NextResponse.json({ error: "No se pudo contactar WhatsApp" }, { status: 502 });
  }
}

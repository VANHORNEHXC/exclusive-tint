import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook para el bot de WhatsApp (Nocturno / Lead Triage) de Exclusive Tint.
 * 
 * 1. GET: Verificación del Webhook (compatible con Meta WhatsApp Cloud API / Twilio).
 * 2. POST: Recepción de mensajes entrantes y automatización nocturna de cotizaciones y citas.
 */

// Token de verificación configurable en variables de entorno o fallback seguro
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "exclusive_tint_wa_token_2026";

/**
 * GET: Handshake de verificación de Meta / WhatsApp API
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp Webhook] Handshake verificado exitosamente.");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json(
    { error: "Forbidden: Token de verificación inválido" },
    { status: 403 }
  );
}

/**
 * Determina si la hora actual corresponde al horario nocturno (fuera de oficina, ej: 7:00 PM - 8:30 AM)
 */
function isNightTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  // Horario nocturno: después de las 19:00 (7 PM) o antes de las 9:00 AM
  return hours >= 19 || hours < 9;
}

/**
 * Genera una respuesta nocturna automatizada personalizada
 */
function generateNocturnalReply(senderName: string, messageBody: string): string {
  const lowerMsg = messageBody.toLowerCase();

  let serviceMention = "polarizado cerámico, PPF o wrap";
  if (lowerMsg.includes("tint") || lowerMsg.includes("polarizado") || lowerMsg.includes("papel")) {
    serviceMention = "polarizado cerámico de alta reducción térmica";
  } else if (lowerMsg.includes("ppf") || lowerMsg.includes("proteccion")) {
    serviceMention = "Paint Protection Film (PPF)";
  } else if (lowerMsg.includes("ceramico") || lowerMsg.includes("ceramic coating")) {
    serviceMention = "Ceramic Coating para pintura y cristales";
  }

  return (
    `¡Hola ${senderName || "amigo"}! 🌙 Gracias por escribir a Exclusive Tint.\n\n` +
    `En este momento nuestro taller está cerrado, pero nuestro bot nocturno ya registró tu consulta sobre *${serviceMention}*.\n\n` +
    `🚗 Para avanzar con tu cotización exacta al abrir, por favor indícanos:\n` +
    `1. Marca, modelo y año de tu vehículo.\n` +
    `2. Servicio deseado (Parabrisas, laterales/trasero, o completo).\n` +
    `3. Tonalidad preferida (5%, 20%, 35%, 50% o 70% transparente térmico).\n\n` +
    `¡Te responderemos a primera hora con tu presupuesto prioritario!`
  );
}

/**
 * POST: Procesa los mensajes recibidos
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log para depuración
    console.log("[WhatsApp Webhook] Payload entrante:", JSON.stringify(body, null, 2));

    // Estructura de Meta WhatsApp Cloud API
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const fromNumber = message.from; // Número de WhatsApp del cliente
      const messageText = message.text?.body || message.caption || "";
      const contactProfile = value?.contacts?.[0]?.profile?.name || "Cliente";

      const nocturnal = isNightTime();

      console.log(`[WhatsApp Bot] Mensaje de ${contactProfile} (${fromNumber}): "${messageText}" | Modo nocturno: ${nocturnal}`);

      const autoReply = generateNocturnalReply(contactProfile, messageText);

      // Aquí se conectaría la llamada a la API de WhatsApp para enviar `autoReply` al cliente
      // (ej: fetch(`https://graph.facebook.com/v21.0/${value.metadata.phone_number_id}/messages`, ...))

      return NextResponse.json({
        success: true,
        processed: true,
        lead: {
          from: fromNumber,
          name: contactProfile,
          message: messageText,
          isNocturnal: nocturnal,
          suggestedReply: autoReply,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Respuesta rápida requerida por Meta para evitar reintentos automáticos
    return NextResponse.json({ success: true, processed: false, message: "Evento no procesable" });
  } catch (error) {
    console.error("[WhatsApp Webhook] Error procesando webhook:", error);
    // Respondemos 200 con bandera de error para no romper la suscripción en Meta
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 200 }
    );
  }
}

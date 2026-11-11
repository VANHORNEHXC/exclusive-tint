import { sql } from "@/lib/db";
import { SITE_IMAGE_KEYS, SITE_TEXT_KEYS } from "@/lib/site-content";
import type { SiteImage, SiteImageSlot } from "@/lib/site-content";
import type { Locale } from "@/lib/translations";

export async function getSiteOverrides(): Promise<Record<Locale, Record<string, string>>> {
  const rows = await sql<Array<{ locale: Locale; key: string; value: string }>>`
    SELECT locale, key, value FROM site_texts`;
  const result: Record<Locale, Record<string, string>> = { es: {}, en: {} };
  for (const row of rows) if (SITE_TEXT_KEYS.has(row.key) && (row.locale === "es" || row.locale === "en")) result[row.locale][row.key] = row.value;
  return result;
}

export async function saveSiteTexts(texts: Record<Locale, Record<string, string>>): Promise<void> {
  const rows: Array<{ locale: Locale; key: string; value: string }> = [];
  for (const locale of ["es", "en"] as const) {
    for (const [key, value] of Object.entries(texts[locale] ?? {})) {
      if (!SITE_TEXT_KEYS.has(key) || typeof value !== "string" || value.length > 5000) throw new Error(`Campo inválido: ${key}`);
      rows.push({ locale, key, value });
    }
  }
  if (rows.length === 0 || rows.length > SITE_TEXT_KEYS.size * 2) throw new Error("Contenido inválido");
  await sql`INSERT INTO site_texts ${sql(rows, "locale", "key", "value")}
    ON CONFLICT (locale, key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}

export async function getSiteImages(): Promise<Record<string, SiteImage>> {
  const rows = await sql<Array<{ slot: string; alt_es: string; alt_en: string; updated_at: Date }>>`
    SELECT slot, alt_es, alt_en, updated_at FROM site_images`;
  return Object.fromEntries(rows.filter((row) => SITE_IMAGE_KEYS.has(row.slot)).map((row) => [row.slot, {
    slot: row.slot,
    url: `/api/site/media/${row.slot}?v=${row.updated_at.getTime()}`,
    alt_es: row.alt_es,
    alt_en: row.alt_en,
    updated_at: row.updated_at.toISOString(),
  }]));
}

export async function getImageObject(slot: SiteImageSlot): Promise<{ object_key: string; mime_type: string } | null> {
  const [row] = await sql<Array<{ object_key: string; mime_type: string }>>`
    SELECT object_key, mime_type FROM site_images WHERE slot = ${slot} LIMIT 1`;
  return row ?? null;
}

export interface BotSettings {
  enabled: boolean;
  start_time: string;
  end_time: string;
  timezone: string;
  reply_template: string;
}

export async function getBotSettings(): Promise<BotSettings> {
  const [row] = await sql<BotSettings[]>`
    SELECT enabled, start_time::text, end_time::text, timezone, reply_template
    FROM bot_settings WHERE id = 1`;
  return row ?? {
    enabled: false,
    start_time: "19:00",
    end_time: "09:00",
    timezone: "America/Panama",
    reply_template: "¡Hola {name}! Gracias por escribir a Exclusive Tint. Indícanos marca, modelo, año, servicio y tonalidad.",
  };
}

export async function saveBotSettings(settings: BotSettings): Promise<void> {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(settings.start_time) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(settings.end_time)) throw new Error("Horario inválido");
  if (!settings.timezone || settings.timezone.length > 100 || settings.reply_template.length < 10 || settings.reply_template.length > 2000) throw new Error("Configuración inválida");
  try { new Intl.DateTimeFormat("en-US", { timeZone: settings.timezone }); } catch { throw new Error("Zona horaria inválida"); }
  await sql`INSERT INTO bot_settings (id, enabled, start_time, end_time, timezone, reply_template)
    VALUES (1, ${settings.enabled}, ${settings.start_time}, ${settings.end_time}, ${settings.timezone}, ${settings.reply_template})
    ON CONFLICT (id) DO UPDATE SET enabled = EXCLUDED.enabled, start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time, timezone = EXCLUDED.timezone, reply_template = EXCLUDED.reply_template, updated_at = now()`;
}

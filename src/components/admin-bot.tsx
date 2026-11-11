"use client";

import { useState, type FormEvent } from "react";
import { adminRequest } from "@/lib/admin-client";
import type { BotSettings } from "@/lib/site-data";
import type { IntegrationKey } from "@/lib/admin-auth";

export function AdminBot({ settings, integrations, onSaved }: { settings: BotSettings; integrations: Record<IntegrationKey, boolean>; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const ready = ["WHATSAPP_WEBHOOK_VERIFY_TOKEN", "WHATSAPP_APP_SECRET", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_GRAPH_API_VERSION"].every((key) => integrations[key as IntegrationKey]);

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try { await adminRequest("bot", "PUT", form); await onSaved(); setNotice("Configuración guardada."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "No se pudo guardar"); }
    finally { setBusy(false); }
  }

  return <section className="max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-6">
    <h2 className="text-xl font-bold">Respuesta automática de WhatsApp</h2>
    <p className="mt-2 text-sm text-zinc-400">El bot responde a mensajes de texto recibidos durante este horario.</p>
    {!ready && <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">Completa las credenciales de Meta en Credentials antes de activar el bot.</p>}
    <form onSubmit={(event) => void save(event)} className="mt-6 space-y-5">
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} /> Bot activado</label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">Desde<input required type="time" value={form.start_time.slice(0, 5)} onChange={(event) => setForm({ ...form, start_time: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
        <label className="block text-sm">Hasta<input required type="time" value={form.end_time.slice(0, 5)} onChange={(event) => setForm({ ...form, end_time: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
      </div>
      <label className="block text-sm">Zona horaria<input required value={form.timezone} onChange={(event) => setForm({ ...form, timezone: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
      <label className="block text-sm">Respuesta automática<textarea required rows={6} maxLength={2000} value={form.reply_template} onChange={(event) => setForm({ ...form, reply_template: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
      <p className="text-xs text-zinc-500">Usa {"{name}"} para incluir el nombre del cliente.</p>
      <button disabled={busy || (form.enabled && !ready)} className="rounded-lg bg-amber-500 px-5 py-3 font-bold text-black disabled:opacity-50">Guardar bot</button>
      {notice && <p role="status" className="text-sm text-amber-300">{notice}</p>}
    </form>
  </section>;
}

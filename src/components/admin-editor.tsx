"use client";

import { useState } from "react";
import { SITE_IMAGE_SLOTS, SITE_TEXT_FIELDS } from "@/lib/site-content";
import type { SiteImage } from "@/lib/site-content";
import type { Locale } from "@/lib/translations";
import { adminRequest } from "@/lib/admin-client";

export function AdminEditor({ texts, images, onSaved }: {
  texts: Record<Locale, Record<string, string>>;
  images: Record<string, SiteImage>;
  onSaved: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<Record<Locale, Record<string, string>>>(() => ({ es: { ...texts.es }, en: { ...texts.en } }));
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const filtered = SITE_TEXT_FIELDS.filter((field) => `${field.key} ${field.label} ${field.group}`.toLowerCase().includes(search.toLowerCase()));
  const groups = [...new Set(filtered.map((field) => field.group))];

  function update(locale: Locale, key: string, value: string) {
    setDraft((current) => ({ ...current, [locale]: { ...current[locale], [key]: value } }));
  }

  async function saveTexts() {
    setBusy(true); setError(""); setMessage("");
    try { await adminRequest("content", "PUT", { texts: draft }); await onSaved(); setMessage("Textos publicados. Actualiza el sitio para verlos."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudieron guardar los textos"); }
    finally { setBusy(false); }
  }

  async function saveImage(event: React.FormEvent<HTMLFormElement>, slot: string) {
    event.preventDefault(); setImageBusy(slot); setError(""); setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    try {
      if (file instanceof File && file.size > 0) {
        const response = await fetch(`/api/admin/media/${slot}`, { method: "POST", body: data });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "No se pudo subir la imagen");
        form.reset();
      } else {
        await adminRequest(`media/${slot}`, "PATCH", { alt_es: data.get("alt_es"), alt_en: data.get("alt_en") });
      }
      await onSaved(); setMessage("Imagen publicada.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo guardar la imagen"); }
    finally { setImageBusy(null); }
  }

  async function removeImage(slot: string) {
    if (!confirm("¿Quitar esta imagen del sitio?")) return;
    setImageBusy(slot); setError("");
    try { await adminRequest(`media/${slot}`, "DELETE"); await onSaved(); setMessage("Imagen eliminada."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo eliminar"); }
    finally { setImageBusy(null); }
  }

  return <section className="space-y-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="text-xl font-bold">Web Editor</h2><p className="mt-1 text-sm text-zinc-400">Edita los textos visibles en español e inglés y las imágenes de la portada.</p></div>
      <a href="/" target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:border-amber-400">Vista previa ↗</a>
    </div>
    {message && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
    {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-semibold">Textos</h3><button disabled={busy} onClick={() => void saveTexts()} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-50">{busy ? "Publicando..." : "Publicar textos"}</button></div>
      <input aria-label="Buscar textos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar sección o texto" className="mt-5 w-full rounded-lg border border-white/15 bg-zinc-900 p-2.5 text-sm sm:max-w-sm" />
      <div className="mt-5 space-y-3">{groups.map((group) => <details key={group} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4" open={Boolean(search)}>
        <summary className="cursor-pointer font-semibold">{group} <span className="ml-2 text-xs text-zinc-500">{filtered.filter((field) => field.group === group).length} campos</span></summary>
        <div className="mt-5 space-y-5">{filtered.filter((field) => field.group === group).map((field) => <div key={field.key} className="border-t border-white/5 pt-4">
          <p className="mb-2 text-sm font-medium">{field.label} <code className="ml-2 text-xs text-zinc-500">{field.key}</code></p>
          <div className="grid gap-3 md:grid-cols-2">{(["es", "en"] as const).map((locale) => <label key={locale} className="text-xs uppercase tracking-wide text-zinc-400">{locale === "es" ? "Español" : "English"}<textarea value={draft[locale][field.key] ?? ""} onChange={(event) => update(locale, field.key, event.target.value)} rows={Math.max(2, Math.min(5, Math.ceil((draft[locale][field.key]?.length ?? 0) / 65)))} className="mt-1 w-full resize-y rounded-lg border border-white/15 bg-zinc-950 p-2.5 text-sm normal-case tracking-normal text-white" /></label>)}</div>
        </div>)}</div>
      </details>)}</div>
      <button disabled={busy} onClick={() => void saveTexts()} className="mt-5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-50">Publicar textos</button>
    </div>
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <h3 className="text-lg font-semibold">Imágenes</h3><p className="mt-1 text-sm text-zinc-400">PNG, JPG o WebP; máximo 8 MB. Las imágenes se guardan en el bucket configurado.</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{SITE_IMAGE_SLOTS.map(({ slot, label }) => <div key={`${slot}-${images[slot]?.updated_at ?? "empty"}`} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
        <h4 className="font-semibold">{label}</h4>
        {images[slot] ? <div role="img" aria-label={images[slot].alt_es || label} className="mt-3 h-40 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${images[slot].url})` }} /> : <div className="mt-3 flex h-40 items-center justify-center rounded-lg border border-dashed border-white/15 text-sm text-zinc-500">Sin imagen</div>}
        <form onSubmit={(event) => void saveImage(event, slot)} className="mt-4 space-y-3">
          <input name="file" type="file" accept="image/png,image/jpeg,image/webp" className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-white" />
          <input name="alt_es" defaultValue={images[slot]?.alt_es ?? ""} placeholder="Texto alternativo (español)" className="w-full rounded-lg border border-white/15 bg-zinc-950 p-2 text-sm" />
          <input name="alt_en" defaultValue={images[slot]?.alt_en ?? ""} placeholder="Alt text (English)" className="w-full rounded-lg border border-white/15 bg-zinc-950 p-2 text-sm" />
          <div className="flex gap-2"><button disabled={imageBusy === slot} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black disabled:opacity-50">{imageBusy === slot ? "Guardando..." : "Guardar imagen / texto alt"}</button>{images[slot] && <button type="button" onClick={() => void removeImage(slot)} className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300">Quitar</button>}</div>
        </form>
      </div>)}</div>
    </div>
  </section>;
}

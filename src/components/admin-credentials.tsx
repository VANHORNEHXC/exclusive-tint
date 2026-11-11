"use client";

import { useState, type FormEvent } from "react";
import { adminRequest } from "@/lib/admin-client";
import type { IntegrationKey } from "@/lib/admin-auth";

const fields: Array<{ key: IntegrationKey; label: string; secret?: boolean }> = [
  { key: "WHATSAPP_WEBHOOK_VERIFY_TOKEN", label: "Webhook verify token", secret: true },
  { key: "WHATSAPP_APP_SECRET", label: "Meta app secret", secret: true },
  { key: "WHATSAPP_ACCESS_TOKEN", label: "Meta access token", secret: true },
  { key: "WHATSAPP_PHONE_NUMBER_ID", label: "Phone number ID" },
  { key: "WHATSAPP_GRAPH_API_VERSION", label: "Graph API version (ej. v23.0)" },
];

export function AdminCredentials({ username, integrations, storageReady, onSaved }: {
  username: string; integrations: Record<IntegrationKey, boolean>; storageReady: boolean; onSaved: () => Promise<void>;
}) {
  const [account, setAccount] = useState({ username, currentPassword: "", newPassword: "" });
  const [values, setValues] = useState<Record<string, string>>({});
  const [clear, setClear] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function saveAccount(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      await adminRequest("credentials", "PUT", account);
      setAccount({ username: account.username, currentPassword: "", newPassword: "" });
      await onSaved(); setNotice("Acceso actualizado.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "No se pudo actualizar el acceso"); }
    finally { setBusy(false); }
  }

  async function saveIntegrations(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      await adminRequest("integrations", "PUT", { values, clear });
      setValues({}); setClear([]); await onSaved(); setNotice("Credenciales de Meta actualizadas.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "No se pudieron guardar las credenciales"); }
    finally { setBusy(false); }
  }

  return <div className="grid gap-6 lg:grid-cols-2">
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
      <h2 className="text-xl font-bold">Acceso al portal</h2>
      <p className="mt-2 text-sm text-zinc-400">Cambia el usuario y la contraseña de administración.</p>
      <form onSubmit={(event) => void saveAccount(event)} className="mt-5 space-y-4">
        <label className="block text-sm">Usuario<input required minLength={3} value={account.username} onChange={(event) => setAccount({ ...account, username: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
        <label className="block text-sm">Contraseña actual<input required type="password" autoComplete="current-password" value={account.currentPassword} onChange={(event) => setAccount({ ...account, currentPassword: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
        <label className="block text-sm">Nueva contraseña<input required type="password" autoComplete="new-password" minLength={16} value={account.newPassword} onChange={(event) => setAccount({ ...account, newPassword: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
        <button disabled={busy} className="rounded-lg bg-amber-500 px-5 py-3 font-bold text-black disabled:opacity-50">Guardar acceso</button>
      </form>
    </section>
    <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
      <h2 className="text-xl font-bold">Credenciales del bot</h2>
      <p className="mt-2 text-sm text-zinc-400">Los valores guardados están cifrados y nunca se muestran aquí. Deja un campo vacío para conservarlo.</p>
      {!storageReady && <p role="alert" className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">Configura ADMIN_ENCRYPTION_KEY en el servidor para guardar credenciales.</p>}
      <form onSubmit={(event) => void saveIntegrations(event)} className="mt-5 space-y-4">
        {fields.map(({ key, label, secret }) => <div key={key}>
          <label className="block text-sm">{label} <span className={integrations[key] ? "text-emerald-400" : "text-zinc-500"}>· {integrations[key] ? "Configurado" : "Pendiente"}</span>
            <input type={secret ? "password" : "text"} autoComplete="off" value={values[key] ?? ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" />
          </label>
          {integrations[key] && <label className="mt-1 flex items-center gap-2 text-xs text-zinc-400"><input type="checkbox" checked={clear.includes(key)} onChange={(event) => setClear(event.target.checked ? [...clear, key] : clear.filter((item) => item !== key))} /> Borrar valor guardado</label>}
        </div>)}
        <button disabled={busy || !storageReady} className="rounded-lg bg-amber-500 px-5 py-3 font-bold text-black disabled:opacity-50">Guardar credenciales del bot</button>
      </form>
    </section>
    {notice && <p role="status" className="lg:col-span-2 text-sm text-amber-300">{notice}</p>}
  </div>;
}

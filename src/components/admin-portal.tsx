"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Bot, ClipboardList, Globe2, KeyRound, LogOut } from "lucide-react";
import { AdminOrders } from "@/components/admin-orders";
import { AdminEditor } from "@/components/admin-editor";
import { AdminCredentials } from "@/components/admin-credentials";
import { AdminBot } from "@/components/admin-bot";
import type { OrderStatus } from "@/lib/schema";
import type { BotSettings } from "@/lib/site-data";
import type { SiteImage } from "@/lib/site-content";
import type { Locale } from "@/lib/translations";
import type { IntegrationKey } from "@/lib/admin-auth";
import { adminRequest } from "@/lib/admin-client";

export interface AdminOrder {
  id: string; number: string; client: string; phone: string; email: string | null;
  vehicleMake: string; vehicleModel: string; vehicleYear: number | null;
  service: string; shade: string | null; status: OrderStatus; scheduledAt: string | null;
  totalPrice: number; depositPaid: number; notes: string | null; source: string; createdAt: string;
}
export interface AnalyticsData {
  totalOrders: number; activeOrders: number; deliveredValue: number;
  byStatus: Array<{ status: string; count: number; value: number }>;
  daily: Array<{ day: string; page_views: number; whatsapp_clicks: number }>;
  pageViews: number; whatsappClicks: number;
}
export interface AdminState {
  admin: { id: number; username: string };
  orders: AdminOrder[];
  analytics: AnalyticsData;
  texts: Record<Locale, Record<string, string>>;
  images: Record<string, SiteImage>;
  bot: BotSettings;
  integrations: Record<IntegrationKey, boolean>;
  integrationStorageReady: boolean;
}

const tabs = [
  { id: "orders", label: "Orders", Icon: ClipboardList },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
  { id: "editor", label: "Web Editor", Icon: Globe2 },
  { id: "credentials", label: "Credentials", Icon: KeyRound },
  { id: "bot", label: "Bot Settings", Icon: Bot },
] as const;
type Tab = typeof tabs[number]["id"];

function Analytics({ data }: { data: AnalyticsData }) {
  const max = Math.max(1, ...data.daily.map((day) => day.page_views));
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Visitas · 30 días", data.pageViews.toLocaleString("es-PA")],
          ["Clics a WhatsApp", data.whatsappClicks.toLocaleString("es-PA")],
          ["Órdenes", data.totalOrders.toLocaleString("es-PA")],
          ["Valor entregado", `$${data.deliveredValue.toLocaleString("es-PA", { maximumFractionDigits: 2 })}`],
        ].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-zinc-950 p-5"><p className="text-xs uppercase tracking-wider text-zinc-400">{label}</p><p className="mt-2 text-3xl font-bold text-white">{value}</p></div>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 lg:col-span-2">
          <h2 className="font-bold">Visitas diarias · últimos 30 días</h2>
          {data.daily.length ? <div className="mt-8 flex h-52 items-end gap-1 overflow-x-auto border-b border-white/10 pb-2">
            {data.daily.map((day) => <div key={day.day} className="group relative flex min-w-3 flex-1 flex-col justify-end" title={`${day.day}: ${day.page_views} visitas, ${day.whatsapp_clicks} clics`}>
              <div className="rounded-t bg-amber-500/80 transition-colors group-hover:bg-amber-300" style={{ height: `${Math.max(4, day.page_views / max * 100)}%` }} />
            </div>)}
          </div> : <p className="mt-8 text-sm text-zinc-400">Las visitas aparecerán aquí cuando el sitio reciba tráfico.</p>}
          <p className="mt-3 text-xs text-zinc-500">Conteos anónimos; no se guardan IP ni datos personales.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="font-bold">Órdenes por estado</h2>
          <div className="mt-5 space-y-3">{data.byStatus.length ? data.byStatus.map((row) => <div key={row.status} className="flex justify-between border-b border-white/5 pb-2 text-sm"><span className="text-zinc-400">{row.status}</span><strong>{row.count}</strong></div>) : <p className="text-sm text-zinc-400">Sin órdenes reales.</p>}</div>
          <p className="mt-5 text-sm text-amber-300">{data.activeOrders} órdenes activas</p>
        </div>
      </div>
    </section>
  );
}

export function AdminPortal() {
  const [state, setState] = useState<AdminState | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("orders");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    const response = await fetch("/api/admin/state", { cache: "no-store" });
    if (response.status === 401) { setState(null); setLoading(false); return; }
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No se pudo cargar el portal");
    setState(payload as AdminState);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/admin/state", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return null;
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "No se pudo cargar el portal");
        return payload as AdminState;
      })
      .then((payload) => { if (active) { setState(payload); setLoading(false); } })
      .catch((reason) => { if (active) { setError(reason.message); setLoading(false); } });
    return () => { active = false; };
  }, []);

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await adminRequest("login", "POST", login);
      setLogin({ username: "", password: "" });
      await reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión"); }
    finally { setBusy(false); }
  }

  async function logout() {
    await adminRequest("logout", "POST");
    setState(null);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Exclusive Tint</p><h1 className="mt-2 text-3xl font-black">Portal Admin</h1></div>
          <div className="flex items-center gap-4"><Link href="/" className="text-sm text-zinc-400 hover:text-white">Ver sitio</Link>{state && <button onClick={() => void logout()} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><LogOut className="h-4 w-4" /> Salir</button>}</div>
        </header>
        {loading ? <p className="text-zinc-400">Cargando portal...</p> : !state ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-7">
            <h2 className="text-xl font-bold">Acceso al equipo</h2>
            <p className="mt-2 text-sm text-zinc-400">Inicia sesión con las credenciales del administrador.</p>
            <form onSubmit={(event) => void submitLogin(event)} className="mt-6 space-y-4">
              <label className="block text-sm">Usuario<input required autoComplete="username" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
              <label className="block text-sm">Contraseña<input required type="password" autoComplete="current-password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-3" /></label>
              <button disabled={busy} className="w-full rounded-lg bg-amber-500 p-3 font-bold text-black disabled:opacity-50">{busy ? "Entrando..." : "Entrar"}</button>
            </form>
            {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap gap-2 border-b border-white/10 pb-4" role="tablist" aria-label="Secciones del portal">
              {tabs.map(({ id, label, Icon }) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${tab === id ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</button>)}
            </div>
            {tab === "orders" && <AdminOrders orders={state.orders} onSaved={reload} />}
            {tab === "analytics" && <Analytics data={state.analytics} />}
            {tab === "editor" && <AdminEditor texts={state.texts} images={state.images} onSaved={reload} />}
            {tab === "credentials" && <AdminCredentials username={state.admin.username} integrations={state.integrations} storageReady={state.integrationStorageReady} onSaved={reload} />}
            {tab === "bot" && <AdminBot settings={state.bot} integrations={state.integrations} onSaved={reload} />}
          </>
        )}
      </div>
    </main>
  );
}

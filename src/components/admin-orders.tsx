"use client";

import { useState } from "react";
import type { AdminOrder } from "@/components/admin-portal";
import type { OrderInput } from "@/lib/order-input";
import type { OrderStatus } from "@/lib/schema";
import { adminRequest } from "@/lib/admin-client";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente", confirmed: "Confirmada", in_progress: "En proceso",
  ready: "Lista para entrega", delivered: "Entregada", cancelled: "Cancelada",
};
const empty: OrderInput = {
  client: "", phone: "", email: "", vehicleMake: "", vehicleModel: "", vehicleYear: null,
  service: "", shade: "", status: "pending", scheduledAt: "", totalPrice: 0, depositPaid: 0, notes: "",
};

export function AdminOrders({ orders, onSaved }: { orders: AdminOrder[]; onSaved: () => Promise<void> }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<OrderInput>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const filtered = orders.filter((order) => `${order.number} ${order.client} ${order.vehicleMake} ${order.vehicleModel}`.toLowerCase().includes(search.toLowerCase()));

  function open(order?: AdminOrder) {
    setError("");
    setEditing(order?.id ?? "new");
    setForm(order ? {
      client: order.client, phone: order.phone, email: order.email ?? "", vehicleMake: order.vehicleMake,
      vehicleModel: order.vehicleModel, vehicleYear: order.vehicleYear, service: order.service,
      shade: order.shade ?? "", status: order.status, scheduledAt: order.scheduledAt ? new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Panama", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(order.scheduledAt)).replace(" ", "T") : "",
      totalPrice: order.totalPrice, depositPaid: order.depositPaid, notes: order.notes ?? "",
    } : { ...empty });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); if (!editing) return;
    setBusy(true); setError("");
    try {
      const payload = { ...form, scheduledAt: form.scheduledAt ? new Date(`${form.scheduledAt}:00-05:00`).toISOString() : null };
      await adminRequest(editing === "new" ? "orders" : `orders/${editing}`, editing === "new" ? "POST" : "PATCH", payload);
      await onSaved();
      setEditing(null);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo guardar"); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-bold">Órdenes</h2><p className="text-sm text-zinc-400">{orders.length} órdenes recientes</p></div>
      <button onClick={() => open()} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black">Nueva orden</button>
    </div>
    <input aria-label="Buscar órdenes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar número, cliente o vehículo" className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm sm:max-w-sm" />
    {filtered.length === 0 ? <p className="rounded-xl border border-white/10 p-8 text-center text-zinc-400">No hay órdenes que mostrar.</p> :
      <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-400"><tr><th className="p-4">Orden</th><th className="p-4">Cliente</th><th className="p-4">Vehículo</th><th className="p-4">Servicio</th><th className="p-4">Cita</th><th className="p-4">Estado</th><th className="p-4">Acción</th></tr></thead>
        <tbody>{filtered.map((order) => <tr key={order.id} className="border-t border-white/10 align-top">
          <td className="p-4 font-mono text-amber-400">{order.number}</td>
          <td className="p-4"><strong className="block">{order.client}</strong><span className="text-zinc-400">{order.phone}</span></td>
          <td className="p-4">{order.vehicleMake} {order.vehicleModel} {order.vehicleYear}</td>
          <td className="p-4">{order.service}</td>
          <td className="p-4">{order.scheduledAt ? new Date(order.scheduledAt).toLocaleString("es-PA", { timeZone: "America/Panama" }) : "Sin fecha"}</td>
          <td className="p-4">{statusLabels[order.status]}</td>
          <td className="p-4"><button onClick={() => open(order)} className="rounded-lg border border-white/15 px-3 py-1.5 hover:border-amber-400">Editar</button></td>
        </tr>)}</tbody>
      </table></div>}
    {editing && <div role="dialog" aria-modal="true" aria-label={editing === "new" ? "Nueva orden" : "Editar orden"} className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 sm:p-8">
      <form onSubmit={(event) => void save(event)} className="w-full max-w-3xl space-y-5 rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex justify-between"><h3 className="text-xl font-bold">{editing === "new" ? "Nueva orden" : "Editar orden"}</h3><button type="button" onClick={() => setEditing(null)} className="text-zinc-400 hover:text-white">Cerrar</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["client", "Cliente", true], ["phone", "Teléfono", true], ["email", "Email", false],
            ["vehicleMake", "Marca", true], ["vehicleModel", "Modelo", true], ["vehicleYear", "Año", false],
            ["service", "Servicio", true], ["shade", "Tonalidad", false],
            ["totalPrice", "Precio total", false], ["depositPaid", "Anticipo", false],
          ] as const).map(([key, label, required]) => <label key={key} className="text-sm">{label}<input
            required={required} type={key === "vehicleYear" || key === "totalPrice" || key === "depositPaid" ? "number" : key === "email" ? "email" : "text"}
            min={key === "vehicleYear" ? 1900 : key === "totalPrice" || key === "depositPaid" ? 0 : undefined}
            step={key === "totalPrice" || key === "depositPaid" ? "0.01" : undefined}
            value={form[key] ?? ""} onChange={(event) => setForm({ ...form, [key]: key === "vehicleYear" || key === "totalPrice" || key === "depositPaid" ? (event.target.value === "" ? null : Number(event.target.value)) : event.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-2.5" /></label>)}
          <label className="text-sm">Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as OrderStatus })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-2.5">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="text-sm">Cita · hora de Panamá<input type="datetime-local" value={form.scheduledAt ?? ""} onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-2.5" /></label>
        </div>
        <label className="block text-sm">Notas<textarea value={form.notes ?? ""} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-900 p-2.5" /></label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/15 px-4 py-2">Cancelar</button><button disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-black disabled:opacity-50">{busy ? "Guardando..." : "Guardar orden"}</button></div>
      </form>
    </div>}
  </section>;
}

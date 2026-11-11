"use client";

import { useState } from "react";
import type { OrderStatus } from "@/lib/schema";

interface AdminOrder {
  id: string;
  number: string;
  client: string;
  phone: string;
  vehicle: string;
  service: string;
  status: OrderStatus;
  scheduledAt: string | null;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  in_progress: "En proceso",
  ready: "Lista para entrega",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

export function AdminOrders({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const filtered = orders.filter((order) =>
    `${order.number} ${order.client} ${order.vehicle}`.toLowerCase().includes(search.toLowerCase())
  );

  async function changeStatus(id: string, status: OrderStatus) {
    setSaving(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("No se pudo guardar el estado.");
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    } catch {
      setError("No se pudo guardar el estado. Inténtalo nuevamente.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{orders.length} órdenes recientes</p>
        <input
          aria-label="Buscar órdenes"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar cliente, vehículo o número"
          className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm text-white sm:w-72"
        />
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-red-300">{error}</p>}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-white/10 p-8 text-center text-zinc-400">No hay órdenes que mostrar.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400"><tr>
              <th className="p-4">Orden</th><th className="p-4">Cliente</th><th className="p-4">Vehículo</th>
              <th className="p-4">Servicio</th><th className="p-4">Cita</th><th className="p-4">Estado</th>
            </tr></thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-white/10 align-top">
                  <td className="p-4 font-mono text-amber-400">{order.number}</td>
                  <td className="p-4"><strong className="block">{order.client}</strong><span className="text-zinc-400">{order.phone}</span></td>
                  <td className="p-4">{order.vehicle}</td><td className="p-4">{order.service}</td>
                  <td className="p-4">{order.scheduledAt ? new Date(order.scheduledAt).toLocaleString("es-PA", { timeZone: "America/Panama" }) : "Sin fecha"}</td>
                  <td className="p-4">
                    <select
                      aria-label={`Estado de ${order.number}`}
                      value={order.status}
                      disabled={saving === order.id}
                      onChange={(event) => void changeStatus(order.id, event.target.value as OrderStatus)}
                      className="rounded-lg border border-white/15 bg-zinc-900 px-2 py-1 text-white disabled:opacity-50"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

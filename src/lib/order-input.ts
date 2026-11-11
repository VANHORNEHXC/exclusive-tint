import type { OrderStatus } from "@/lib/schema";

const statuses: OrderStatus[] = ["pending", "confirmed", "in_progress", "ready", "delivered", "cancelled"];
export interface OrderInput {
  client: string;
  phone: string;
  email: string | null;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number | null;
  service: string;
  shade: string | null;
  status: OrderStatus;
  scheduledAt: string | null;
  totalPrice: number;
  depositPaid: number;
  notes: string | null;
}

export function parseOrderInput(value: unknown): OrderInput {
  if (!value || typeof value !== "object") throw new Error("Datos inválidos");
  const body = value as Record<string, unknown>;
  function required(key: string, max: number): string {
    const text = body[key];
    if (typeof text !== "string" || !text.trim() || text.length > max) throw new Error(`Campo inválido: ${key}`);
    return text.trim();
  }
  function optional(key: string, max: number): string | null {
    const text = body[key];
    if (text === undefined || text === null || text === "") return null;
    if (typeof text !== "string" || text.length > max) throw new Error(`Campo inválido: ${key}`);
    return text.trim() || null;
  }
  const year = body.vehicleYear === "" || body.vehicleYear === null || body.vehicleYear === undefined ? null : Number(body.vehicleYear);
  if (year !== null && (!Number.isInteger(year) || year < 1900 || year > 2100)) throw new Error("Año inválido");
  const totalPrice = Number(body.totalPrice ?? 0);
  const depositPaid = Number(body.depositPaid ?? 0);
  if (!Number.isFinite(totalPrice) || !Number.isFinite(depositPaid) || totalPrice < 0 || depositPaid < 0 || totalPrice > 99999999 || depositPaid > totalPrice) throw new Error("Importe inválido");
  const status = body.status ?? "pending";
  if (!statuses.includes(status as OrderStatus)) throw new Error("Estado inválido");
  const date = optional("scheduledAt", 40);
  if (date && Number.isNaN(Date.parse(date))) throw new Error("Fecha inválida");
  return {
    client: required("client", 150), phone: required("phone", 50), email: optional("email", 150),
    vehicleMake: required("vehicleMake", 80), vehicleModel: required("vehicleModel", 80), vehicleYear: year,
    service: required("service", 100), shade: optional("shade", 100), status: status as OrderStatus,
    scheduledAt: date ? new Date(date).toISOString() : null,
    totalPrice, depositPaid, notes: optional("notes", 5000),
  };
}

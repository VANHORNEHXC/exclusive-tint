import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { updateOrderStatus } from "@/lib/schema";
import type { OrderStatus } from "@/lib/schema";

const statuses: OrderStatus[] = [
  "pending", "confirmed", "in_progress", "ready", "delivered", "cancelled",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body.status || !statuses.includes(body.status as OrderStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }
  try {
    const order = await updateOrderStatus(id, body.status as OrderStatus);
    if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("Could not update order status", error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}

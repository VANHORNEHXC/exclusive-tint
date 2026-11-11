import { NextRequest, NextResponse } from "next/server";
import { getAdmin, sameOrigin } from "@/lib/admin-auth";
import { parseOrderInput } from "@/lib/order-input";
import { sql } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  if (!await getAdmin(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  try {
    const data = parseOrderInput(await request.json());
    const [order] = await sql<Array<{ id: string }>>`
      UPDATE orders SET client_name = ${data.client}, client_phone = ${data.phone},
        client_email = ${data.email}, vehicle_make = ${data.vehicleMake},
        vehicle_model = ${data.vehicleModel}, vehicle_year = ${data.vehicleYear},
        service_type = ${data.service}, shade = ${data.shade}, status = ${data.status},
        scheduled_at = ${data.scheduledAt}, total_price = ${data.totalPrice},
        deposit_paid = ${data.depositPaid}, notes = ${data.notes}
      WHERE id = ${id} RETURNING id`;
    if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    return NextResponse.json({ id: order.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Orden inválida" }, { status: 400 });
  }
}

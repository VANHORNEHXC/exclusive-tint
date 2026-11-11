import { NextRequest, NextResponse } from "next/server";
import { getAdmin, sameOrigin } from "@/lib/admin-auth";
import { parseOrderInput } from "@/lib/order-input";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  if (!await getAdmin(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const data = parseOrderInput(await request.json());
    const [order] = await sql<Array<{ id: string }>>`
      INSERT INTO orders (order_number, client_name, client_phone, client_email, vehicle_make,
        vehicle_model, vehicle_year, service_type, shade, status, scheduled_at,
        total_price, deposit_paid, notes, source)
      VALUES (NULL, ${data.client}, ${data.phone}, ${data.email}, ${data.vehicleMake},
        ${data.vehicleModel}, ${data.vehicleYear}, ${data.service}, ${data.shade}, ${data.status},
        ${data.scheduledAt}, ${data.totalPrice}, ${data.depositPaid}, ${data.notes}, 'admin')
      RETURNING id`;
    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Orden inválida" }, { status: 400 });
  }
}

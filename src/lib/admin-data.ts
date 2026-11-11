import { sql } from "@/lib/db";
import { getOrders } from "@/lib/schema";

export function isDemoOrder(order: { order_number: string; client_name: string; client_phone: string }): boolean {
  return (order.order_number === "ET-1001" && order.client_name === "Carlos Mendoza" && order.client_phone === "+1 (829) 555-0192") ||
    (order.order_number === "ET-1002" && order.client_name === "Roberto Valenzuela" && order.client_phone === "+1 (809) 555-8371");
}

export async function getAdminOrders() {
  const orders = await getOrders({ limit: 200 });
  return orders.filter((order) => !isDemoOrder(order)).map((order) => ({
    id: order.id,
    number: order.order_number,
    client: order.client_name,
    phone: order.client_phone,
    email: order.client_email,
    vehicleMake: order.vehicle_make,
    vehicleModel: order.vehicle_model,
    vehicleYear: order.vehicle_year,
    service: order.service_type,
    shade: order.shade,
    status: order.status,
    scheduledAt: order.scheduled_at?.toISOString() ?? null,
    totalPrice: Number(order.total_price),
    depositPaid: Number(order.deposit_paid),
    notes: order.notes,
    source: order.source,
    createdAt: order.created_at.toISOString(),
  }));
}

export async function getAnalytics() {
  const excluded = sql`NOT ((order_number = 'ET-1001' AND client_name = 'Carlos Mendoza' AND client_phone = '+1 (829) 555-0192') OR (order_number = 'ET-1002' AND client_name = 'Roberto Valenzuela' AND client_phone = '+1 (809) 555-8371'))`;
  const [orderRows, eventRows] = await Promise.all([
    sql<Array<{ status: string; count: number; value: number }>>`
      SELECT status, COUNT(*)::int AS count, COALESCE(SUM(total_price), 0)::float8 AS value
      FROM orders WHERE ${excluded} GROUP BY status`,
    sql<Array<{ day: string; page_views: number; whatsapp_clicks: number }>>`
      SELECT to_char(created_at AT TIME ZONE 'America/Panama', 'YYYY-MM-DD') AS day,
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(*) FILTER (WHERE event_type = 'whatsapp_click')::int AS whatsapp_clicks
      FROM site_events WHERE created_at >= now() - interval '30 days'
      GROUP BY 1 ORDER BY 1`,
  ]);
  const totalOrders = orderRows.reduce((sum, row) => sum + row.count, 0);
  return {
    totalOrders,
    activeOrders: orderRows.filter((row) => ["pending", "confirmed", "in_progress", "ready"].includes(row.status)).reduce((sum, row) => sum + row.count, 0),
    deliveredValue: orderRows.find((row) => row.status === "delivered")?.value ?? 0,
    byStatus: orderRows,
    daily: eventRows,
    pageViews: eventRows.reduce((sum, row) => sum + row.page_views, 0),
    whatsappClicks: eventRows.reduce((sum, row) => sum + row.whatsapp_clicks, 0),
  };
}

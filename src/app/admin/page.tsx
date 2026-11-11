import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { headers } from "next/headers";
import { getOrders } from "@/lib/schema";
import { AdminOrders } from "@/components/admin-orders";
import { isAdminAuthorized } from "@/lib/admin-auth";

async function OrderList() {
  await connection();
  if (!isAdminAuthorized((await headers()).get("authorization"))) {
    return <p className="text-red-300">Acceso restringido.</p>;
  }
  if (!process.env.DATABASE_URL_POOLED && !process.env.DATABASE_URL) {
    return <p className="text-amber-300">La base de datos no está configurada.</p>;
  }

  let orders: Awaited<ReturnType<typeof getOrders>>;
  try {
    orders = (await getOrders({ limit: 100 })).filter((order) => {
      // These two rows were inserted by the old migration as fictional examples.
      const oldDemoOrder =
        (order.order_number === "ET-1001" &&
          order.client_name === "Carlos Mendoza" &&
          order.client_phone === "+1 (829) 555-0192") ||
        (order.order_number === "ET-1002" &&
          order.client_name === "Roberto Valenzuela" &&
          order.client_phone === "+1 (809) 555-8371");
      return !oldDemoOrder;
    });
  } catch (error) {
    console.error("Could not load admin orders", error);
    return <p className="text-red-300">No se pudieron cargar las órdenes. Revisa la conexión y ejecuta la migración.</p>;
  }

  return (
    <AdminOrders
      initialOrders={orders.map((order) => ({
          id: order.id,
          number: order.order_number,
          client: order.client_name,
          phone: order.client_phone,
          vehicle: [order.vehicle_make, order.vehicle_model, order.vehicle_year].filter(Boolean).join(" "),
          service: order.service_type,
          status: order.status,
          scheduledAt: order.scheduled_at?.toISOString() ?? null,
      }))}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Exclusive Tint</p>
            <h1 className="mt-2 text-3xl font-bold">Órdenes y citas</h1>
          </div>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">Volver al sitio</Link>
        </header>
        <Suspense fallback={<p className="text-zinc-400">Cargando órdenes...</p>}>
          <OrderList />
        </Suspense>
      </div>
    </main>
  );
}

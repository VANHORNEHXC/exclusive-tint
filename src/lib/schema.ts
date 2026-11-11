import { sql } from "./db";

// ========================================================
// Tipos TypeScript para órdenes y reviews
// ========================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "ready"
  | "delivered"
  | "cancelled";

export type OrderSource =
  | "web"
  | "whatsapp_bot"
  | "phone"
  | "in_person"
  | "admin";

export interface Order {
  id: string;
  order_number: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number | null;
  vehicle_color: string | null;
  service_type: string;
  shade: string | null;
  status: OrderStatus;
  scheduled_at: Date | null;
  total_price: number;
  deposit_paid: number;
  notes: string | null;
  source: OrderSource;
  technician_assigned: string | null;
  created_at: Date;
  updated_at: Date;
}

export type NewOrder = Omit<
  Order,
  "id" | "order_number" | "created_at" | "updated_at"
> & {
  order_number?: string;
};

export interface Review {
  id: string;
  order_id: string | null;
  client_name: string;
  rating: number;
  comment: string;
  vehicle_info: string | null;
  service_rendered: string | null;
  photos: string[];
  is_verified: boolean;
  is_approved: boolean;
  likes: number;
  created_at: Date;
  updated_at: Date;
}

export type NewReview = Omit<
  Review,
  "id" | "likes" | "created_at" | "updated_at"
> & {
  is_verified?: boolean;
  is_approved?: boolean;
  photos?: string[];
};

export interface ReviewStats {
  total: number;
  averageRating: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ========================================================
// Helpers para Órdenes (Orders)
// ========================================================

/**
 * Crea una nueva orden o cita en Neon DB.
 */
export async function createOrder(data: NewOrder): Promise<Order> {
  const [created] = await sql<Order[]>`
    INSERT INTO orders (
      order_number,
      client_name,
      client_phone,
      client_email,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_color,
      service_type,
      shade,
      status,
      scheduled_at,
      total_price,
      deposit_paid,
      notes,
      source,
      technician_assigned
    ) VALUES (
      ${data.order_number || null},
      ${data.client_name},
      ${data.client_phone},
      ${data.client_email || null},
      ${data.vehicle_make},
      ${data.vehicle_model},
      ${data.vehicle_year || null},
      ${data.vehicle_color || null},
      ${data.service_type},
      ${data.shade || null},
      ${data.status || "pending"},
      ${data.scheduled_at ? new Date(data.scheduled_at).toISOString() : null},
      ${data.total_price || 0},
      ${data.deposit_paid || 0},
      ${data.notes || null},
      ${data.source || "web"},
      ${data.technician_assigned || null}
    )
    RETURNING *
  `;
  return created;
}

/**
 * Obtiene órdenes con filtros opcionales (por estado o límite).
 */
export async function getOrders(options?: {
  status?: OrderStatus;
  limit?: number;
}): Promise<Order[]> {
  const limit = options?.limit ?? 50;

  if (options?.status) {
    return await sql<Order[]>`
      SELECT * FROM orders
      WHERE status = ${options.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
  }

  return await sql<Order[]>`
    SELECT * FROM orders
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

/**
 * Busca una orden por su UUID.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const [order] = await sql<Order[]>`
    SELECT * FROM orders
    WHERE id = ${id}
    LIMIT 1
  `;
  return order || null;
}

/**
 * Busca una orden por su número visible (ej: 'ET-1001').
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const [order] = await sql<Order[]>`
    SELECT * FROM orders
    WHERE order_number = ${orderNumber}
    LIMIT 1
  `;
  return order || null;
}

/**
 * Actualiza el estado de una orden.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const [updated] = await sql<Order[]>`
    UPDATE orders
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  `;
  return updated || null;
}

// ========================================================
// Helpers para Valoraciones (Reviews)
// ========================================================

/**
 * Registra una nueva reseña de cliente.
 */
export async function createReview(data: NewReview): Promise<Review> {
  const [created] = await sql<Review[]>`
    INSERT INTO reviews (
      order_id,
      client_name,
      rating,
      comment,
      vehicle_info,
      service_rendered,
      photos,
      is_verified,
      is_approved
    ) VALUES (
      ${data.order_id || null},
      ${data.client_name},
      ${data.rating},
      ${data.comment},
      ${data.vehicle_info || null},
      ${data.service_rendered || null},
      ${data.photos || []},
      ${data.is_verified ?? false},
      ${data.is_approved ?? true}
    )
    RETURNING *
  `;
  return created;
}

/**
 * Obtiene las reseñas aprobadas para mostrar en la web pública.
 */
export async function getApprovedReviews(limit = 20): Promise<Review[]> {
  const reviews = await sql<Review[]>`
    SELECT * FROM reviews
    WHERE is_approved = true
    ORDER BY created_at DESC
    LIMIT ${Math.min(Math.max(limit, 1) + 3, 103)}
  `;
  // Earlier migrations inserted three fictional reviews. Do not publish them.
  const demoPrefixes: Record<string, string> = {
    "Roberto Valenzuela": "La diferencia térmica con el Nano-Ceramic en el M3 es increíble.",
    "Valeria Gómez": "Excelente atención en Exclusive Tint. Me asesoraron con el porcentaje legal para mi Macan",
    "Alejandro Peña": "Polaricé mi camioneta completa incluyendo el panorámico en 70%",
  };
  return reviews.filter((review) => {
    const prefix = demoPrefixes[review.client_name];
    return !prefix || !review.comment.startsWith(prefix);
  }).slice(0, limit);
}

/**
 * Calcula estadísticas de satisfacción (promedio y desglose por estrellas).
 */
export async function getReviewStats(): Promise<ReviewStats> {
  const rows = await sql<Array<{ rating: number; count: string }>>`
    SELECT rating, COUNT(*)::text as count
    FROM reviews
    WHERE is_approved = true
    GROUP BY rating
  `;

  let total = 0;
  let sum = 0;
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const row of rows) {
    const count = parseInt(row.count, 10);
    const r = row.rating as 1 | 2 | 3 | 4 | 5;
    if (ratingCounts[r] !== undefined) {
      ratingCounts[r] = count;
    }
    total += count;
    sum += row.rating * count;
  }

  const averageRating = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

  return {
    total,
    averageRating,
    ratingCounts,
  };
}

/**
 * Incrementa el contador de "likes" de una reseña.
 */
export async function likeReview(id: string): Promise<Review | null> {
  const [updated] = await sql<Review[]>`
    UPDATE reviews
    SET likes = likes + 1
    WHERE id = ${id}
    RETURNING *
  `;
  return updated || null;
}

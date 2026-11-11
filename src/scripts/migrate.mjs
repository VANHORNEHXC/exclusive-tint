import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL_POOLED ||
  process.env.DATABASE_URL ||
  "";

if (!connectionString) {
  console.error("❌ [Migration] Error: DATABASE_URL o DATABASE_URL_POOLED no está definida.");
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: "require",
  max: 1,
});

async function runMigration() {
  console.log("🚀 [Migration] Conectando a Neon PostgreSQL...");

  try {
    // 1. Extensión pgcrypto
    console.log("  📦 Verificando extensión pgcrypto...");
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;

    // 2. Secuencia para números de orden
    console.log("  🔢 Creando secuencia de números de orden (order_number_seq)...");
    await sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001 INCREMENT BY 1;`;

    // 3. Tabla orders
    console.log("  📋 Creando tabla orders (órdenes y citas)...");
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_number VARCHAR(30) UNIQUE NOT NULL,
        client_name VARCHAR(150) NOT NULL,
        client_phone VARCHAR(50) NOT NULL,
        client_email VARCHAR(150),
        vehicle_make VARCHAR(80) NOT NULL,
        vehicle_model VARCHAR(80) NOT NULL,
        vehicle_year INTEGER,
        vehicle_color VARCHAR(50),
        service_type VARCHAR(100) NOT NULL,
        shade VARCHAR(100),
        status VARCHAR(40) NOT NULL DEFAULT 'pending',
        scheduled_at TIMESTAMPTZ,
        total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        deposit_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        notes TEXT,
        source VARCHAR(50) NOT NULL DEFAULT 'web',
        technician_assigned VARCHAR(100),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    // Índices de orders
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_client_phone ON orders (client_phone);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_scheduled_at ON orders (scheduled_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);`;

    // 4. Tabla reviews
    console.log("  ⭐ Creando tabla reviews (reseñas y valoraciones)...");
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
        client_name VARCHAR(150) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        vehicle_info VARCHAR(150),
        service_rendered VARCHAR(150),
        photos TEXT[] DEFAULT '{}',
        is_verified BOOLEAN NOT NULL DEFAULT false,
        is_approved BOOLEAN NOT NULL DEFAULT true,
        likes INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    // Índices de reviews
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews (is_approved);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews (order_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);`;

    // 5. Triggers de actualización y secuencia
    console.log("  ⚙️ Configurando triggers automáticos...");
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await sql`DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;`;
    await sql`
      CREATE TRIGGER trg_orders_updated_at
        BEFORE UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    await sql`DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews;`;
    await sql`
      CREATE TRIGGER trg_reviews_updated_at
        BEFORE UPDATE ON reviews
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    await sql`
      CREATE OR REPLACE FUNCTION generate_order_number()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
          NEW.order_number = 'ET-' || nextval('order_number_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await sql`DROP TRIGGER IF EXISTS trg_orders_number ON orders;`;
    await sql`
      CREATE TRIGGER trg_orders_number
        BEFORE INSERT ON orders
        FOR EACH ROW
        EXECUTE FUNCTION generate_order_number();
    `;

    // Existing databases may already contain ET numbers from earlier imports.
    await sql`
      SELECT setval(
        'order_number_seq',
        GREATEST(
          1001,
          (SELECT last_value + CASE WHEN is_called THEN 1 ELSE 0 END FROM order_number_seq),
          COALESCE(
            (SELECT MAX(SUBSTRING(order_number FROM 4)::BIGINT) + 1
             FROM orders WHERE order_number ~ '^ET-[0-9]+$'),
            1001
          )
        ),
        false
      )
    `;

    console.log("✅ [Migration] Esquema, tablas, índices y triggers creados exitosamente en Neon PostgreSQL.");
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ [Migration] Error ejecutando la migración:", error);
    await sql.end();
    process.exit(1);
  }
}

runMigration();

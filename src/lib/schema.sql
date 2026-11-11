-- ========================================================
-- Exclusive Tint - Esquema Inicial de Base de Datos en Neon
-- Tablas: orders (órdenes de trabajo / citas) y reviews (valoraciones de clientes)
-- ========================================================

-- Extensión para generación de UUIDs nativos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Secuencia para numeración legible de órdenes (ej: ET-1001, ET-1002...)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1001 INCREMENT BY 1;

-- ========================================================
-- TABLA: orders (Órdenes y Citas de Instalación)
-- ========================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  client_name VARCHAR(150) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  client_email VARCHAR(150),
  
  -- Información del vehículo
  vehicle_make VARCHAR(80) NOT NULL,        -- ej: Tesla, BMW, Porsche, Honda
  vehicle_model VARCHAR(80) NOT NULL,       -- ej: Model Y, M3, Macan GTS, Civic
  vehicle_year INTEGER,                     -- ej: 2024
  vehicle_color VARCHAR(50),                -- ej: Negro Mate, Blanco Perlado
  
  -- Servicio y especificación
  service_type VARCHAR(100) NOT NULL,       -- ej: 'Nano-Ceramic IR', 'Carbon Series', 'PPF Full Front', 'Ceramic Coating 9H'
  shade VARCHAR(100),                       -- ej: '20% laterales / 70% parabrisas'
  
  -- Estado y planificación
  status VARCHAR(40) NOT NULL DEFAULT 'pending', 
  -- Valores permitidos para status:
  -- 'pending'        : Solicitud entrante (WhatsApp bot o web)
  -- 'confirmed'      : Cita confirmada con fecha y hora
  -- 'in_progress'    : Vehículo en bahía de instalación
  -- 'ready'          : Trabajo terminado, listo para retiro
  -- 'delivered'      : Vehículo entregado al cliente
  -- 'cancelled'      : Cancelado
  
  scheduled_at TIMESTAMPTZ,                 -- Fecha y hora de la cita programada
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  deposit_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  
  -- Origen y notas
  notes TEXT,                               -- Notas del cliente o del bot nocturno
  source VARCHAR(50) NOT NULL DEFAULT 'web',-- 'web', 'whatsapp_bot', 'phone', 'in_person', 'admin'
  technician_assigned VARCHAR(100),         -- Instalador asignado
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de alto rendimiento para orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_client_phone ON orders (client_phone);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_at ON orders (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- ========================================================
-- TABLA: reviews (Valoraciones y Reseñas de Clientes)
-- ========================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  client_name VARCHAR(150) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  
  -- Contexto visible en el review
  vehicle_info VARCHAR(150),                -- ej: 'Tesla Model Y 2024'
  service_rendered VARCHAR(150),            -- ej: 'Nano-Ceramic IR 20%'
  
  -- Fotos del trabajo terminadas alojadas en Neon Buckets (S3)
  photos TEXT[] DEFAULT '{}',
  
  -- Moderación y verificación
  is_verified BOOLEAN NOT NULL DEFAULT false, -- True si proviene de una orden confirmada/entregada
  is_approved BOOLEAN NOT NULL DEFAULT true,  -- True para mostrar públicamente en la landing
  likes INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de alto rendimiento para reviews
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews (is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews (order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- ========================================================
-- TRIGGERS: Actualización automática de updated_at y order_number
-- ========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON reviews;
CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generador automático de order_number si no se especifica
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = 'ET-' || nextval('order_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_number ON orders;
CREATE TRIGGER trg_orders_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

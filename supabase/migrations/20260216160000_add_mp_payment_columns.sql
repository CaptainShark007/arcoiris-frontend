-- Agregar columnas de Mercado Pago a la tabla orders
ALTER TABLE "public"."orders"
  ADD COLUMN IF NOT EXISTS "mp_preference_id" text,
  ADD COLUMN IF NOT EXISTS "payment_id" text,
  ADD COLUMN IF NOT EXISTS "payment_status" text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "payment_method" text;

-- Índice para buscar órdenes por preference_id (usado por el webhook)
CREATE INDEX IF NOT EXISTS idx_orders_mp_preference_id ON "public"."orders" ("mp_preference_id");

-- Índice para buscar órdenes por payment_id
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON "public"."orders" ("payment_id");

ALTER TABLE public.orders
  ALTER COLUMN address_id DROP NOT NULL;

ALTER TABLE public.orders
  ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS sale_channel text NOT NULL DEFAULT 'online';

ALTER TABLE public.orders
  ADD CONSTRAINT orders_sale_channel_check
  CHECK (sale_channel IN ('online', 'pos'));
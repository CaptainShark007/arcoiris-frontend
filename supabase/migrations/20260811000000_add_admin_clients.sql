-- ============================================================
-- Tabla admin_clients: clientes administrativos (sin acceso al sistema)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  is_active boolean DEFAULT true
);

-- ============================================================
-- FK en orders: permitir vincular una orden POS a un admin_client
-- ============================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS admin_client_id uuid REFERENCES public.admin_clients(id) ON DELETE SET NULL;

-- ============================================================
-- RLS: solo admins pueden gestionar admin_clients
-- ============================================================
ALTER TABLE public.admin_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage admin_clients"
  ON public.admin_clients
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Índice para búsquedas frecuentes en POS
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_admin_clients_search
  ON public.admin_clients USING gin (
    to_tsvector('spanish', coalesce(full_name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(phone, ''))
  );

CREATE INDEX IF NOT EXISTS idx_admin_clients_active
  ON public.admin_clients (is_active) WHERE is_active = true;

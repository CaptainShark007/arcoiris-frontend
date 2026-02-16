-- 1. Insertar Categorías
INSERT INTO public.categories (name, slug, description, display_order)
VALUES 
('Living', 'living', 'Muebles para el salón y estar', 1),
('Dormitorio', 'dormitorio', 'Camas, mesas de luz y roperos', 2),
('Oficina', 'oficina', 'Escritorios y sillas ergonómicas', 3)
ON CONFLICT (name) DO NOTHING;

-- 2. Insertar un Producto de ejemplo
INSERT INTO public.products (id, name, brand, slug, features, description, images, category_id)
VALUES 
(
  'aa96225a-4952-4547-9694-132719602051', 
  'Mesa de Centro Nórdica', 
  'GR Muebles', 
  'mesa-centro-nordica', 
  ARRAY['Madera maciza', 'Patas de hierro', 'Fácil armado'], 
  '{"short_description": "Una mesa elegante para tu living", "material": "Pino Elliottis"}'::jsonb,
  ARRAY['https://picsum.photos/400'], 
  (SELECT id FROM public.categories WHERE slug = 'living')
)
ON CONFLICT DO NOTHING;

-- 3. Insertar Variantes para ese producto
INSERT INTO public.variants (product_id, color, color_name, price, stock, storage, finish, original_price)
VALUES 
('aa96225a-4952-4547-9694-132719602051', '#FFFFFF', 'Blanco Nieve', 25000, 10, 'N/A', 'Satinado', 30000),
('aa96225a-4952-4547-9694-132719602051', '#000000', 'Negro Mate', 27000, 5, 'N/A', 'Mate', 32000)
ON CONFLICT DO NOTHING;

-- 4. Crear un rol de Admin para pruebas (opcional)
-- Nota: Asegúrate de que el user_id exista en auth.users si vas a probar login
-- INSERT INTO public.user_roles (user_id, role) VALUES ('TU_UUID_DE_AUTH', 'admin');

-- 1. Crear el bucket de imágenes de productos si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar que cualquier usuario (incluso anónimo) pueda ver las fotos
CREATE POLICY "Visualización pública de imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Permitir que usuarios autenticados suban imágenes
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 4. Permitir que usuarios autenticados borren/editen imágenes
CREATE POLICY "Usuarios autenticados pueden editar o borrar"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'product-images');
WITH inserted_products AS (
  INSERT INTO public.products (id, name, brand, slug, features, description, images, is_active, is_deleted)
  VALUES
    (gen_random_uuid(), 'Pintura 23', 'Marca A', 'pintura-23', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 24', 'Marca A', 'pintura-24', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 25', 'Marca B', 'pintura-25', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 26', 'Marca B', 'pintura-26', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 27', 'Marca C', 'pintura-27', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 28', 'Marca C', 'pintura-28', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 29', 'Marca A', 'pintura-29', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 30', 'Marca A', 'pintura-30', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 31', 'Marca B', 'pintura-31', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 32', 'Marca B', 'pintura-32', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 33', 'Marca C', 'pintura-33', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 34', 'Marca C', 'pintura-34', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 35', 'Marca A', 'pintura-35', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 36', 'Marca A', 'pintura-36', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 37', 'Marca B', 'pintura-37', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false),
    (gen_random_uuid(), 'Pintura 38', 'Marca B', 'pintura-38', ARRAY['Feature 1'], '{}', ARRAY[]::text[], true, false)
  RETURNING id
)
INSERT INTO public.variants (product_id, price, stock, is_active)
SELECT id, 1500.00, 20, true
FROM inserted_products;
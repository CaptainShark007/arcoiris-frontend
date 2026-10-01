CREATE OR REPLACE FUNCTION public.update_product_with_variants(
  p_product_id uuid,
  p_name varchar,
  p_brand varchar,
  p_slug varchar,
  p_category_id uuid,
  p_features text[],
  p_description jsonb,
  p_images text[],
  p_variants jsonb
)
RETURNS TABLE(product_id uuid, success boolean, message text)
LANGUAGE plpgsql
AS $$
DECLARE
  v_variant jsonb;
  v_variant_id uuid;
  v_existing_variant_ids uuid[] := ARRAY[]::uuid[];
  v_new_variant_ids uuid[] := ARRAY[]::uuid[];
  v_current_variant_id uuid;
BEGIN
  IF p_product_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.products WHERE id = p_product_id
  ) THEN
    RETURN QUERY SELECT NULL::uuid, false, 'El producto no existe'::text;
    RETURN;
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RETURN QUERY SELECT NULL::uuid, false, 'El nombre del producto es requerido'::text;
    RETURN;
  END IF;

  IF p_slug IS NULL OR btrim(p_slug) = '' THEN
    RETURN QUERY SELECT NULL::uuid, false, 'El slug del producto es requerido'::text;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.products
    WHERE slug = p_slug AND id <> p_product_id AND is_deleted = false
  ) THEN
    RETURN QUERY SELECT NULL::uuid, false, 'El slug ya está siendo utilizado'::text;
    RETURN;
  END IF;

  IF p_images IS NULL OR array_length(p_images, 1) = 0 THEN
    RETURN QUERY SELECT NULL::uuid, false, 'Al menos una imagen es requerida'::text;
    RETURN;
  END IF;

  IF p_variants IS NULL OR jsonb_array_length(p_variants) = 0 THEN
    RETURN QUERY SELECT NULL::uuid, false, 'Al menos una variante es requerida'::text;
    RETURN;
  END IF;

  UPDATE public.products
  SET name = p_name,
      brand = p_brand,
      slug = p_slug,
      category_id = p_category_id,
      features = p_features,
      description = p_description,
      images = p_images
  WHERE id = p_product_id;

  FOR v_variant IN SELECT * FROM jsonb_array_elements(p_variants)
  LOOP
    v_variant_id := NULLIF(v_variant->>'id', '')::uuid;

    IF v_variant_id IS NOT NULL THEN
      UPDATE public.variants AS variant_row
      SET stock = (v_variant->>'stock')::integer,
          price = (v_variant->>'price')::decimal,
          original_price = (v_variant->>'original_price')::decimal,
          storage = v_variant->>'storage',
          color = v_variant->>'color',
          color_name = v_variant->>'color_name',
          finish = v_variant->>'finish',
          barcode = NULLIF(regexp_replace(coalesce(v_variant->>'barcode', ''), '[^0-9]', '', 'g'), ''),
          is_active = true
      WHERE variant_row.id = v_variant_id
        AND variant_row.product_id = p_product_id;
      v_existing_variant_ids := array_append(v_existing_variant_ids, v_variant_id);
    ELSE
      INSERT INTO public.variants (
        product_id, stock, price, original_price, storage, color,
        color_name, finish, barcode, is_active
      )
      VALUES (
        p_product_id,
        (v_variant->>'stock')::integer,
        (v_variant->>'price')::decimal,
        (v_variant->>'original_price')::decimal,
        v_variant->>'storage',
        v_variant->>'color',
        v_variant->>'color_name',
        v_variant->>'finish',
        NULLIF(regexp_replace(coalesce(v_variant->>'barcode', ''), '[^0-9]', '', 'g'), ''),
        true
      )
      RETURNING id INTO v_current_variant_id;
      v_new_variant_ids := array_append(v_new_variant_ids, v_current_variant_id);
    END IF;
  END LOOP;

  UPDATE public.variants AS variant_row
  SET is_active = false
  WHERE variant_row.product_id = p_product_id
    AND variant_row.id NOT IN (
      SELECT unnest(v_existing_variant_ids || v_new_variant_ids)
    );

  RETURN QUERY SELECT p_product_id, true, 'Producto actualizado exitosamente'::text;
EXCEPTION
  WHEN unique_violation THEN
    RETURN QUERY SELECT NULL::uuid, false, 'El código de barras ya está asignado a otra variante'::text;
  WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::uuid, false, SQLERRM;
END;
$$;

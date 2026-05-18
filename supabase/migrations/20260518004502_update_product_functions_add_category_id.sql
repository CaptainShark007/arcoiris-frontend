-- Eliminar versiones anteriores por las dudas (idempotente)
DROP FUNCTION IF EXISTS create_product_with_variants(
  VARCHAR, VARCHAR, VARCHAR, TEXT[], JSONB, JSONB
);

DROP FUNCTION IF EXISTS update_product_with_variants(
  UUID, VARCHAR, VARCHAR, VARCHAR, TEXT[], JSONB, TEXT[], JSONB
);

-- Crear versiones nuevas con category_id
CREATE OR REPLACE FUNCTION create_product_with_variants(
  p_name VARCHAR,
  p_brand VARCHAR,
  p_slug VARCHAR,
  p_category_id UUID,
  p_features TEXT[],
  p_description JSONB,
  p_variants JSONB
)
RETURNS TABLE(product_id UUID, success BOOLEAN, message TEXT) AS $$
DECLARE
  v_product_id UUID;
  v_variant JSONB;
  v_final_slug TEXT;
  v_counter INTEGER := 1;
BEGIN
  BEGIN
    IF p_name IS NULL OR p_name = '' THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El nombre del producto es requerido'::TEXT;
      RETURN;
    END IF;

    IF p_slug IS NULL OR p_slug = '' THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El slug del producto es requerido'::TEXT;
      RETURN;
    END IF;

    v_final_slug := p_slug;

    WHILE EXISTS (SELECT 1 FROM products WHERE slug = v_final_slug AND is_deleted = false) LOOP
      v_final_slug := p_slug || '-' || v_counter;
      v_counter := v_counter + 1;
    END LOOP;

    INSERT INTO products (name, brand, slug, category_id, features, description, images)
    VALUES (p_name, p_brand, v_final_slug, p_category_id, p_features, p_description, '{}'::TEXT[])
    RETURNING id INTO v_product_id;

    FOR v_variant IN SELECT * FROM jsonb_array_elements(p_variants)
    LOOP
      INSERT INTO variants (product_id, stock, price, original_price, storage, color, color_name, finish, is_active)
      VALUES (
        v_product_id,
        (v_variant->>'stock')::INTEGER,
        (v_variant->>'price')::DECIMAL,
        (v_variant->>'original_price')::DECIMAL,
        v_variant->>'storage',
        v_variant->>'color',
        v_variant->>'color_name',
        v_variant->>'finish',
        true
      );
    END LOOP;

    RETURN QUERY SELECT v_product_id, TRUE, 'Producto creado exitosamente'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_product_with_variants(
  p_product_id UUID,
  p_name VARCHAR,
  p_brand VARCHAR,
  p_slug VARCHAR,
  p_category_id UUID,
  p_features TEXT[],
  p_description JSONB,
  p_images TEXT[],
  p_variants JSONB
)
RETURNS TABLE(product_id UUID, success BOOLEAN, message TEXT) AS $$
DECLARE
  v_variant JSONB;
  v_variant_id UUID;
  v_existing_variant_ids UUID[];
  v_new_variant_ids UUID[];
  v_current_variant_id UUID;
BEGIN
  BEGIN
    IF p_product_id IS NULL THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El ID del producto es requerido'::TEXT;
      RETURN;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM products WHERE id = p_product_id) THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El producto no existe'::TEXT;
      RETURN;
    END IF;

    IF p_name IS NULL OR p_name = '' THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El nombre del producto es requerido'::TEXT;
      RETURN;
    END IF;

    IF p_slug IS NULL OR p_slug = '' THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El slug del producto es requerido'::TEXT;
      RETURN;
    END IF;

    IF EXISTS(SELECT 1 FROM products WHERE slug = p_slug AND id != p_product_id AND is_deleted = false) THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'El slug ya está siendo utilizado'::TEXT;
      RETURN;
    END IF;

    IF p_images IS NULL OR array_length(p_images, 1) = 0 THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'Al menos una imagen es requerida'::TEXT;
      RETURN;
    END IF;

    IF p_variants IS NULL OR jsonb_array_length(p_variants) = 0 THEN
      RETURN QUERY SELECT NULL::UUID, FALSE, 'Al menos una variante es requerida'::TEXT;
      RETURN;
    END IF;

    UPDATE products
    SET
      name        = p_name,
      brand       = p_brand,
      slug        = p_slug,
      category_id = p_category_id,
      features    = p_features,
      description = p_description,
      images      = p_images
    WHERE id = p_product_id;

    v_existing_variant_ids := ARRAY[]::UUID[];
    v_new_variant_ids      := ARRAY[]::UUID[];

    FOR v_variant IN SELECT * FROM jsonb_array_elements(p_variants)
    LOOP
      v_variant_id := (v_variant->>'id')::UUID;

      IF v_variant_id IS NOT NULL THEN
        UPDATE variants v
        SET
          stock          = (v_variant->>'stock')::INTEGER,
          price          = (v_variant->>'price')::DECIMAL,
          original_price = (v_variant->>'original_price')::DECIMAL,
          storage        = v_variant->>'storage',
          color          = v_variant->>'color',
          color_name     = v_variant->>'color_name',
          finish         = v_variant->>'finish',
          is_active      = true
        WHERE v.id = v_variant_id
          AND v.product_id = p_product_id;

        v_existing_variant_ids := array_append(v_existing_variant_ids, v_variant_id);
      ELSE
        INSERT INTO variants AS v (product_id, stock, price, original_price, storage, color, color_name, finish, is_active)
        VALUES (
          p_product_id,
          (v_variant->>'stock')::INTEGER,
          (v_variant->>'price')::DECIMAL,
          (v_variant->>'original_price')::DECIMAL,
          v_variant->>'storage',
          v_variant->>'color',
          v_variant->>'color_name',
          v_variant->>'finish',
          true
        )
        RETURNING v.id INTO v_current_variant_id;

        v_new_variant_ids := array_append(v_new_variant_ids, v_current_variant_id);
      END IF;
    END LOOP;

    UPDATE variants v
    SET is_active = false
    WHERE v.product_id = p_product_id
      AND v.id NOT IN (
        SELECT UNNEST(v_existing_variant_ids || COALESCE(v_new_variant_ids, ARRAY[]::UUID[]))
      );

    RETURN QUERY SELECT p_product_id, TRUE, 'Producto actualizado exitosamente'::TEXT;

  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;
set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_product_with_variants(p_name character varying, p_brand character varying, p_slug character varying, p_features text[], p_description jsonb, p_variants jsonb)
 RETURNS TABLE(product_id uuid, success boolean, message text)
 LANGUAGE plpgsql
AS $function$DECLARE
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

    INSERT INTO products (name, brand, slug, features, description, images)
    VALUES (p_name, p_brand, v_final_slug, p_features, p_description, '{}'::TEXT[])
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_product_with_variants(p_product_id uuid, p_name character varying, p_brand character varying, p_slug character varying, p_features text[], p_description jsonb, p_images text[], p_variants jsonb)
 RETURNS TABLE(product_id uuid, success boolean, message text)
 LANGUAGE plpgsql
AS $function$DECLARE
  v_variant JSONB;
  v_variant_id UUID;
  v_existing_variant_ids UUID[];
  v_new_variant_ids UUID[];
  v_current_variant_id UUID;
BEGIN
  BEGIN
    -- ==================== VALIDACIONES ====================
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

    -- Validar que el slug sea único (excluir el producto actual y productos eliminados)
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

    -- ==================== ACTUALIZAR PRODUCTO ====================
    UPDATE products
    SET
      name = p_name,
      brand = p_brand,
      slug = p_slug,
      features = p_features,
      description = p_description,
      images = p_images
    WHERE id = p_product_id;

    -- ==================== GESTIONAR VARIANTES ====================
    -- Recopilar IDs de variantes existentes que se actualizarán
    v_existing_variant_ids := ARRAY[]::UUID[];
    v_new_variant_ids := ARRAY[]::UUID[];
    
    FOR v_variant IN SELECT * FROM jsonb_array_elements(p_variants)
    LOOP
      v_variant_id := (v_variant->>'id')::UUID;
      
      IF v_variant_id IS NOT NULL THEN
        -- ACTUALIZAR variante existente
        UPDATE variants v
        SET
          stock = (v_variant->>'stock')::INTEGER,
          price = (v_variant->>'price')::DECIMAL,
          original_price = (v_variant->>'original_price')::DECIMAL,
          storage = v_variant->>'storage',
          color = v_variant->>'color',
          color_name = v_variant->>'color_name',
          finish = v_variant->>'finish',
          is_active = true  -- <--- IMPORTANTE: Aseguramos que esté activa si se envía en el JSON
        WHERE v.id = v_variant_id
          AND v.product_id = p_product_id;

        v_existing_variant_ids := array_append(v_existing_variant_ids, v_variant_id);
      ELSE
        -- CREAR nueva variante
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
          true -- <--- Por defecto activa al crear
        )
        RETURNING v.id INTO v_current_variant_id;

        v_new_variant_ids := array_append(v_new_variant_ids, v_current_variant_id);
      END IF;
    END LOOP;

    -- ==================== "ELIMINAR" (DESACTIVAR) VARIANTES OBSOLETAS ====================
    -- En lugar de DELETE, hacemos UPDATE is_active = false
    UPDATE variants v
    SET is_active = false
    WHERE v.product_id = p_product_id
      AND v.id NOT IN (
        SELECT UNNEST(v_existing_variant_ids || COALESCE(v_new_variant_ids, ARRAY[]::UUID[]))
      );

    -- ==================== RETORNAR ÉXITO ====================
    RETURN QUERY SELECT p_product_id, TRUE, 'Producto actualizado exitosamente'::TEXT;

  EXCEPTION WHEN OTHERS THEN
    -- Rollback automático de la transacción completa
    RETURN QUERY SELECT NULL::UUID, FALSE, SQLERRM;
  END;
END;$function$
;



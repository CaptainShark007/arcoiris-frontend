


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_order_transaction"("p_user_id" "uuid", "p_user_email" "text", "p_user_full_name" "text", "p_address_line1" "text", "p_address_line2" "text", "p_city" "text", "p_postal_code" "text", "p_state" "text", "p_country" "text", "p_cart_items" "jsonb", "p_total_amount" numeric, "p_partner_code" "text" DEFAULT NULL::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_customer_id UUID;
  v_address_id UUID;
  v_order_id BIGINT;
  v_item JSONB;
  v_variant_id UUID;
  v_quantity INT;
  v_price DECIMAL;
  v_current_stock INT;
  
  -- Variables para el snapshot
  v_product_snapshot JSONB;
  v_product_name TEXT;
  v_product_brand TEXT;
  v_product_slug TEXT;
  v_product_image TEXT;
  v_variant_color TEXT;
  v_variant_storage TEXT;
  v_variant_finish TEXT;
  v_partner_id UUID := NULL;
  
  v_out_of_stock_items JSONB[] := ARRAY[]::JSONB[];
  v_missing_variants TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- 1. Obtener o crear customer
  SELECT id INTO v_customer_id FROM customers WHERE user_id = p_user_id;
  
  IF v_customer_id IS NULL THEN
    INSERT INTO customers (user_id, email, full_name)
    VALUES (p_user_id, p_user_email, p_user_full_name)
    RETURNING id INTO v_customer_id;
  END IF;

  -- 2. Validaciones (Omitidas para brevedad, se mantienen igual)
  
  -- 3. Validar stock (Se mantiene igual)
  FOR v_item IN SELECT jsonb_array_elements(p_cart_items) LOOP
    v_variant_id := (v_item->>'variantId')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    
    SELECT stock INTO v_current_stock FROM variants WHERE id = v_variant_id;
    
    IF v_current_stock < v_quantity THEN
      v_out_of_stock_items := array_append(v_out_of_stock_items, jsonb_build_object('variantId', v_variant_id, 'required', v_quantity, 'available', v_current_stock));
    END IF;
  END LOOP;
  
  IF array_length(v_out_of_stock_items, 1) > 0 THEN
    RAISE EXCEPTION 'Stock insuficiente: %', array_to_json(v_out_of_stock_items);
  END IF;

  -- 4. Guardar dirección (Se mantiene igual)
  INSERT INTO addresses (address_line1, address_line2, city, postal_code, state, country, customer_id)
  VALUES (p_address_line1, p_address_line2, p_city, p_postal_code, p_state, p_country, v_customer_id)
  RETURNING id INTO v_address_id;

  IF p_partner_code IS NOT NULL AND p_partner_code <> '' THEN
    SELECT id INTO v_partner_id 
    FROM public.partners 
    WHERE code = p_partner_code AND is_active = true;
  END IF;

  -- 5. Crear la orden (Se mantiene igual)
  INSERT INTO orders (customer_id, address_id, total_amount, status, partner_id)
  VALUES (v_customer_id, v_address_id, p_total_amount, 'pending', v_partner_id)
  RETURNING id INTO v_order_id;

  -- 6. Insertar items y SNAPSHOT
  FOR v_item IN SELECT jsonb_array_elements(p_cart_items) LOOP
    v_variant_id := (v_item->>'variantId')::UUID;
    v_quantity := (v_item->>'quantity')::INT;
    v_price := (v_item->>'price')::DECIMAL;
    
    -- A. Recuperar datos frescos (INCLUYENDO FINISH)
    SELECT 
      p.name, 
      p.brand, 
      p.slug, 
      p.images[1],
      v.color_name,
      v.storage,
      v.finish -- <--- 2. AGREGADO AL SELECT
    INTO 
      v_product_name, 
      v_product_brand, 
      v_product_slug, 
      v_product_image, 
      v_variant_color, 
      v_variant_storage,
      v_variant_finish -- <--- 2. AGREGADO AL INTO
    FROM variants v
    JOIN products p ON v.product_id = p.id
    WHERE v.id = v_variant_id;

    -- B. Construir el objeto JSON Snapshot
    v_product_snapshot := jsonb_build_object(
      'name', v_product_name,
      'brand', v_product_brand,
      'slug', v_product_slug,
      'image', v_product_image,
      'color', v_variant_color,
      'storage', v_variant_storage,
      'finish', v_variant_finish,
      'frozen_at', now()
    );

    -- C. Insertar item
    INSERT INTO order_items (order_id, variant_id, quantity, price, product_snapshot)
    VALUES (v_order_id, v_variant_id, v_quantity, v_price, v_product_snapshot);
    
    -- D. Actualizar stock
    UPDATE variants
    SET stock = stock - v_quantity
    WHERE id = v_variant_id;
    
  END LOOP;

  RETURN jsonb_build_object(
    'success', true, 
    'orderId', v_order_id,
    'customerId', v_customer_id,
    'addressId', v_address_id,
    'partnerId', v_partner_id,
    'message', 'Orden creada exitosamente'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE,
    'message', 'Error al crear la orden.'
  );
END;
$$;


ALTER FUNCTION "public"."create_order_transaction"("p_user_id" "uuid", "p_user_email" "text", "p_user_full_name" "text", "p_address_line1" "text", "p_address_line2" "text", "p_city" "text", "p_postal_code" "text", "p_state" "text", "p_country" "text", "p_cart_items" "jsonb", "p_total_amount" numeric, "p_partner_code" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_product_with_variants"("p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_variants" "jsonb") RETURNS TABLE("product_id" "uuid", "success" boolean, "message" "text")
    LANGUAGE "plpgsql"
    AS $$
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

    WHILE EXISTS (SELECT 1 FROM products WHERE slug = v_final_slug) LOOP
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
END;
$$;


ALTER FUNCTION "public"."create_product_with_variants"("p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_variants" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_product_cascade"("p_product_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- 1. Eliminar las variantes del producto
  delete from variants
  where product_id = p_product_id;

  -- 2. Eliminar el producto
  delete from products
  where id = p_product_id;
end;
$$;


ALTER FUNCTION "public"."delete_product_cascade"("p_product_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_with_variants"("p_product_id" "uuid", "p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_images" "text"[], "p_variants" "jsonb") RETURNS TABLE("product_id" "uuid", "success" boolean, "message" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
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

    -- Validar que el slug sea único (excluir el producto actual)
    IF EXISTS(SELECT 1 FROM products WHERE slug = p_slug AND id != p_product_id) THEN
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
END;
$$;


ALTER FUNCTION "public"."update_product_with_variants"("p_product_id" "uuid", "p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_images" "text"[], "p_variants" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid",
    "address_line1" "text" NOT NULL,
    "address_line2" "text",
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "country" "text" DEFAULT 'Argentina'::"text" NOT NULL,
    "postal_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "image" "text",
    "icon" "text",
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "phone" "text",
    "email" "text" NOT NULL
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "variant_id" "uuid" NOT NULL,
    "order_id" bigint NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric NOT NULL,
    "product_snapshot" "jsonb" NOT NULL
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "address_id" "uuid" NOT NULL,
    "total_amount" numeric NOT NULL,
    "status" "text" DEFAULT 'Pending'::"text" NOT NULL,
    "partner_id" "uuid"
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


ALTER TABLE "public"."orders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."partners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "user_id" "uuid",
    "commission_default" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "phone" "text",
    "email" "text",
    "address" "text",
    "schedule" "text",
    "map_url" "text"
);


ALTER TABLE "public"."partners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "brand" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "features" "text"[] NOT NULL,
    "description" "jsonb" NOT NULL,
    "images" "text"[] NOT NULL,
    "category_id" "uuid",
    "is_active" boolean DEFAULT true,
    "is_deleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "role" "text" NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


ALTER TABLE "public"."user_roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."variants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "color" "text",
    "storage" "text",
    "price" numeric NOT NULL,
    "stock" integer NOT NULL,
    "color_name" "text",
    "product_id" "uuid" NOT NULL,
    "finish" "text" DEFAULT 'Brillante'::"text",
    "is_active" boolean DEFAULT true NOT NULL,
    "original_price" numeric
);


ALTER TABLE "public"."variants" OWNER TO "postgres";


ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."partners"
    ADD CONSTRAINT "partners_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."partners"
    ADD CONSTRAINT "partners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."variants"
    ADD CONSTRAINT "variants_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_products_category_id" ON "public"."products" USING "btree" ("category_id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."partners"
    ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."variants"
    ADD CONSTRAINT "variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



CREATE POLICY "Allow all operations" ON "public"."categories" TO "authenticated" USING (true) WITH CHECK (("auth"."uid"() IN ( SELECT "user_roles"."user_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."role" = 'admin'::"text"))));



CREATE POLICY "Allow all operations" ON "public"."products" TO "authenticated" USING (true) WITH CHECK (("auth"."uid"() IN ( SELECT "user_roles"."user_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."role" = 'admin'::"text"))));



CREATE POLICY "Allow all operations for authenticaded users" ON "public"."customers" TO "authenticated" USING (true);



CREATE POLICY "Allow all operations for authenticaded users" ON "public"."order_items" USING (true);



CREATE POLICY "Allow all operations for users admin only" ON "public"."variants" USING (true) WITH CHECK (("auth"."uid"() IN ( SELECT "user_roles"."user_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."role" = 'admin'::"text"))));



CREATE POLICY "Allow all operations for users authenticaded" ON "public"."addresses" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow update stock for authenticaded users" ON "public"."variants" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow users to read their own role" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Enable Update for Admin users only" ON "public"."orders" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (("auth"."uid"() IN ( SELECT "user_roles"."user_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."role" = 'admin'::"text"))));



CREATE POLICY "Enable delete for authenticated users" ON "public"."partners" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticaded users" ON "public"."orders" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticaded users only" ON "public"."user_roles" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users" ON "public"."partners" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access authenticaded users" ON "public"."orders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."partners" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."variants" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users" ON "public"."partners" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."partners" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."variants" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."create_order_transaction"("p_user_id" "uuid", "p_user_email" "text", "p_user_full_name" "text", "p_address_line1" "text", "p_address_line2" "text", "p_city" "text", "p_postal_code" "text", "p_state" "text", "p_country" "text", "p_cart_items" "jsonb", "p_total_amount" numeric, "p_partner_code" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_order_transaction"("p_user_id" "uuid", "p_user_email" "text", "p_user_full_name" "text", "p_address_line1" "text", "p_address_line2" "text", "p_city" "text", "p_postal_code" "text", "p_state" "text", "p_country" "text", "p_cart_items" "jsonb", "p_total_amount" numeric, "p_partner_code" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_order_transaction"("p_user_id" "uuid", "p_user_email" "text", "p_user_full_name" "text", "p_address_line1" "text", "p_address_line2" "text", "p_city" "text", "p_postal_code" "text", "p_state" "text", "p_country" "text", "p_cart_items" "jsonb", "p_total_amount" numeric, "p_partner_code" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_product_with_variants"("p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_variants" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_product_with_variants"("p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_variants" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_product_with_variants"("p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_variants" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_product_cascade"("p_product_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_product_cascade"("p_product_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_product_cascade"("p_product_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_with_variants"("p_product_id" "uuid", "p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_images" "text"[], "p_variants" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_with_variants"("p_product_id" "uuid", "p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_images" "text"[], "p_variants" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_with_variants"("p_product_id" "uuid", "p_name" character varying, "p_brand" character varying, "p_slug" character varying, "p_features" "text"[], "p_description" "jsonb", "p_images" "text"[], "p_variants" "jsonb") TO "service_role";


















GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."partners" TO "anon";
GRANT ALL ON TABLE "public"."partners" TO "authenticated";
GRANT ALL ON TABLE "public"."partners" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."variants" TO "anon";
GRANT ALL ON TABLE "public"."variants" TO "authenticated";
GRANT ALL ON TABLE "public"."variants" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Allow all operations for ADMIN USER 16wiy3a_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))))));



  create policy "Allow all operations for ADMIN USER 16wiy3a_1"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))))));



  create policy "Allow all operations for ADMIN USER 16wiy3a_2"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))))));



  create policy "Allow all operations for ADMIN USER 16wiy3a_3"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'product-images'::text) AND (EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::text))))));




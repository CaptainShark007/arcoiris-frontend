CREATE OR REPLACE FUNCTION decrement_variant_stock(
  p_variant_id uuid,
  p_quantity integer
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE variants
  SET stock = stock - p_quantity
  WHERE id = p_variant_id AND stock >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stock insuficiente para la variante %', p_variant_id;
  END IF;
END;
$$;
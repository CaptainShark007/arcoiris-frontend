-- ============================================================
-- Corregir estado de ordenes creadas por conversion de presupuesto.
-- La funcion original usaba 'Pending' (con P mayuscula) que no
-- coincide con los valores del frontend ('pending', 'completed', etc.).
-- Un presupuesto convertido es una venta completada.
-- ============================================================

-- Actualizar ordenes existentes que quedaron con status 'Pending'
UPDATE public.orders
SET status = 'completed'
WHERE sale_channel = 'presupuesto'
  AND status = 'Pending';

-- Reemplazar la funcion para que futuras conversiones usen 'completed'
DROP FUNCTION IF EXISTS public.convert_budget_to_order(bigint, uuid);

CREATE FUNCTION public.convert_budget_to_order(
  p_budget_id bigint,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id bigint;
  v_budget public.budgets;
  v_item public.budget_items;
BEGIN
  SELECT * INTO v_budget
  FROM public.budgets
  WHERE id = p_budget_id
  FOR UPDATE;

  IF v_budget IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Presupuesto no encontrado');
  END IF;

  IF v_budget.status = 'converted' THEN
    RETURN jsonb_build_object('success', false, 'error', 'El presupuesto ya fue convertido');
  END IF;

  INSERT INTO public.orders (
    customer_id,
    address_id,
    admin_client_id,
    total_amount,
    status,
    sale_channel,
    payment_status,
    payment_method
  )
  VALUES (
    NULL,
    NULL,
    v_budget.admin_client_id,
    v_budget.total_amount,
    'completed',
    'presupuesto',
    'pending',
    'presupuesto'
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN
    SELECT * FROM public.budget_items WHERE budget_id = p_budget_id
  LOOP
    INSERT INTO public.order_items (
      order_id,
      variant_id,
      quantity,
      price,
      product_snapshot
    )
    VALUES (
      v_order_id,
      v_item.variant_id,
      v_item.quantity,
      v_item.price,
      v_item.product_snapshot
    );

    PERFORM public.decrement_variant_stock(v_item.variant_id, v_item.quantity);
  END LOOP;

  UPDATE public.budgets
  SET status = 'converted',
      converted_order_id = v_order_id
  WHERE id = p_budget_id;

  RETURN jsonb_build_object('success', true, 'orderId', v_order_id);
END;
$$;

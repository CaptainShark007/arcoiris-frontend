-- ============================================================
-- Funcion atomica para convertir un presupuesto en una orden de venta
-- Crea la orden + order_items, descuenta stock y marca el presupuesto
-- como convertido. Todo dentro de una transaccion.
-- ============================================================
CREATE OR REPLACE FUNCTION public.convert_budget_to_order(
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

  -- Crear la orden asociada al presupuesto
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
    'Pending',
    'presupuesto',
    'pending',
    'presupuesto'
  )
  RETURNING id INTO v_order_id;

  -- Volcar los items y descontar stock
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

  -- Marcar presupuesto como convertido
  UPDATE public.budgets
  SET status = 'converted',
      converted_order_id = v_order_id
  WHERE id = p_budget_id;

  RETURN jsonb_build_object('success', true, 'orderId', v_order_id);
END;
$$;

-- Permitir a los admins ejecutar la funcion
REVOKE ALL ON FUNCTION public.convert_budget_to_order(bigint, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.convert_budget_to_order(bigint, uuid) TO authenticated;

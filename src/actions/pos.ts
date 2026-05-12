import { supabase } from '@/supabase/client';

export interface PosProduct {
  id: string;
  name: string;
  image: string;
  hasVariants: boolean;  // true si tiene más de una variante activa con stock
  variants: PosVariant[];
}

export interface PosVariant {
  id: string;
  price: number;
  stock: number;
  color_name: string | null;
  storage: string | null;
  finish: string | null;
  color: string | null;
}

export interface CreatePosOrderInput {
  cartItems: {
    variantId: string;
    quantity: number;
    price: number;
    productSnapshot: {
      name: string;
      image: string;
      color: string | null;
      storage: string | null;
      finish: string | null;
    };
  }[];
  totalAmount: number;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
}

export const getPosProducts = async (
  search: string = '',
  categoryId: string | null = null
): Promise<PosProduct[]> => {
  let query = supabase
    .from('products')
    .select('id, name, images, variants!inner(id, price, stock, color_name, storage, finish, color)')
    .eq('is_active', true)
    .eq('is_deleted', false)
    .eq('variants.is_active', true)
    .gt('variants.stock', 0)
    .order('name', { ascending: true })
    .limit(50);

  if (search.trim().length >= 2) {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) throw new Error('Error al obtener productos para el POS');

  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.images?.[0] ?? '/assets/images/img-default.png',
    hasVariants: p.variants.length > 1,  // más de una variante = mostrar modal
    variants: p.variants,
  }));
};

// Registrar la venta del POS
export const createPosOrder = async (input: CreatePosOrderInput) => {
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData.user) {
    throw new Error('No autenticado');
  }

  // Insertar la orden
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: null,
      address_id: null,
      total_amount: input.totalAmount,
      status: 'completed',
      payment_method: input.paymentMethod,
      payment_status: 'paid',
      sale_channel: 'pos',
    })
    .select('id')
    .single();

  if (orderError) throw new Error('Error al crear la orden');

  // Insertar los items
  const orderItems = input.cartItems.map((item) => ({
    order_id: order.id,
    variant_id: item.variantId,
    quantity: item.quantity,
    price: item.price,
    product_snapshot: item.productSnapshot,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error('Error al registrar los items de la orden');

  // Descontar stock de cada variante
  for (const item of input.cartItems) {
    const { error: stockError } = await supabase.rpc('decrement_variant_stock', {
      p_variant_id: item.variantId,
      p_quantity: item.quantity,
    });

    if (stockError)
      throw new Error(`Error al actualizar stock: ${stockError.message}`);
  }

  return { success: true, orderId: order.id };
};

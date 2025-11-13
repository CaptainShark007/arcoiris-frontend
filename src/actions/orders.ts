import { supabase } from '@/supabase/client';
import { OrderInput } from '@features/orders';

export const createOrder = async (order: OrderInput) => {
  // 1. Obtener el usuario autenticado + Cliente de la tabla customer
  const { data, error: errorUser } = await supabase.auth.getUser();

  if (errorUser) {
    console.log(errorUser);
    throw new Error(errorUser.message);
  }

  const userId = data.user.id;

  const { data: customer, error: errorCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (errorCustomer) {
    console.log(errorCustomer);
    throw new Error(errorCustomer.message);
  }

  const customerId = customer.id;

  // 2. Verificar si el stock es suficiente para cada variante en el carrito
  for (const item of order.cartItems) {
    
    const { data: variantData, error: variantError } = await supabase
      .from('variants')
      .select('stock')
      .eq('id', item.variantId)
      .single();

    if (variantError) {
      console.log(variantError);
      throw new Error(variantError.message);
    }

    if (variantData.stock < item.quantity) {
      throw new Error('No hay suficiente stock para la variante con ID: ' + item.variantId);
    }

  }

  // 3. Guardar la direccion del envio
  const { data: addressData, error: addressError } = await supabase.from('addresses').insert({
    address_line1: order.address.addressLine1,
    address_line2: order.address.addressLine2,
    city: order.address.city,
    postal_code: order.address.postalCode,
    state: order.address.state,
    country: order.address.country,
    customer_id: customerId,
  }).select().single();

  if (addressError) {
    console.log(addressError);
    throw new Error(addressError.message);
  }

  // 4. Crear la orden
  const { data: orderData, error: orderError } = await supabase.from('orders').insert({
    customer_id: customerId,
    address_id: addressData.id,
    total_amount: order.totalAmount,
    status: 'Pending',
  }).select().single();

  if (orderError) {
    console.log(orderError);
    throw new Error(orderError.message);
  }

  // 5. Guardar los detalles de la orden
  const orderItems = order.cartItems.map(item => ({
    order_id: orderData.id,
    variant_id: item.variantId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems);

  if (orderItemsError) {
    console.log(orderItemsError);
    throw new Error(orderItemsError.message);
  }

  // 6. Actualizar el stock de las variantes
  for (const item of order.cartItems) {

    // Obtener el stock actual
    const { data: variantData } = await supabase.from('variants').select('stock').eq('id', item.variantId).single();

    if (!variantData) {
      throw new Error('Variante no encontrada con ID: ' + item.variantId);
    }

    const newStock = variantData.stock - item.quantity;

    const { error: updateStockError } = await supabase.from('variants').update({
      stock: newStock,
    }).eq('id', item.variantId);

    if (updateStockError) {
      console.log(updateStockError);
      throw new Error(`No se pudo actualizar el stock para la variante con ID: ${item.variantId}`);
    }
    
  }

  return orderData;

};

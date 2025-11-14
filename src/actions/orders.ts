import { supabase } from '@/supabase/client';
import { OrderInput } from '@shared/types';

export const createOrder = async (order: OrderInput) => {
  try {
    console.log('Iniciando creación de orden:', order);

    // 1. Obtener el usuario autenticado
    const { data: userData, error: errorUser } = await supabase.auth.getUser();

    if (errorUser) {
      throw new Error(`Error de autenticación: ${errorUser.message}`);
    }

    if (!userData.user) {
      throw new Error('Usuario no autenticado');
    }

    const userId = userData.user.id;
    console.log('Usuario autenticado:', userId);

    // 2. Obtener o crear customer
    let customerId: string;

    const { data: customer, error: errorCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (errorCustomer) {
      throw new Error(`Error al buscar cliente: ${errorCustomer.message}`);
    }

    if (customer) {
      customerId = customer.id;
      console.log('Cliente existente:', customerId);
    } else {
      // Crear nuevo customer si no existe
      const { data: newCustomer, error: createCustomerError } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          email: userData.user.email!,
          full_name: order.address.name || userData.user.user_metadata?.full_name || 'Cliente',
          phone: order.address.phone || null,
        })
        .select('id')
        .single();

      if (createCustomerError) {
        throw new Error(`Error al crear cliente: ${createCustomerError.message}`);
      }
      
      customerId = newCustomer.id;
      console.log('Nuevo cliente creado:', customerId);
    }

    // 3. Verificar stock y existencia de todas las variantes
    const variantIds = order.cartItems.map(item => item.variantId);
    
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('id, stock, products(name)')
      .in('id', variantIds);

    if (variantsError) {
      throw new Error(`Error al verificar variantes: ${variantsError.message}`);
    }

    console.log('Variantes encontradas:', variants);

    // Verificar que todas las variantes existen
    const foundVariantIds = variants?.map(v => v.id) || [];
    const missingVariants = variantIds.filter(id => !foundVariantIds.includes(id));
    
    if (missingVariants.length > 0) {
      throw new Error(`Los siguientes productos no existen: ${missingVariants.join(', ')}`);
    }

    // Verificar stock suficiente
    const outOfStockItems = order.cartItems.filter(item => {
      const variant = variants.find(v => v.id === item.variantId);
      return variant && variant.stock < item.quantity;
    });

    if (outOfStockItems.length > 0) {
      const productNames = outOfStockItems.map(item => {
        const variant = variants.find(v => v.id === item.variantId);
        return `${variant?.products?.name || 'Producto'} (ID: ${item.variantId})`;
      });
      throw new Error(`Stock insuficiente para: ${productNames.join(', ')}`);
    }

    console.log('Stock verificado');

    // 4. Guardar la dirección del envío
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .insert({
        address_line1: order.address.addressLine1,
        address_line2: order.address.addressLine2 || '',
        city: order.address.city,
        postal_code: order.address.postalCode || '',
        state: order.address.state,
        country: order.address.country,
        customer_id: customerId,
      })
      .select('id')
      .single();

    if (addressError) {
      throw new Error(`Error al crear dirección: ${addressError.message}`);
    }

    console.log('Dirección creada:', addressData.id);

    // 5. Crear la orden
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        address_id: addressData.id,
        total_amount: order.totalAmount,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError) {
      throw new Error(`Error al crear orden: ${orderError.message}`);
    }

    console.log('Orden creada:', orderData.id);

    // 6. Guardar los detalles de la orden
    const orderItems = order.cartItems.map(item => ({
      order_id: orderData.id,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      throw new Error(`Error al crear items de orden: ${orderItemsError.message}`);
    }

    console.log('Items de orden creados');

    // 7. Actualizar el stock de las variantes - CORREGIDO
    for (const item of order.cartItems) {
      // Primero obtener el stock actual
      const { data: currentVariant, error: getStockError } = await supabase
        .from('variants')
        .select('stock')
        .eq('id', item.variantId)
        .single();

      if (getStockError) {
        throw new Error(`Error al obtener stock de variante ${item.variantId}: ${getStockError.message}`);
      }

      // Calcular nuevo stock
      const newStock = currentVariant.stock - item.quantity;

      // Actualizar con el valor calculado
      const { error: updateStockError } = await supabase
        .from('variants')
        .update({ stock: newStock })
        .eq('id', item.variantId);

      if (updateStockError) {
        throw new Error(`Error al actualizar stock para variante ${item.variantId}: ${updateStockError.message}`);
      }

      console.log(`Stock actualizado para variante ${item.variantId}: ${currentVariant.stock} -> ${newStock}`);
    }

    console.log('Orden completada exitosamente:', orderData.id);
    return orderData;

  } catch (error) {
    console.error('Error completo en createOrder:', error);
    throw error;
  }
};
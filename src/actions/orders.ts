import { supabase } from '@/supabase/client';
import { CreateOrderResponse, OrderInput } from '@shared/types';

/* export const createOrder = async (order: OrderInput) => {
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
          full_name: userData.user.user_metadata?.full_name || 'Cliente',
          phone: null,
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
}; */

export const createOrder = async (order: OrderInput): Promise<CreateOrderResponse> => {
  try {
    console.log('Iniciando creación de orden con stored procedure:', order);

    // 1. Obtener el usuario autenticado
    const { data: userData, error: errorUser } = await supabase.auth.getUser();

    if (errorUser) {
      return {
        success: false,
        error: `Error de autenticación: ${errorUser.message}`,
        message: 'No se pudo autenticar el usuario',
      };
    }

    if (!userData.user) {
      return {
        success: false,
        error: 'Usuario no autenticado',
        message: 'Debes iniciar sesión para crear una orden',
      };
    }

    const userId = userData.user.id;
    console.log('Usuario autenticado:', userId);

    // 2. Preparar los datos para el stored procedure
    const cartItemsJson = order.cartItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));

    // 3. Llamar al stored procedure
    const { data, error } = await (supabase.rpc as any)(
      'create_order_transaction', 
      {
        p_user_id: userId,
        p_user_email: userData.user.email || '',
        p_user_full_name: userData.user.user_metadata?.full_name || 'Cliente',
        p_address_line1: order.address.addressLine1,
        p_address_line2: order.address.addressLine2 || '',
        p_city: order.address.city,
        p_postal_code: order.address.postalCode || '',
        p_state: order.address.state,
        p_country: order.address.country,
        p_cart_items: cartItemsJson,
        p_total_amount: order.totalAmount,
      }
    );

    if (error) {
      console.error('Error del stored procedure:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al crear la orden',
      };
    }

    // 4. Procesar la respuesta del stored procedure
    if (!data || !data.success) {
      console.error('Error en la ejecución:', data?.error);
      return {
        success: false,
        error: data?.error || 'Error desconocido',
        detail: data?.detail,
        message: data?.message || 'No se pudo crear la orden',
      };
    }

    console.log('Orden creada exitosamente:', data);
    return {
      success: true,
      orderId: data.orderId,
      customerId: data.customerId,
      addressId: data.addressId,
      message: 'Orden creada exitosamente',
    };

  } catch (error) {
    console.error('Error en createOrder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error interno al procesar la orden',
    };
  }
};

// metodo para obtener ordenes de un cliente
export const getOrdersByCustomerId = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error);
    throw new Error('Error al obtener el usuario autenticado');
  }

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', data.user.id)
    .single();

  if (customerError) {
    console.log(customerError);
    throw new Error('Error al obtener el cliente');
  }

  const customerId = customer.id;

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.log(ordersError);
    throw new Error('Error al obtener las órdenes');
  }

  return orders;
};

// metodo para obtener los detalles de una orden
export const getOrderById = async (orderId: number) => {
  const { data, error: errorUsers } = await supabase.auth.getUser();

  if (errorUsers) {
    console.log(errorUsers);
    throw new Error('Error al obtener el usuario autenticado');
  }

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', data.user.id)
    .single();

  if (customerError) {
    console.log(customerError);
    throw new Error('Error al obtener el cliente');
  }

  const customerId = customer.id;

  const { data: order, error } = await supabase
    .from('orders')
    .select(
      '*, addresses(*), customers(full_name, email, phone), order_items(quantity, price, variants(color_name, storage, finish, products(name, images)))'
    )
    .eq('customer_id', customerId)
    .eq('id', orderId)
    .single();

  if (error) {
    console.log(error);
    throw new Error('Error al obtener la orden');
  }

  return {
    customer: {
      email: order?.customers?.email,
      full_name: order.customers?.full_name,
      phone: order.customers?.phone,
    },
    totalAmount: order.total_amount,
    status: order.status,
    created_at: order.created_at,
    address: {
      addressLine1: order.addresses?.address_line1,
      addressLine2: order.addresses?.address_line2,
      city: order.addresses?.city,
      state: order.addresses?.state,
      postalCode: order.addresses?.postal_code,
      country: order.addresses?.country,
    },
    orderItems: order.order_items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      color_name: item.variants?.color_name,
      finish: item.variants?.finish,
      storage: item.variants?.storage,
      productName: item.variants?.products?.name,
      productImage: item.variants?.products?.images[0],
    })),
  };
};

// *********************************************************************************************
//                                    ADMINISTRADOR
// *********************************************************************************************
export const getAllOrders = async (page: number = 1, pageSize: number = 10) => {

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

	const { data, error, count } = await supabase
		.from('orders')
		.select(
			'id, total_amount, status, created_at, customers(full_name, email, phone)', { count: 'exact' }
		)
		.order('created_at', { ascending: false })
    .range(from, to);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return {
    data,
    count: count || 0,
  }
  
};

export const updateOrderStatus = async ({
	id,
	status,
}: {
	id: number;
	status: string;
}) => {
	const { error } = await supabase
		.from('orders')
		.update({ status })
		.eq('id', id);

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export const getOrderByIdAdmin = async (id: number) => {
	const { data: order, error } = await supabase
		.from('orders')
		.select(
			'*, addresses(*), customers(full_name, email), order_items(quantity, price, variants(color_name, storage, finish, products(name, images)))'
		)
		.eq('id', id)
		.single();

	if (error) {
		console.log(error);
		throw new Error(error.message);
	}

	return {
		customer: {
			email: order?.customers?.email,
			full_name: order.customers?.full_name,
		},
		totalAmount: order.total_amount,
		status: order.status,
		created_at: order.created_at,
		address: {
			addressLine1: order.addresses?.address_line1,
			addressLine2: order.addresses?.address_line2,
			city: order.addresses?.city,
			state: order.addresses?.state,
			postalCode: order.addresses?.postal_code,
			country: order.addresses?.country,
		},
		orderItems: order.order_items.map(item => ({
			quantity: item.quantity,
			price: item.price,
			color_name: item.variants?.color_name,
			storage: item.variants?.storage,
      finish: item.variants?.finish,
			productName: item.variants?.products?.name,
			productImage: item.variants?.products?.images[0],
		})),
	};
};
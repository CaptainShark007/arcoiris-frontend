import { supabase } from '@/supabase/client';
import { CreateOrderResponse, OrderInput } from '@shared/types';

export const createOrder = async (
  order: OrderInput
): Promise<CreateOrderResponse> => {
  try {
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

    // 2. Preparar los datos para el stored procedure
    const cartItemsJson = order.cartItems.map((item) => ({
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
// usado en la pagina de pedidos del usuario - perfil
export const getOrdersByCustomerId = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error('Error al obtener el usuario autenticado');
  }

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', data.user.id)
    .single();

  if (customerError) {
    throw new Error('Error al obtener el cliente');
  }

  const customerId = customer.id;

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, total_amount, status, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (ordersError) {
    throw new Error('Error al obtener las órdenes');
  }

  return orders;
};

// metodo para obtener los detalles de una orden
// usado en la pagina de detalles de orden del usuario - perfil
export const getOrderById = async (orderId: number) => {
  const { data, error: errorUsers } = await supabase.auth.getUser();

  if (errorUsers) {
    throw new Error('Error al obtener el usuario autenticado');
  }

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', data.user.id)
    .single();

  if (customerError) {
    throw new Error('Error al obtener el cliente');
  }

  const customerId = customer.id;
  const { data: order, error } = await supabase
    .from('orders')
    .select(
      '*, addresses(*), customers(full_name, email, phone), order_items(quantity, price, product_snapshot)'
    )
    .eq('customer_id', customerId)
    .eq('id', orderId)
    .single();

  if (error) {
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
    orderItems: order.order_items.map((item: any) => ({
      quantity: item.quantity,
      price: item.price,
      color_name: item.product_snapshot?.color,
      storage: item.product_snapshot?.storage,
      productName: item.product_snapshot?.name,
      productImage: item.product_snapshot?.image,
      finish: item.product_snapshot?.finish || null,
    })),
  };
};

// *********************************************************************************************
//                                    ADMINISTRADOR
// *********************************************************************************************
// Metodo usado en el panel de administrador para obtener todas las ordenes
export const getAllOrders = async (page: number = 1, pageSize: number = 10) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('orders')
    .select(
      'id, total_amount, status, created_at, customers(full_name, email, phone)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data,
    count: count || 0,
  };
};

// Metodo para actualizar el estado de una orden
// usado en el panel de administrador
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
    throw new Error(error.message);
  }
};

// Metodo para obtener los detalles de una orden por su ID (admin)
// usado en el panel de administrador
export const getOrderByIdAdmin = async (id: number) => {
  const { data: order, error } = await supabase
    .from('orders')
    .select(
      '*, addresses(*), customers(full_name, email), order_items(quantity, price, product_snapshot)'
    )
    .eq('id', id)
    .single();

  if (error) {
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
    orderItems: order.order_items.map((item: any) => ({
      quantity: item.quantity,
      price: item.price,
      color_name: item.product_snapshot?.color,
      storage: item.product_snapshot?.storage,
      productName: item.product_snapshot?.name,
      productImage: item.product_snapshot?.image,
      finish: item.product_snapshot?.finish || null,
    })),
  };
};

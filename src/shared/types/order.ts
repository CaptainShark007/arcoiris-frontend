export interface OrderInput {
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  cartItems: {
    variantId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  partnerCode?: string | null;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: number;
  customerId?: string;
  addressId?: string;
  error?: string;
  detail?: string;
  message: string;
}

export interface OrderItemSingle {
	created_at: string;
	id: number;
	status: string;
	total_amount: number;
}

export interface OrderWithCustomer {
	id: number;
	status: string;
	total_amount: number;
	created_at: string;
	customers: {
		full_name: string;
		email: string;
    phone: string | null;
	} | null;
  partners?: {
    name: string;
    code: string;
  } | null;
}

// Define la estructura de tu snapshot (coincide con el JSON del SP)
export interface ProductSnapshot {
  name: string;
  brand: string;
  slug: string;
  image: string;
  color: string | null;
  storage: string | null;
  frozen_at: string;
}

// Actualiza o crea esta interfaz para el detalle de la orden
export interface OrderDetail {
  id: number;
  created_at: string;
  status: string;
  totalAmount: number; // Mapeado de total_amount
  customer: {
    full_name: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string | null; // Mapeado de postal_code
    country: string;
  };
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    // IMPORTANTE: Ahora usamos esto en lugar de joins planos
    product_snapshot: ProductSnapshot; 
  }[];
}
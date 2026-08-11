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
  sale_channel: string | null;
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

export interface OrderDetail {
  id: number;
  created_at: string;
  status: string;
  totalAmount: number;
  sale_channel: string | null;  // ← agregar
  customer: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;                     // ← hacer nullable
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string | null;
    country: string;
  } | null;                     // ← hacer nullable
  partner: {
    name: string;
    code: string;
  } | null;
  orderItems: {
    quantity: number;
    price: number;
    color_name: string | null;
    storage: string | null;
    productName: string;
    productImage: string;
    finish: string | null;
  }[];
}
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
}
export interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  customerId: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
}

export interface OrderDetail extends Order {
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  variant: {
    id: string;
    colorName: string;
    storage: string;
    finish?: string;
    product: {
      name: string;
      images: string[];
    };
  };
}

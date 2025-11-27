export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    color: string | null;
    storage?: string | null;
    finish?: string | null;
    colorHex?: string | null;
    stock?: number | null;
  };
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

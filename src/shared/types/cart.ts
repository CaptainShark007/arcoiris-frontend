/* export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
} */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    color: string;
    storage?: string;
    finish?: string | null;
    colorHex?: string;
  };
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

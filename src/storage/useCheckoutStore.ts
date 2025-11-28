import { create } from 'zustand';

interface ShippingInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
}

interface OrderSummary {
  totalItems: number;
  totalPrice: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface CheckoutState {
  shippingInfo: ShippingInfo | null;
  shippingMethod: 'retiro' | 'acordar' | null;
  orderId: number | null;
  orderSummary: OrderSummary | null;
  setShippingInfo: (info: ShippingInfo) => void;
  setShippingMethod: (method: 'retiro' | 'acordar') => void;
  setOrderId: (id: number) => void;
  setOrderSummary: (summary: OrderSummary) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingInfo: null,
  shippingMethod: null,
  orderId: null,
  orderSummary: null,
  setShippingInfo: (info) => set({ shippingInfo: info }),
  setShippingMethod: (method) => set({ shippingMethod: method }),
  setOrderId: (id) => set({ orderId: id }),
  setOrderSummary: (summary) => set({ orderSummary: summary }),
  clearCheckout: () => set({ 
    shippingInfo: null, 
    shippingMethod: null, 
    orderId: null, 
    orderSummary: null 
  }),
}));
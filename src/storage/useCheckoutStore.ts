import { create } from 'zustand';

interface ShippingInfo {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  name: string;
  email: string;
  phone: string;
}

interface CheckoutState {
  shippingInfo: ShippingInfo | null;
  orderId: number | null;
  setShippingInfo: (info: ShippingInfo) => void;
  setOrderId: (id: number) => void; // ← Cambiado a number
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingInfo: null,
  orderId: null,
  setShippingInfo: (info) => set({ shippingInfo: info }),
  setOrderId: (id: number) => set({ orderId: id }),
  clearCheckout: () => set({ shippingInfo: null, orderId: null }),
}));
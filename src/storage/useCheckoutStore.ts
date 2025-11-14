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
  setShippingInfo: (info: ShippingInfo) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingInfo: null,
  setShippingInfo: (info) => set({ shippingInfo: info }),
  clearCheckout: () => set({ shippingInfo: null }),
}));

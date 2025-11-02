import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '../shared/types/cart';

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalQuantity, totalPrice };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          let newItems: CartItem[];
          if (existingItem) {
            // Si el item ya existe, incrementa su cantidad
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            // Si es nuevo, agrégalo con cantidad 1
            newItems = [...state.items, { ...item, quantity: 1 }];
          }

          const totals = calculateTotals(newItems);
          console.log('🛒 Cart Updated:', { items: newItems, ...totals });
          return { items: newItems, ...totals };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const totals = calculateTotals(newItems);
          return { items: newItems, ...totals };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            // Si la cantidad es 0 o menor, elimina el item
            const newItems = state.items.filter((item) => item.id !== id);
            const totals = calculateTotals(newItems);
            console.log('🛒 Cart Updated (removed):', { items: newItems, ...totals });
            return { items: newItems, ...totals };
          }

          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          const totals = calculateTotals(newItems);
          console.log('🛒 Cart Updated (quantity):', { items: newItems, ...totals });
          return { items: newItems, ...totals };
        }),

      clearCart: () =>
        set({
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
        }),
    }),
    {
      name: 'arcoiris-cart-storage',
    }
  )
);

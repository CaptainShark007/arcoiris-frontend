// src/hooks/usePosStore.ts
import { useState, useCallback } from 'react';
import { getPosProducts, createPosOrder, PosProduct, PosVariant } from '@/actions/pos';
import { useQuery, useMutation } from '@tanstack/react-query';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  image: string;
  color_name: string | null;
  storage: string | null;
  finish: string | null;
  color: string | null;
  price: number;
  quantity: number;
}

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta';

// ── Hook ───────────────────────────────────────────────────────────────────

export const usePosStore = () => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // ── Productos ────────────────────────────────────────────────────────────

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['pos-products', search, categoryId],
    queryFn: () => getPosProducts(search, categoryId),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // ── Carrito ──────────────────────────────────────────────────────────────

  const addToCart = useCallback((product: PosProduct, variant: PosVariant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);

      // Si ya está en el carrito, incrementar cantidad respetando el stock
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: Math.min(item.quantity + 1, variant.stock) }
            : item
        );
      }

      // Si no está, agregar con cantidad 1
      return [
        ...prev,
        {
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          image: product.image,
          color_name: variant.color_name,
          storage: variant.storage,
          finish: variant.finish,
          color: variant.color,
          price: variant.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Totales ──────────────────────────────────────────────────────────────

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ── Confirmar venta ──────────────────────────────────────────────────────

  const { mutate: confirmSale, isPending: confirmingOrder } = useMutation({
    mutationFn: () =>
      createPosOrder({
        cartItems: cart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          productSnapshot: {
            name: item.productName,
            image: item.image,
            color: item.color_name,
            storage: item.storage,
            finish: item.finish,
          },
        })),
        totalAmount,
        paymentMethod,
      }),
    onSuccess: () => {
      clearCart();
      setPaymentMethod('efectivo');
    },
  });

  return {
    // Búsqueda
    search,
    setSearch,
    // Productos
    products,
    loadingProducts,
    // Carrito
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Totales
    totalItems,
    totalAmount,
    // Pago
    paymentMethod,
    setPaymentMethod,
    // Confirmar
    confirmSale,
    confirmingOrder,
    // Categorías
    categoryId,
    setCategoryId,
  };
};
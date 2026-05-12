import { useState, useCallback, useEffect } from 'react';
import { getPosProducts, createPosOrder, PosProduct, PosVariant } from '@/actions/pos';
import { useQuery, useMutation } from '@tanstack/react-query';

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

export const usePosStore = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleCategoryChange = useCallback((id: string | null) => {
    setCategoryId(id);
    setPage(1);
  }, []);

  const { data: posData, isLoading, isFetching } = useQuery({
    queryKey: ['pos-products', debouncedSearch, categoryId, page],
    queryFn: () => getPosProducts(debouncedSearch, categoryId, page),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });

  const products = posData?.data || [];
  const totalProducts = posData?.count || 0;

  const addToCart = useCallback((product: PosProduct, variant: PosVariant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);

      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: Math.min(item.quantity + 1, variant.stock) }
            : item
        );
      }

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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
    setSearch: handleSearchChange,
    // Productos
    products,
    loadingProducts: isLoading,
    fetchingProducts: isFetching,
    totalProducts,
    // Paginación
    page,
    setPage,
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
    setCategoryId: handleCategoryChange,
  };
};
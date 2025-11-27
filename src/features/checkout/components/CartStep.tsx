import { Box, Typography, Button, Stack } from '@mui/material';
import { CartList, CartSearch } from '@shared/components';
import { useCartStore } from '@/storage/useCartStore';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { useState, useEffect } from 'react';

interface CartStepProps {
  onNext: () => void;
}

export const CartStep = ({ onNext }: CartStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const items = useCartStore((state) => state.items);
  const { totalQuantity, totalPrice } = useCartStore();
  const { setOrderSummary } = useCheckoutStore();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Guardar el resumen de la orden cuando los items cambian
  useEffect(() => {
    if (items.length > 0) {
      const orderSummary = {
        totalItems: totalQuantity,
        totalPrice: totalPrice,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      setOrderSummary(orderSummary);
    }
  }, [items, totalQuantity, totalPrice, setOrderSummary]);

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography
          variant='h5'
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            fontWeight: 600,
            textAlign: { xs: 'center', sm: 'left' },
            width: '100%',
          }}
        >
          Vista previa de la orden
        </Typography>

        {items.length > 0 && (
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            <CartSearch onSearchChange={setSearchQuery} />
          </Box>
        )}
      </Stack>

      {/* LISTA CON SCROLL */}
      <Box
        sx={{
          maxHeight: { xs: '65vh', sm: 300 }, // ⭐ Mucho más cómodo en mobile
          overflowY: 'auto',
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          mb: 2,
        }}
      >
        {filteredItems.length > 0 ? (
          <CartList items={filteredItems} />
        ) : searchQuery ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography>No se encontraron productos.</Typography>
          </Box>
        ) : (
          <CartList />
        )}
      </Box>

      {/* Botón móvil */}
      <Button
        variant='contained'
        onClick={onNext}
        disabled={items.length === 0}
        fullWidth
        sx={{
          display: { xs: 'block', md: 'none' },
          py: 1.5,
          fontSize: '1rem',
          mb: 2,
        }}
      >
        Continuar con entrega
      </Button>
    </Box>
  );
};

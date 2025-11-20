import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useCartStore } from '../../storage/useCartStore';
import { CartItem } from './CartItem';
import type { CartItem as CartItemType } from '../types/cart';

interface CartListProps {
  items?: CartItemType[];
}

export const CartList = memo(({ items: propItems }: CartListProps) => {
  const storeItems = useCartStore((state) => state.items);
  const items = propItems ?? storeItems;

  if (items.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 2 
        }}
      >
        <Typography variant='h5' gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Agrega productos para comenzar tu compra
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      //bgcolor: 'green',
      display: 'flex',
      flexDirection: 'column',
      //gap: 2
    }}>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </Box>
  );
});

CartList.displayName = 'CartList';

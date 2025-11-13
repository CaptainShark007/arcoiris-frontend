import { memo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCartStore } from '../../storage/useCartStore';
import type { CartItem as CartItemType } from '../types/cart';
import { formatPrice } from '@/helpers';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = memo(({ item }: CartItemProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        position: 'relative',
        boxShadow: 'none',
        borderBottom: 1,
        bgcolor: 'background.default',
        borderRadius: 0,
        borderColor: 'divider',
      }}
    >
      <CardMedia
        component='img'
        sx={{ width: 120, height: 120, objectFit: 'cover' }}
        image={item.image}
        alt={item.name}
      />

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: 'background.default',
        }}
      >
        <Box>
          <Typography variant='h6' component='h3' sx={{ mb: 0.5 }}>
            {item.name}
          </Typography>
          <Typography variant='body1' color='primary' fontWeight='bold'>
            {formatPrice(item.price)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <IconButton
            size='small'
            onClick={handleDecrement}
            aria-label='Disminuir cantidad'
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <Remove fontSize='small' />
          </IconButton>

          <Typography
            variant='body1'
            sx={{ minWidth: 30, textAlign: 'center' }}
          >
            {item.quantity}
          </Typography>

          <IconButton
            size='small'
            onClick={handleIncrement}
            aria-label='Aumentar cantidad'
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <Add fontSize='small' />
          </IconButton>

          <Typography variant='body1' fontWeight='bold' sx={{ ml: 'auto' }}>
            {formatPrice(item.price * item.quantity)}
          </Typography>
        </Box>
      </CardContent>

      <IconButton
        onClick={handleRemove}
        aria-label='Eliminar producto'
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <Delete />
      </IconButton>
    </Card>
  );
});

CartItem.displayName = 'CartItem';

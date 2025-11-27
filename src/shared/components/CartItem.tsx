import { memo } from 'react';
import { Box, IconButton, Typography, Card, CardMedia } from '@mui/material';
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
    const maxStock = item.variant?.stock ?? 1;
    if (item.quantity < maxStock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const variants = [
    item.variant?.color,
    item.variant?.storage,
    item.variant?.finish,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <Card
      sx={{
        display: 'flex',
        position: 'relative',
        boxShadow: 'none',
        borderRadius: 0,
        borderBottom: 1,
        borderColor: 'divider',
        p: { xs: 1, sm: 1.5 },
        gap: { xs: 1, sm: 1.5 },
        flexDirection: { xs: 'column', sm: 'row' }, // ⭐ MOBILE: columna
        alignItems: { xs: 'center', sm: 'flex-start' },
      }}
    >
      {/* Imagen */}
      <CardMedia
        component='img'
        sx={{
          width: { xs: 90, sm: 120 },
          height: { xs: 90, sm: 120 },
          objectFit: 'contain',
          borderRadius: 1,
        }}
        image={item.image}
        alt={item.name}
      />

      {/* Contenido */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          textAlign: { xs: 'center', sm: 'left' }, // ⭐ Mobile centrado
          width: '100%',
          mt: { xs: 1, sm: 0 },
          pr: { xs: 0, sm: 4 },
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          {item.name}
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 1 }}
        >
          {variants}
        </Typography>

        <Typography
          variant='subtitle2'
          color='primary'
          fontWeight='bold'
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {formatPrice(item.price)}
        </Typography>

        {/* Cantidad */}
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            gap: 1.2,
          }}
        >
          <IconButton
            size='small'
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            sx={{
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Remove fontSize='small' />
          </IconButton>

          <Typography sx={{ fontWeight: 600 }}>{item.quantity}</Typography>

          <IconButton
            size='small'
            onClick={handleIncrement}
            disabled={item.quantity >= (item.variant?.stock ?? 1)}
            sx={{
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Add fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      {/* Eliminar */}
      <IconButton
        onClick={handleRemove}
        size='small'
        sx={{
          position: 'absolute',
          top: { xs: 6, sm: 10 },
          right: { xs: 6, sm: 10 },
          color: 'error.main',
        }}
      >
        <Delete fontSize='small' />
      </IconButton>
    </Card>
  );
});

CartItem.displayName = 'CartItem';

import { memo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
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
        //border: 1,
        borderBottom: 1,
        borderColor: 'divider',
        p: 1.5,
        gap: 1.5,
        height: 'auto',
        bgcolor: 'background.default',
      }}
    >
      {/* Imagen */}
      <CardMedia
        component='img'
        sx={{
          width: 120,
          height: 120,
          objectFit: 'contain',
          //borderRadius: 1,
          flexShrink: 0,
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
          justifyContent: 'space-between',
          minWidth: 0,
          pr: 4,
        }}
      >
        {/* Nombre y precio */}
        <Box>
          <Typography
            variant='subtitle1'
            sx={{
              fontWeight: 600,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.name}
          </Typography>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
            {variants}
          </Typography>

          <Typography variant='subtitle2' color='primary' fontWeight='bold'>
            {formatPrice(item.price)}
          </Typography>
        </Box>

        {/* Cantidad */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size='small'
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            sx={{
              border: 1,
              borderColor: 'divider',
              p: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Remove fontSize='small' />
          </IconButton>

          <Typography
            variant='body2'
            sx={{
              minWidth: 28,
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {item.quantity}
          </Typography>

          <IconButton
            size='small'
            onClick={handleIncrement}
            disabled={item.quantity >= (item.variant?.stock ?? 1)}
            sx={{
              border: 1,
              borderColor: 'divider',
              p: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Add fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      {/* Botón eliminar */}
      <IconButton
        onClick={handleRemove}
        size='small'
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'error.main',
          '&:hover': {
            bgcolor: 'error.lighter',
          },
        }}
      >
        <Delete fontSize='small' />
      </IconButton>
    </Card>
  );
});

CartItem.displayName = 'CartItem';
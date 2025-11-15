import { memo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
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
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 'none',
        borderBottom: 1,
        bgcolor: 'background.default',
        borderRadius: 0,
        borderColor: 'divider',
        p: 1,
      }}
    >
      <Box sx={{ display: 'flex' }}>
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
          }}
        >
          <Box>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
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
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <Add fontSize='small' />
            </IconButton>
          </Box>
        </CardContent>
      </Box>

      {/* FILA completa: chips + total (alineado con imagen) */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mt: 1 }}
      >
        {item.variant && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {item.variant.color && (
              <Chip
                size='small'
                label={item.variant.color}
                icon={
                  item.variant.colorHex ? (
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: item.variant.colorHex,
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : undefined
                }
              />
            )}

            {item.variant.storage && (
              <Chip size='small' label={item.variant.storage} />
            )}
            {item.variant.finish && (
              <Chip size='small' label={item.variant.finish} />
            )}
          </Box>
        )}

        <Typography variant='body1' fontWeight='bold'>
          {formatPrice(item.price * item.quantity)}
        </Typography>
      </Stack>

      <IconButton
        onClick={handleRemove}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <Delete />
      </IconButton>
    </Card>
  );
});

CartItem.displayName = 'CartItem';

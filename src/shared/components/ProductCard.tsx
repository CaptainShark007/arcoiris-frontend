/* import { memo } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { LoadingButton } from './LoadingButton';
import { useCartStore } from '../../storage/useCartStore';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showOriginalPrice?: boolean;
  onAddToCart?: (product: Product) => void;
  loading?: boolean;
}

export const ProductCard = memo(({
  product,
  showOriginalPrice = false,
  onAddToCart,
  loading = false,
}: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const discountedPrice =
    product.discount > 0
      ? (product.price * (1 - product.discount / 100)).toFixed(2)
      : product.price.toFixed(2);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Implementación por defecto usando el store del carrito
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: Number(discountedPrice),
        image: product.image,
      });
      toast.success('Producto agregado al carrito');
    }
  };

  return (
    <Card
      sx={{ maxWidth: 280, textAlign: 'center', position: 'relative', m: 1 }}
    >
      <CardMedia
        component='img'
        image={product.image}
        alt={product.name}
        loading="lazy"
        sx={{ height: 200, objectFit: 'cover' }}
      />

      <Box
        sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}
      >
        {product.isNew && (
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              px: 1,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            Nuevo
          </Box>
        )}
        {product.discount > 0 && (
          <Box
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              px: 1,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            -{product.discount}%
          </Box>
        )}
      </Box>

      <CardContent>
        <Typography variant='h6' sx={{ mb: 1 }}>
          {product.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 2,
            alignItems: 'baseline',
          }}
        >
          <Typography variant='h6' color='primary'>
            ${discountedPrice}
          </Typography>
          {showOriginalPrice && product.originalPrice && (
            <Typography
              variant='body2'
              sx={{ textDecoration: 'line-through', color: 'gray' }}
            >
              ${product.originalPrice}
            </Typography>
          )}
          {!showOriginalPrice && product.discount > 0 && (
            <Typography
              variant='body2'
              sx={{ textDecoration: 'line-through', color: 'gray' }}
            >
              ${product.price}
            </Typography>
          )}
        </Box>

        <LoadingButton
          variant='contained'
          fullWidth
          loading={loading}
          onClick={handleAddToCart}
        >
          Agregar al Carrito
        </LoadingButton>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
 */
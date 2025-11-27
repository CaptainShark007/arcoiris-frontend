import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import toast from 'react-hot-toast';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { formatPrice } from '@/helpers';
import { Link } from 'react-router';
import { useCartStore } from '@/storage/useCartStore';
import {
  NotificationPopup,
  ProductBadge,
  VariantSelectModal,
} from '@shared/components';
import { Product } from '@shared/types';
import { useProductVariants } from '@features/home/hooks';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { variants, loading } = useProductVariants(product.id);

  const isOutOfStock = !loading && variants.every((v) => Number(v.stock) <= 0);

  const handleSnackbarClick = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (variants.every((v) => Number(v.stock) <= 0)) {
      toast.error('Sin stock disponible');
      return;
    }

    if (variants.length === 1) {
      const variant = variants[0];

      addItem({
        id: variant.id,
        name: product.name,
        price: variant.price,
        image: product.images[0],
        variant: {
          color: variant.color_name,
          storage: variant.storage,
          finish: variant.finish,
          colorHex: variant.color,
        },
      });

      toast.success('Producto agregado al carrito', {
        position: 'bottom-right',
      });
      return;
    }

    setOpenModal(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSnackbarClick();
  };

  return (
    <>
      <Card
        component={Link}
        to={`/tienda/${product.slug}`}
        sx={{
          textAlign: 'center',
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
          transition: '0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          opacity: isOutOfStock ? 0.55 : 1,
          pointerEvents: isOutOfStock ? 'none' : 'auto',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-3px)',
          },
          textDecoration: 'none',
        }}
      >
        {/* Badge AGOTADO */}
        {isOutOfStock && <ProductBadge type='agotado' />}

        <CardMedia
          component='img'
          height='160'
          image={product.images[0]}
          alt={product.name}
          sx={{
            objectFit: 'contain',
            borderRadius: 1,
            mb: 1,
          }}
        />
        <CardContent
          sx={{
            p: 0,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Nombre del producto */}
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mb: 1,
              minHeight: 38,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
            }}
          >
            {product.name}
          </Typography>

          {/* Precio + Acciones */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 'auto',
            }}
          >
            <Box>
              {/* esto muestra "Desde" si hay múltiples precios */}
              {product.variants.length > 1 && (
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ display: 'block', fontSize: '0.7rem' }}
                >
                  Desde
                </Typography>
              )}
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                color='primary.main'
              >
                {formatPrice(product.variants[0]?.price)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size='small'
                color='primary'
                onClick={handleAddToCart}
                disabled={loading || isOutOfStock}
                sx={{
                  '&:hover': { backgroundColor: 'primary.main', color: '#fff' },
                }}
              >
                <ShoppingCartIcon fontSize='small' />
              </IconButton>
              <IconButton
                size='small'
                color='error'
                sx={{
                  '&:hover': { backgroundColor: 'error.main', color: '#fff' },
                }}
                onClick={handleFavoriteClick}
              >
                <FavoriteBorderIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de selección de variantes */}
      {variants.length > 1 && (
        <VariantSelectModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          variants={variants}
          product={product}
        />
      )}

      {/* Snackbar para notificaciones */}
      {/* Snackbar para notificaciones */}
      <NotificationPopup
        open={openSnackbar}
        message='Próximamente'
        severity='info'
        onClose={handleSnackbarClose}
      />
    </>
  );
};

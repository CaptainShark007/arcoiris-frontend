import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import toast from 'react-hot-toast';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { calculateDiscount, formatPrice } from '@/helpers';
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

  // Manejo de imagen
  const [imageError, setImageError] = useState(false);
  const getProductImage = () => {
    if (imageError || !product.images[0]) {
      return 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';
    }
    return product.images[0];
  };
  const handleImageError = () => setImageError(true);

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Invertimos el valor actual
    setIsFavorite((prev) => !prev);

    if (!isFavorite) {
      toast.success('Agregado a favoritos', {
        style: {
          marginTop: '50px',
        },
      });
    } else {
      toast.error('Eliminado de favoritos', {
        style: {
          marginTop: '50px',
        },
      });
    }
  };

  // Manejo del Carrito
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
        image: getProductImage(),
        quantity: 1,
        variant: {
          color: variant.color_name,
          storage: variant.storage,
          finish: variant.finish,
          colorHex: variant.color,
          stock: variant.stock,
        },
      });
      toast.success('Producto agregado', {
        style: { marginTop: '50px' },
      });
      return;
    }
    setOpenModal(true);
  };

  // Se crea una copia [...variants] para no mutar el estado original
  const sortedVariants = [...variants].sort((a, b) => {
    // 1. Prioridad: STOCK (Primero los que tienen stock)
    const aHasStock = a.stock > 0;
    const bHasStock = b.stock > 0;
    if (aHasStock && !bHasStock) return -1;
    if (!aHasStock && bHasStock) return 1;

    // 2. Prioridad: MAYOR DESCUENTO
    const aDiscount = calculateDiscount(a.price, a.original_price);
    const bDiscount = calculateDiscount(b.price, b.original_price);
    if (aDiscount > bDiscount) return -1;
    if (bDiscount > aDiscount) return 1;

    // 3. Prioridad: PRECIO MÁS BAJO (Desempate)
    return a.price - b.price;
  });

  // Se toma la variante "ganadora" del ordenamiento
  const mainVariant = sortedVariants[0];

  const currentPrice = mainVariant?.price || 0;
  const originalPrice = mainVariant?.original_price || 0;

  const discountPercent = calculateDiscount(currentPrice, originalPrice);
  const hasDiscount = discountPercent > 0 && !isOutOfStock;

  return (
    <>
      <Card
        component={Link}
        to={`/tienda/${product.slug}`}
        sx={{
          width: '100%',
          maxWidth: 300,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: 'none',
          textDecoration: 'none',
          transition: 'all 0.3s ease-in-out',
          opacity: isOutOfStock ? 0.6 : 1,
          pointerEvents: isOutOfStock ? 'none' : 'auto',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        {/* --- BADGES Y ACCIONES FLOTANTES --- */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
          {isOutOfStock ? (
            <ProductBadge type='agotado' />
          ) : hasDiscount ? (
            <ProductBadge type='oferta'>
              {/* {`-${discountPercent}%`} */}
            </ProductBadge>
          ) : null}
        </Box>

        {/* Botón de Favoritos Flotante */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(2px)',
            transition: 'all 0.2s ease',
            color: isFavorite ? 'error.main' : 'action.active',
            '&:hover': {
              bgcolor: 'white',
              color: 'error.main',
              transform: 'scale(1.1)',
            },
          }}
          size='small'
        >
          {isFavorite ? (
            <FavoriteIcon fontSize='small' />
          ) : (
            <FavoriteBorderIcon fontSize='small' />
          )}
        </IconButton>

        {/* --- IMAGEN DEL PRODUCTO --- */}
        <CardMedia
          component='img'
          image={getProductImage()}
          alt={product.name}
          onError={handleImageError}
          sx={{
            height: 200,
            objectFit: 'contain',
            p: 2,
            bgcolor: 'white',
          }}
        />

        {/* --- CONTENIDO --- */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            pt: 0,
          }}
        >
          {/* Título */}
          <Typography
            variant='body1'
            sx={{
              fontWeight: 600,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.8em',
              lineHeight: 1.4,
              color: 'text.primary',
              textAlign: 'center',
            }}
          >
            {product.name}
          </Typography>

          {/* SECCIÓN DE PRECIOS */}
          <Box sx={{ mt: 'auto', mb: 2 }}>
            {/* 1. Precio Original y Etiqueta de Descuento */}
            {hasDiscount && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                  }}
                >
                  {formatPrice(originalPrice)}
                </Typography>
                <Box
                  component='span'
                  sx={{
                    bgcolor: '#D81B60',
                    color: 'white',
                    borderRadius: 1,
                    px: 0.6,
                    py: 0.1,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                  }}
                >
                  {`${discountPercent}% OFF`}
                </Box>
              </Box>
            )}

            {/* 2. Precio Principal */}
            <Typography
              variant='h5'
              color='text.primary'
              align='center'
              sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
            >
              {/* Usamos el precio real del primer variante */}
              {formatPrice(currentPrice)}
            </Typography>

            {/* 3. Cuotas (Texto estatico/informativo) */}
            {/* <Typography
              variant="caption"
              align='center'
              sx={{ 
                color: 'green', 
                display: 'block', 
                mt: 0.5, 
              }}
            >
              Mismo precio 6 cuotas de {formatPrice(currentPrice / 6)} sin interés
            </Typography> */}
          </Box>

          {/* BOTÓN DE ACCIÓN GRANDE */}
          <Button
            variant='contained'
            fullWidth
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            sx={{
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.9rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            {isOutOfStock
              ? 'SIN STOCK'
              : loading
                ? 'CARGANDO...'
                : 'AGREGAR AL CARRITO'}
          </Button>
        </CardContent>
      </Card>

      {/* MODAL DE VARIANTES */}
      {variants.length > 1 && (
        <VariantSelectModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          variants={variants}
          product={product}
        />
      )}

      {/* SNACKBAR */}
      <NotificationPopup
        open={openSnackbar}
        message='Añadido a favoritos (Demo)'
        severity='success'
        onClose={() => setOpenSnackbar(false)}
      />
    </>
  );
};

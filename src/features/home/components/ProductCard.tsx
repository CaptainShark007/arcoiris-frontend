import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useCartStore } from '@/storage/useCartStore';
import { useProductVariants } from '../hooks';
import { useState, useEffect } from 'react';
import { Product } from '@shared/types';
import { ProductBadge, VariantSelectModal } from '@shared/components';
import { Link } from 'react-router';
import { calculateDiscount, formatPrice } from '@/helpers';

interface ProductCardProps {
  product: Product;
  // Prop opcional para avisar al padre (Carousel) sobre el estado del modal
  onModalStateChange?: (isOpen: boolean) => void;
}

export const ProductCard = ({
  product,
  onModalStateChange,
}: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { variants, loading } = useProductVariants(product.id);

  // Esto maneja el error de carga de imagen
  const [imageError, setImageError] = useState(false);

  const getProductImage = () => {
    if (imageError || !product.images[0]) {
      return 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';
    }
    return product.images[0];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const [openModal, setOpenModal] = useState(false);

  // Sincroniza estado del modal con el padre
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(openModal);
    }
    // Cleanup de seguridad: si el componente se desmonta con el modal abierto
    return () => {
      if (onModalStateChange) onModalStateChange(false);
    };
  }, [openModal, onModalStateChange]);

  const isOutOfStock = !loading && variants.every((v) => Number(v.stock) <= 0);

  const handleAddToCart = () => {
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
      toast.success('Producto agregado al carrito', {
        position: 'top-right',
        style: {
          marginTop: '50px',
        },
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
          maxWidth: 280,
          textAlign: 'center',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          opacity: isOutOfStock ? 0.55 : 1,
          pointerEvents: isOutOfStock ? 'none' : 'auto',
          textDecoration: 'none',
          boxShadow: 'none',
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        {/* Badge de Agotado o Descuento */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
          {isOutOfStock ? (
            <ProductBadge type='agotado' />
          ) : hasDiscount ? (
            <ProductBadge type='oferta'>
              {/* {`-${discountPercent}%`} */}
            </ProductBadge>
          ) : null}
        </Box>

        <CardMedia
          component='img'
          image={getProductImage()}
          alt={product.name}
          onError={handleImageError}
          sx={{ height: 200, objectFit: 'contain', p: 1 }}
        />

        <CardContent
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}
        >
          <Typography
            variant='body1'
            sx={{
              //mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 48,
              fontWeight: 600,
            }}
          >
            {product.name}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            {/* 1. Precio anterior y Descuento */}
            {hasDiscount && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  //mb: 0.5,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    fontSize: '0.9rem',
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
                    px: 0.8,
                    py: 0.2,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    lineHeight: 1,
                  }}
                >
                  {`-${discountPercent}%`}
                </Box>
              </Box>
            )}

            {/* 2. Precio Actual Grande */}
            <Typography
              variant='h5'
              color='text.primary'
              sx={{ 
                fontWeight: 800, 
                lineHeight: 1.2,
                mb: 1
              }}
            >
              {formatPrice(currentPrice)}
            </Typography>

            <Button
              variant='contained'
              fullWidth
              size='small'
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleAddToCart();
              }}
              disabled={loading || isOutOfStock}
            >
              {isOutOfStock
                ? 'Sin stock'
                : loading
                  ? 'Cargando...'
                  : 'Agregar al Carrito'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {variants.length > 1 && (
        <VariantSelectModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          variants={variants}
          product={product}
        />
      )}
    </>
  );
};

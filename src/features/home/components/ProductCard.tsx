import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from '@mui/material';
import toast from 'react-hot-toast';
import { formatPrice } from '@/helpers';
import { useCartStore } from '@/storage/useCartStore';
import { useProductVariants } from '../hooks';
import { useState, useEffect } from 'react'; // Importamos useEffect
import { Product } from '@shared/types';
import { ProductBadge, VariantSelectModal } from '@shared/components';
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
  // Prop opcional para avisar al padre (Carousel) sobre el estado del modal
  onModalStateChange?: (isOpen: boolean) => void;
}

export const ProductCard = ({ product, onModalStateChange }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { variants, loading } = useProductVariants(product.id);

  const [openModal, setOpenModal] = useState(false);

  // --- EFECTO NUEVO: Sincronizar estado del modal con el padre ---
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(openModal);
    }
    // Cleanup de seguridad: si el componente se desmonta con el modal abierto
    return () => {
      if (onModalStateChange) onModalStateChange(false);
    };
  }, [openModal, onModalStateChange]);
  // -------------------------------------------------------------

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
        image: product.images[0] ?? 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png',
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
        position: 'bottom-right',
      });
      return;
    }

    setOpenModal(true);
  };

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
        {isOutOfStock && <ProductBadge type='agotado' />}

        <CardMedia
          component='img'
          image={product.images[0] ?? 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'}
          alt={product.name}
          sx={{ height: 200, objectFit: 'contain', p: 1 }}
        />

        <CardContent
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}
        >
          <Typography
            variant='body1'
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 48,
              fontWeight: 500,
            }}
          >
            {product.name}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Typography
              variant='h6'
              color='primary'
              sx={{ mb: 2, fontWeight: 600 }}
            >
              {formatPrice(product.variants[0]?.price)}
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
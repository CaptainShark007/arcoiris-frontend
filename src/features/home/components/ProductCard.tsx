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
import { useState } from 'react';
import { Product } from '@shared/types';
import { ProductBadge, VariantSelectModal } from '@shared/components';
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { variants, loading } = useProductVariants(product.id);

  const [openModal, setOpenModal] = useState(false);

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
          //bgcolor: 'red'
          boxShadow: 'none',
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
          '&:hover': {
            //border: '1px solid divider',
            borderColor: 'primary.main',
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        {/* Badge AGOTADO */}
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

            {/* <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={handleAddToCart}
              disabled={loading || isOutOfStock}
            >
              {isOutOfStock
                ? "Sin stock"
                : loading
                ? "Cargando..."
                : "Agregar al Carrito"}
            </Button> */}
            <Button
              variant='contained'
              fullWidth
              size='small'
              onClick={(event) => {
                event.preventDefault(); // evita navegar por el link
                event.stopPropagation(); // evita que el click suba al Card
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

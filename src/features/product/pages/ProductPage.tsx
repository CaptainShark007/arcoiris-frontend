// /src/features/product/pages/ProductPage.tsx
import { useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProduct';
import { GridImages, ProductDescription } from '../components';
import { formatPrice } from '@/helpers';
import { Tag, Loader } from '@/shared/components';
import { useCartStore } from '@/storage/useCartStore';

import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { VariantProduct } from '@shared/types';

interface Acc {
  [key: string]: {
    name: string;
    storages: string[];
    finishes: string[];
  };
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, isError } = useProduct(slug || '');
  const addItem = useCartStore((state) => state.addItem);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantProduct | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  const colors = useMemo(() => {
    return (
      product?.variants.reduce((acc: Acc, variant: VariantProduct) => {
        const { color, color_name, storage, finish } = variant;
        if (!acc[color])
          acc[color] = { name: color_name, storages: [], finishes: [] };
        // agrupar por presentaciones
        if (!acc[color].storages.includes(storage))
          acc[color].storages.push(storage);
        // agrupar por terminaciones
        if (!acc[color].finishes.includes(finish || ''))
          acc[color].finishes.push(finish || '');
        return acc;
      }, {} as Acc) || {}
    );
  }, [product?.variants]);

  // Seleccionar color por defecto
  const availableColors = Object.keys(colors);

  useEffect(() => {
    if (!selectedColor && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  // Seleccionar presentación por defecto
  useEffect(() => {
    if (selectedColor && colors[selectedColor] && !selectedStorage) {
      setSelectedStorage(colors[selectedColor].storages[0]);
    }
  }, [selectedColor, colors, selectedStorage]);

  // Seleccionar terminación por defecto
  useEffect(() => {
    if (selectedColor && colors[selectedColor] && !selectedFinish) {
      setSelectedFinish(colors[selectedColor].finishes[0]);
    }
  }, [selectedColor, colors, selectedFinish]);

  // Encontrar la variante exacta
  useEffect(() => {
    if (selectedColor && selectedStorage && selectedFinish) {
      const variant = product?.variants.find(
        (v) =>
          v.color === selectedColor &&
          v.storage === selectedStorage &&
          v.finish === selectedFinish
      );
      setSelectedVariant(variant as VariantProduct);
    }
  }, [selectedColor, selectedStorage, selectedFinish, product?.variants]);

  const isOutOfStock = selectedVariant?.stock === 0;

  const handleIncrement = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast.error('Por favor selecciona una variante del producto');
      return;
    }

    if (isOutOfStock) {
      toast.error('Producto sin stock');
      return;
    }

    // Agregar el producto al carrito
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedVariant.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images?.[0] || '/assets/images/img-default.png',
      });
    }

    //toast.success(`${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
    toast.success('Producto agregado al carrito', { position: 'bottom-right' });

    // Resetear cantidad
    setQuantity(1);
  };

  if (isLoading) return <Loader />;
  if (!product || isError)
    return <Typography variant='h6'>Producto no encontrado</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          alignItems: 'flex-start',
        }}
      >
        {/* Columna de imágenes */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GridImages images={product.images} />
        </Box>

        {/* Columna de detalles */}
        <Box sx={{ maxWidth: 500, margin: { xs: '0 auto', md: '0' } }}>
          <Typography variant='h4' fontWeight={700} gutterBottom>
            {product.name}
          </Typography>

          <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
            <Typography variant='h5' color='text.primary' fontWeight={600}>
              {formatPrice(selectedVariant?.price || product.variants[0].price)}
            </Typography>
            {isOutOfStock && <Tag contentTag='agotado' />}
          </Stack>

          {/* COLOR */}
          <Box mt={3}>
            <Typography fontWeight={500} sx={{ mb: 1 }}>
              Color: {selectedColor && colors[selectedColor].name}
            </Typography>
            <Stack direction='row' spacing={1}>
              {availableColors.map((color) => (
                <Button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: '50%',
                    border:
                      selectedColor === color
                        ? '2px solid #000'
                        : '1px solid #ccc',
                    backgroundColor: color,
                    padding: 0,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* PRESENTACIÓN */}
          <Box mt={3} sx={{ width: 120 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Presentación</InputLabel>
              <Select
                value={selectedStorage || ''}
                label='Presentación'
                onChange={(e) => setSelectedStorage(e.target.value)}
              >
                {selectedColor &&
                  colors[selectedColor].storages.map((storage) => (
                    <MenuItem key={storage} value={storage}>
                      {storage}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {/* TERMINACIÓN */}
          <Box mt={3} sx={{ width: 120 }}>
            <FormControl fullWidth size='small'>
              <InputLabel>Terminación</InputLabel>
              <Select
                value={selectedFinish || ''}
                label='Terminación'
                onChange={(e) => setSelectedFinish(e.target.value)}
              >
                {selectedColor &&
                  colors[selectedColor].finishes.map((finish) => (
                    <MenuItem key={finish} value={finish}>
                      {finish}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {/* CANTIDAD Y CARRITO */}
          <Box mt={4}>
            {isOutOfStock ? (
              <Button variant='contained' color='inherit' disabled fullWidth>
                Agotado
              </Button>
            ) : (
              <Stack direction='row' spacing={2} alignItems='center'>
                {/* Selector de cantidad */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    height: 48,
                  }}
                >
                  <IconButton
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    sx={{ borderRadius: 0 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 40,
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={handleIncrement}
                    disabled={
                      selectedVariant
                        ? quantity >= selectedVariant.stock
                        : false
                    }
                    sx={{ borderRadius: 0 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Botón agregar al carrito */}
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      <ProductDescription content={product.description as any} />
    </Box>
  );
};

export default ProductPage;

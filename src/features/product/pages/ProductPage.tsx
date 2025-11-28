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
  Chip,
  ListItemText,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface SelectedOptions {
  color: string | null;
  storage: string | null;
  finish: string | null;
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, isError } = useProduct(slug || '');
  const addItem = useCartStore((state) => state.addItem);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    color: null,
    storage: null,
    finish: null,
  });
  const [quantity, setQuantity] = useState(1);

  // Detectar qué atributos están presentes
  const attributesPresent = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      return { hasColor: false, hasStorage: false, hasFinish: false };
    }

    const hasColor = product.variants.some((v) => v.color_name);
    const hasStorage = product.variants.some((v) => v.storage);
    const hasFinish = product.variants.some((v) => v.finish);

    return { hasColor, hasStorage, hasFinish };
  }, [product?.variants]);

  // Obtener TODAS las opciones disponibles
  const allOptions = useMemo(() => {
    if (!product?.variants) {
      return {
        colorOptions: [],
        storageOptions: [],
        finishOptions: [],
      };
    }

    const colorSet = new Map<string, { name: string; hex: string }>();
    const storageSet = new Set<string>();
    const finishSet = new Set<string | null>();

    product.variants.forEach((v) => {
      if (v.color_name && v.color) {
        colorSet.set(v.color_name, { name: v.color_name, hex: v.color });
      }
      if (v.storage) storageSet.add(v.storage.trim());
      finishSet.add(v.finish);
    });

    return {
      colorOptions: Array.from(colorSet.values()),
      storageOptions: Array.from(storageSet),
      finishOptions: Array.from(finishSet).sort((a, b) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return a.localeCompare(b);
      }),
    };
  }, [product?.variants]);

  // Verificar si una combinación de opciones es válida
  const isOptionValid = useMemo(() => {
    if (!product?.variants) {
      return {
        color: () => false,
        storage: () => false,
        finish: () => false,
      };
    }

    return {
      color: (colorName: string) => {
        return product.variants.some((v) => {
          if (v.color_name !== colorName) return false;
          if (selectedOptions.storage && v.storage?.trim() !== selectedOptions.storage)
            return false;
          if (selectedOptions.finish && v.finish !== selectedOptions.finish)
            return false;
          return true;
        });
      },
      storage: (storageName: string) => {
        return product.variants.some((v) => {
          if (v.storage?.trim() !== storageName) return false;
          if (selectedOptions.color && v.color_name !== selectedOptions.color)
            return false;
          if (selectedOptions.finish && v.finish !== selectedOptions.finish)
            return false;
          return true;
        });
      },
      finish: (finishName: string | null) => {
        return product.variants.some((v) => {
          if (v.finish !== finishName) return false;
          if (selectedOptions.color && v.color_name !== selectedOptions.color)
            return false;
          if (selectedOptions.storage && v.storage?.trim() !== selectedOptions.storage)
            return false;
          return true;
        });
      },
    };
  }, [product?.variants, selectedOptions]);

  // Encontrar la variante exacta
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;

    const hasSelectedColor = attributesPresent.hasColor && selectedOptions.color !== null;
    const hasSelectedStorage = attributesPresent.hasStorage && selectedOptions.storage !== null;
    const hasSelectedFinish = attributesPresent.hasFinish && selectedOptions.finish !== null;

    if (attributesPresent.hasColor && !hasSelectedColor) return null;
    if (attributesPresent.hasStorage && !hasSelectedStorage) return null;
    if (attributesPresent.hasFinish && !hasSelectedFinish) return null;

    return (
      product.variants.find((v) => {
        if (attributesPresent.hasColor && v.color_name !== selectedOptions.color)
          return false;
        if (attributesPresent.hasStorage && v.storage?.trim() !== selectedOptions.storage)
          return false;
        if (attributesPresent.hasFinish && v.finish !== selectedOptions.finish)
          return false;
        return true;
      }) || null
    );
  }, [product?.variants, selectedOptions, attributesPresent]);

  // Cambiar una opción
  const handleOptionChange = (field: keyof SelectedOptions, value: string | null) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  // Seleccionar primera opción por defecto cuando el producto carga
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const newOptions: SelectedOptions = {
        color: attributesPresent.hasColor ? (firstVariant.color_name || null) : null,
        storage: attributesPresent.hasStorage ? (firstVariant.storage || null) : null,
        finish: attributesPresent.hasFinish ? (firstVariant.finish || null) : null,
      };

      setSelectedOptions(newOptions);
    }
  }, [product?.variants, attributesPresent]);

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

    addItem({
      id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      image: product.images?.[0] ?? "",
      quantity,
      variant: {
        color: selectedVariant.color_name,
        storage: selectedVariant.storage,
        finish: selectedVariant.finish,
        colorHex: selectedVariant.color,
        stock: selectedVariant.stock,
      },
    });

    toast.success('Producto agregado al carrito', { position: 'bottom-right' });
    setQuantity(1);
  };

  if (isLoading) return <Loader />;
  if (!product || isError)
    return <Typography variant='h6'>Producto no encontrado</Typography>;

  const unitPrice = selectedVariant?.price ?? 0;
  const totalPrice = unitPrice * quantity;

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
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant='h4' fontWeight={700} gutterBottom>
            {product.name}
          </Typography>

          <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
            <Typography variant='h5' color='primary' fontWeight={600}>
              {formatPrice(unitPrice)}
            </Typography>
            {isOutOfStock && <Tag contentTag='agotado' />}
          </Stack>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Marca: {product.brand}
          </Typography>

          {/* Opciones */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant='subtitle2' fontWeight={600}>
                Opciones
              </Typography>
              {(selectedOptions.color || selectedOptions.storage || selectedOptions.finish) && (
                <Button
                  size='small'
                  onClick={() =>
                    setSelectedOptions({
                      color: null,
                      storage: null,
                      finish: null,
                    })
                  }
                  sx={{ textTransform: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  Limpiar
                </Button>
              )}
            </Box>

            {/* Color */}
            {attributesPresent.hasColor && allOptions.colorOptions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='color-label'>Color</InputLabel>
                  <Select
                    labelId='color-label'
                    value={selectedOptions.color || ''}
                    label='Color'
                    onChange={(e) => handleOptionChange('color', e.target.value || null)}
                  >
                    <MenuItem value=''>
                      <em>Seleccionar color</em>
                    </MenuItem>
                    {allOptions.colorOptions.map((color) => {
                      const isValid = isOptionValid.color(color.name);
                      return (
                        <MenuItem
                          key={color.name}
                          value={color.name}
                          disabled={!isValid}
                          sx={{
                            opacity: isValid ? 1 : 0.5,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                backgroundColor: color.hex,
                                border: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                opacity: isValid ? 1 : 0.5,
                                flexShrink: 0,
                              }}
                            />
                            <ListItemText
                              primary={color.name}
                              secondary={!isValid ? 'No disponible' : undefined}
                            />
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Storage */}
            {attributesPresent.hasStorage && allOptions.storageOptions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Presentación</InputLabel>
                  <Select
                    value={selectedOptions.storage || ''}
                    label='Presentación'
                    onChange={(e) => handleOptionChange('storage', e.target.value || null)}
                  >
                    <MenuItem value=''>
                      <em>Seleccionar presentación</em>
                    </MenuItem>
                    {allOptions.storageOptions.map((storage) => {
                      const isValid = isOptionValid.storage(storage);
                      return (
                        <MenuItem
                          key={storage}
                          value={storage}
                          disabled={!isValid}
                          sx={{ opacity: isValid ? 1 : 0.5 }}
                        >
                          <ListItemText
                            primary={storage}
                            secondary={!isValid ? 'No disponible' : undefined}
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Finish */}
            {attributesPresent.hasFinish && allOptions.finishOptions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Terminación</InputLabel>
                  <Select
                    value={selectedOptions.finish ?? ''}
                    label='Terminación'
                    onChange={(e) => handleOptionChange('finish', e.target.value === '' ? null : e.target.value)}
                  >
                    <MenuItem value=''>
                      <em>Seleccionar terminación</em>
                    </MenuItem>
                    {allOptions.finishOptions.map((finish) => {
                      const isValid = isOptionValid.finish(finish);
                      return (
                        <MenuItem
                          key={finish ?? 'none'}
                          value={finish ?? ''}
                          disabled={!isValid}
                          sx={{ opacity: isValid ? 1 : 0.5 }}
                        >
                          <ListItemText
                            primary={finish || 'Sin terminación'}
                            secondary={!isValid ? 'No disponible' : undefined}
                          />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          {/* Variante seleccionada */}
          {selectedVariant && (
            <Box sx={{ mb: 3 }}>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
                Variante seleccionada:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {attributesPresent.hasColor && selectedVariant.color_name && (
                  <Chip
                    label={selectedVariant.color_name}
                    size='small'
                    avatar={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: selectedVariant.color,
                          ml: 0.5,
                        }}
                      />
                    }
                  />
                )}
                {attributesPresent.hasStorage && selectedVariant.storage && (
                  <Chip label={selectedVariant.storage} size='small' />
                )}
                {attributesPresent.hasFinish && selectedVariant.finish && (
                  <Chip label={selectedVariant.finish} size='small' />
                )}
              </Box>
            </Box>
          )}

          {/* Alertas */}
          {!selectedVariant && (selectedOptions.color || selectedOptions.storage || selectedOptions.finish) && (
            <Alert severity='warning' sx={{ mb: 2 }}>
              Combinación no disponible
            </Alert>
          )}

          {selectedVariant && selectedVariant.stock === 0 && (
            <Alert severity='error' sx={{ mb: 2 }}>
              Agotado
            </Alert>
          )}

          {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 10 && (
            <Alert severity={selectedVariant.stock <= 3 ? 'warning' : 'info'} sx={{ mb: 2 }}>
              {selectedVariant.stock <= 3
                ? `¡Últimas ${selectedVariant.stock} unidades!`
                : `Solo ${selectedVariant.stock} disponibles`}
            </Alert>
          )}

          {/* Cantidad y carrito */}
          <Stack spacing={2}>
            {/* Selector de cantidad */}
            <Box>
              <Typography variant='caption' fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                Cantidad
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size='small'
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || !selectedVariant}
                  sx={{ padding: '4px' }}
                >
                  <RemoveIcon />
                </IconButton>

                <Box
                  sx={{
                    minWidth: 50,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    py: 0.5,
                    px: 1,
                  }}
                >
                  <Typography fontWeight={500}>{quantity}</Typography>
                </Box>

                <IconButton
                  size='small'
                  onClick={handleIncrement}
                  disabled={!selectedVariant || quantity >= (selectedVariant?.stock || 0)}
                  sx={{ padding: '4px' }}
                >
                  <AddIcon />
                </IconButton>

                {selectedVariant && (
                  <Typography variant='caption' color='text.secondary' sx={{ ml: 'auto' }}>
                    {selectedVariant.stock} disponibles
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Precios */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Unitario
                </Typography>
                <Typography color='primary' fontWeight={600}>
                  {formatPrice(unitPrice)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant='caption' color='text.secondary'>
                  Total
                </Typography>
                <Typography variant='h6' fontWeight={700}>
                  {formatPrice(totalPrice)}
                </Typography>
              </Box>
            </Box>

            {/* Botón agregar al carrito */}
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock}
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
        </Box>
      </Box>

      <ProductDescription content={product.description as any} />
    </Box>
  );
};

export default ProductPage;
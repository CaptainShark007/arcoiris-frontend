import { useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProduct';
import { GridImages, ProductDescription } from '../components';
import { formatPrice } from '@/helpers';
import { Tag, Loader, SeoHead } from '@/shared/components';
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
  Divider,
  Paper,
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

  // Esto maneja el error de carga de imagen
  const [imageError, setImageError] = useState(false);

  const getProductImage = () => {
    if (imageError || !product?.images[0]) {
      return "https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png";
    }
    return product.images[0];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    color: null,
    storage: null,
    finish: null,
  });
  const [quantity, setQuantity] = useState(1);

  const attributesPresent = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      return { hasColor: false, hasStorage: false, hasFinish: false };
    }

    const hasColor = product.variants.some((v) => v.color_name);
    const hasStorage = product.variants.some((v) => v.storage);
    const hasFinish = product.variants.some((v) => v.finish);

    return { hasColor, hasStorage, hasFinish };
  }, [product?.variants]);

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

  const handleOptionChange = (field: keyof SelectedOptions, value: string | null) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

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
      image: getProductImage(),
      quantity,
      variant: {
        color: selectedVariant.color_name,
        storage: selectedVariant.storage,
        finish: selectedVariant.finish,
        colorHex: selectedVariant.color,
        stock: selectedVariant.stock,
      },
    });

    toast.success('Producto agregado al carrito', { 
      position: 'top-right',
      style: {
        marginTop: '50px',
      }
     });
    setQuantity(1);
  };

  //if (isLoading) return <Loader />;
  // Si está cargando, mostramos un título temporal
  if (isLoading) {
    return (
      <>
        <SeoHead 
          title="Cargando..." 
          description="Buscando producto..." 
        />
        <Loader />
      </>
    );
  }
  /* if (!product || isError)
    return <Typography variant='h6'>Producto no encontrado</Typography>; */
  // Si hay error
  if (!product || isError) {
    return (
      <>
        <SeoHead title="Producto no encontrado" description="Error" />
        <Typography variant='h6'>Producto no encontrado</Typography>
      </>
    );
  }

  const unitPrice = selectedVariant?.price ?? 0;
  const totalPrice = unitPrice * quantity;

  return (
    <>
    <SeoHead 
      title={product.name}
      description={product.description ? (typeof product.description === 'string' ? product.description : '') : 'Producto disponible en Arcoiris Tienda'}
      image={getProductImage()}
    />
      <Box sx={{ p: { xs: 1.5, sm: 2, md: 4 }, maxWidth: 1400, margin: '0 auto' }}>
        {/* Sección principal: Imagen y detalles */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          {/* Columna de imágenes */}
          <Box sx={{ display: 'flex', justifyContent: 'center', position: { xs: 'relative', md: 'sticky' }, top: { md: 20 } }}>
            <GridImages images={product.images} onImageError={handleImageError} />
          </Box>

          {/* Columna de detalles */}
          <Box>
            {/* Encabezado del producto */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Typography fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' }, lineHeight: 1.3 }}>
                {product.name}
              </Typography>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
                Marca: <Typography component='span' fontWeight={600}>{product.brand}</Typography>
              </Typography>

              {/* Precio y estado */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, color: 'primary.main' }}>
                  {formatPrice(unitPrice)}
                </Typography>
                {isOutOfStock && <Tag contentTag='agotado' />}
              </Box>
            </Box>

            <Divider sx={{ my: { xs: 1.5, md: 2 } }} />

            {/* Opciones del producto */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
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
                    sx={{ textTransform: 'none', fontSize: { xs: '0.75rem', md: '0.875rem' }, color: 'text.secondary' }}
                  >
                    Limpiar
                  </Button>
                )}
              </Box>

              {/* Color */}
              {attributesPresent.hasColor && allOptions.colorOptions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='color-label' sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>Color</InputLabel>
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
                            sx={{ opacity: isValid ? 1 : 0.5 }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth size='small'>
                    <InputLabel sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>Presentación</InputLabel>
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
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth size='small'>
                    <InputLabel sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>Terminación</InputLabel>
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
              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary' fontWeight={600} sx={{ display: 'block', mb: 1 }}>
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
              <Alert severity='warning' sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                Combinación no disponible
              </Alert>
            )}

            {selectedVariant && selectedVariant.stock === 0 && (
              <Alert severity='error' sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                Agotado
              </Alert>
            )}

            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 10 && (
              <Alert severity={selectedVariant.stock <= 3 ? 'warning' : 'info'} sx={{ mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                {selectedVariant.stock <= 3
                  ? `¡Últimas ${selectedVariant.stock} unidades!`
                  : `Solo ${selectedVariant.stock} disponibles`}
              </Alert>
            )}

            <Divider sx={{ my: { xs: 1.5, md: 2.5 } }} />

            {/* Cantidad y precios */}
            <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 2, md: 3 } }}>
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
                    sx={{ padding: '6px', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                  >
                    <RemoveIcon fontSize='small' />
                  </IconButton>

                  <Box
                    sx={{
                      minWidth: 50,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      py: 0.75,
                      px: 1.5,
                    }}
                  >
                    <Typography fontWeight={600} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      {quantity}
                    </Typography>
                  </Box>

                  <IconButton
                    size='small'
                    onClick={handleIncrement}
                    disabled={!selectedVariant || quantity >= (selectedVariant?.stock || 0)}
                    sx={{ padding: '6px', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                  >
                    <AddIcon fontSize='small' />
                  </IconButton>

                  {selectedVariant && (
                    <Typography variant='caption' color='text.secondary' sx={{ ml: 'auto', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      {selectedVariant.stock} disponibles
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Precios */}
              <Paper variant='outlined' sx={{ p: { xs: 1.5, md: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant='caption' color='text.secondary' sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Unitario
                    </Typography>
                    <Typography color='primary' fontWeight={700} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      {formatPrice(unitPrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant='caption' color='text.secondary' sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Total
                    </Typography>
                    <Typography fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '1.5rem' } }}>
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Botón agregar al carrito */}
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={handleAddToCart}
                disabled={!selectedVariant || isOutOfStock}
                sx={{
                  height: { xs: 44, md: 48 },
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.95rem', md: '1rem' },
                }}
              >
                {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
              </Button>
            </Stack>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Paper variant='outlined' sx={{ p: { xs: 1.5, md: 2.5 }, bgcolor: 'background.paper' }}>
                <Typography fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, mb: 1.5 }}>
                  Características principales
                </Typography>
                <Stack spacing={1}>
                  {product.features.map((feature: string, idx: number) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: '0.875rem', md: '0.95rem' } }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, md: 4 } }} />

        {/* Descripción del producto */}
        <Box sx={{ mb: 2 }}>
          <ProductDescription content={product.description as any} />
        </Box>
      </Box>
    </>
  );
};

export default ProductPage;
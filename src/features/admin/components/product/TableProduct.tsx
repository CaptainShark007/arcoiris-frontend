import React from 'react';
import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  TableContainer,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as RouterLink } from 'react-router-dom';
import { CellTableProduct } from './CellTableProduct';
import { formatDate, formatPrice } from '@/helpers';
import { DeleteProductModal, Loader, Pagination } from '@shared/components';
import { useCategories } from '@features/shop/hooks/products/useCategories';
import { useDeleteProduct, useProducts, useUpdateProductCategory } from '@features/admin/hooks';

const tableHeaders = {
  desktop: ['', 'Nombre', 'Variante', 'Precio', 'Categoría', 'Stock', 'Fecha', ''],
  mobile: ['Producto', 'Detalles', 'Acciones']
};

export const TableProduct = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
    variantsCount: number;
    imagesCount: number;
  } | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: number;
  }>({});
  const [page, setPage] = useState(1);

  const { products, isLoading, totalProducts } = useProducts({
    page,
  });

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const { mutate: updateProductCategory, isPending: isUpdatingCategory } = useUpdateProductCategory();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuIndex(null);
  };

  const handleVariantChange = (productId: string, variantIndex: number) => {
    setSelectedVariants({
      ...selectedVariants,
      [productId]: variantIndex,
    });
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete({
      id: product.id,
      name: product.name,
      variantsCount: product.variants.length,
      imagesCount: product.images.length,
    });
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCategoryChange = (product: any, newCategory: any) => {
    if (newCategory) {
      updateProductCategory({
        productId: product.id,
        categoryId: newCategory.id,
      });
    }
  };

  const renderMobileView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#F9FAFB', mb: 2 }}>
      {products?.map((product, index) => {
        const selectedVariantIndex = selectedVariants[product.id] ?? 0;
        const selectedVariant = product.variants[selectedVariantIndex];
        const selectedCategory = categories.find((cat) => cat.id === product.category_id);

        return (
          <Card key={index} sx={{ p: 2, border: '1px solid #E5E7EB', bgcolor: '#F9FAFB', boxShadow: 'none' }}>
            {/* Imagen y nombre */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
              <Box
                component="img"
                src={
                  product.images[0] ||
                  'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'
                }
                alt="Imagen Product"
                loading="lazy"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, wordBreak: 'break-word' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {formatPrice(selectedVariant.price)}
                </Typography>
              </Box>
            </Box>

            {/* Detalles */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
              {/* Variante */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Variante
                </Typography>
                <Select
                  value={selectedVariantIndex}
                  onChange={(e) => handleVariantChange(product.id, Number(e.target.value))}
                  size="small"
                  fullWidth
                  sx={{ fontSize: '0.8rem' }}
                >
                  {product.variants.map((variant, variantIndex) => {
                    const variantLabel = [variant.color_name, variant.storage, variant.finish]
                      .filter(Boolean)
                      .join(' • ');
                    return (
                      <MenuItem key={variant.id} value={variantIndex}>
                        {variantLabel}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>

              {/* Categoría */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Categoría
                </Typography>
                <Autocomplete
                  options={[{ id: 'clear', name: 'Sin categoría' }, ...categories]}
                  getOptionLabel={(option) => (option.id === 'clear' ? 'Sin categoría' : option.name)}
                  value={selectedCategory || null}
                  onChange={(_event, newValue) => {
                    if (newValue?.id === 'clear') {
                      updateProductCategory({
                        productId: product.id,
                        categoryId: null as any,
                      });
                    } else if (newValue) {
                      handleCategoryChange(product, newValue);
                    }
                  }}
                  loading={isCategoriesLoading || isUpdatingCategory}
                  size="small"
                  fullWidth
                  noOptionsText="No hay categorías"
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Asignar categoría" size="small" />
                  )}
                />
              </Box>

              {/* Stock y Fecha */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    Stock
                  </Typography>
                  <Typography variant="body2">{selectedVariant.stock.toString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    Fecha
                  </Typography>
                  <Typography variant="body2">{formatDate(product.created_at)}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Acciones */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                component={RouterLink}
                to={`/panel/productos/editar/${product.slug}`}
                size="small"
                variant="contained"
                sx={{
                  backgroundColor: '#0007d7ff',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  py: 0.75,
                  px: 1.5,
                  '&:hover': { backgroundColor: '#0005a0ff' },
                }}
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDeleteProduct(product)}
                size="small"
                color="error"
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  py: 0.75,
                  px: 1.5,
                }}
              >
                Eliminar
              </Button>
            </Box>
          </Card>
        );
      })}
    </Box>
  );

  const renderDesktopView = () => (
    <TableContainer
      sx={{
        borderRadius: 1,
        overflow: 'auto',
        mb: 2,
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ backgroundColor: '#F9FAFB', position: 'sticky', top: 0, zIndex: 10 }}>
          <TableRow>
            {tableHeaders.desktop.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  height: 48,
                  px: { md: 1.5, lg: 2 },
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: { md: '0.8rem', lg: '0.875rem' },
                  borderBottom: '2px solid #E5E7EB',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#F9FAFB',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((product, index) => {
            const selectedVariantIndex = selectedVariants[product.id] ?? 0;
            const selectedVariant = product.variants[selectedVariantIndex];
            const selectedCategory = categories.find((cat) => cat.id === product.category_id);
            const categoryOptions = [{ id: 'clear', name: 'Sin categoría' }, ...categories];

            return (
              <TableRow key={index} sx={{ borderBottom: '1px solid #F9FAFB' }}>
                <TableCell sx={{ p: { md: 1, lg: 1.5 }, width: '70px' }}>
                  <Box
                    component="img"
                    src={
                      product.images[0] ||
                      'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'
                    }
                    alt="Imagen Product"
                    loading="lazy"
                    sx={{
                      width: { md: 50, lg: 64 },
                      height: { md: 50, lg: 64 },
                      borderRadius: 1,
                      objectFit: 'contain',
                    }}
                  />
                </TableCell>
                <CellTableProduct content={product.name} />
                <TableCell sx={{ fontWeight: 500, minWidth: 140, px: { md: 1, lg: 2 } }}>
                  <Select
                    value={selectedVariantIndex}
                    onChange={(e) => handleVariantChange(product.id, Number(e.target.value))}
                    size="small"
                    fullWidth
                    sx={{ fontSize: { md: '0.8rem', lg: '0.875rem' } }}
                  >
                    {product.variants.map((variant, variantIndex) => {
                      const variantLabel = [variant.color_name, variant.storage, variant.finish]
                        .filter(Boolean)
                        .join(' • ');
                      return (
                        <MenuItem key={variant.id} value={variantIndex}>
                          {variantLabel}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </TableCell>
                <CellTableProduct content={formatPrice(selectedVariant.price)} sx={{ fontWeight: 'bold' }} />
                <TableCell sx={{ fontWeight: 500, minWidth: 180, px: { md: 1, lg: 2 } }}>
                  <Autocomplete
                    options={categoryOptions}
                    getOptionLabel={(option) => (option.id === 'clear' ? 'Sin categoría' : option.name)}
                    value={selectedCategory || null}
                    onChange={(_event, newValue) => {
                      if (newValue?.id === 'clear') {
                        updateProductCategory({
                          productId: product.id,
                          categoryId: null as any,
                        });
                      } else if (newValue) {
                        handleCategoryChange(product, newValue);
                      }
                    }}
                    loading={isCategoriesLoading || isUpdatingCategory}
                    size="small"
                    fullWidth
                    noOptionsText="No hay categorías"
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: { md: '0.8rem', lg: '0.875rem' } } }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Asignar categoría" size="small" />
                    )}
                  />
                </TableCell>
                <CellTableProduct content={selectedVariant.stock.toString()} />
                <CellTableProduct content={formatDate(product.created_at)} />
                <TableCell sx={{ position: 'relative', p: { md: 0.5, lg: 1 }, width: '50px' }}>
                  <Button
                    onClick={(e) => handleMenuOpen(e, index)}
                    sx={{ color: '#1e293b', minWidth: 'auto', p: 0.5 }}
                  >
                    <MoreHorizIcon sx={{ fontSize: { md: '1.2rem', lg: '1.5rem' } }} />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenuIndex === index}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      component={RouterLink}
                      to={`/panel/productos/editar/${product.slug}`}
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      Editar
                      <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteProduct(product)}
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: '#dc2626',
                      }}
                    >
                      Eliminar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (!products || isLoading || !totalProducts || isPending) return <Loader />;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        p: { xs: 1.5, sm: 2, md: 2.5 },
        bgcolor: '#F9FAFB', // F9FAFB
        mb: 4,
        boxShadow: 'none',
        border: '1px solid #E5E7EB',
        borderRadius: 1,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
        Gestión de Productos
      </Typography>

      {isMobile ? renderMobileView() : renderDesktopView()}

      <Pagination page={page} setPage={setPage} totalItems={totalProducts} />

      {productToDelete && (
        <DeleteProductModal
          open={deleteModalOpen}
          productName={productToDelete.name}
          variantsCount={productToDelete.variantsCount}
          imagesCount={productToDelete.imagesCount}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          isLoading={isPending}
        />
      )}
    </Card>
  );
};
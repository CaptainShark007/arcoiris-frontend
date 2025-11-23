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
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as RouterLink } from 'react-router-dom';
import { CellTableProduct } from './CellTableProduct';
import { formatDate, formatPrice } from '@/helpers';
import { DeleteProductModal, Loader, Pagination } from '@shared/components';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct, useUpdateProductCategory } from '../hooks';
import { useCategories } from '@features/shop/hooks/products/useCategories';

const tableHeaders = [
  '',
  'Nombre',
  'Variante',
  'Precio',
  'Categoría',
  'Stock',
  'Fecha de creación',
  '',
];

export const TableProduct = () => {

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

  /* const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    handleMenuClose();
  }; */

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

  if (!products || isLoading || !totalProducts || isPending) return <Loader />;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5, bgcolor: 'white', mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        Gestión de Productos
      </Typography>

      {/* Tabla */}
      <Box sx={{ width: '100%', overflow: 'auto', mb: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ borderBottom: '1px solid #e5e7eb' }}>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    height: 48,
                    px: 2,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              const selectedVariantIndex = selectedVariants[product.id] ?? 0;
              const selectedVariant = product.variants[selectedVariantIndex];
              const selectedCategory = categories.find((cat) => cat.id === product.category_id);

              const categoryOptions = [
                { id: 'clear', name: 'Sin categoría' },
                ...categories,
              ]

              return (
                <TableRow key={index} sx={{ borderBottom: '1px solid #f3f4f6' }}>
                  <TableCell sx={{ p: 2 }}>
                    <Box
                      component="img"
                      src={product.images[0] || 'https://ui.shadcn.com/placeholder.svg'}
                      alt="Imagen Product"
                      loading="lazy"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 1,
                        objectFit: 'contain',
                      }}
                    />
                  </TableCell>
                  <CellTableProduct content={product.name} />
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '-0.025em' }}>
                    <Select
                      value={selectedVariantIndex}
                      onChange={e => handleVariantChange(product.id, Number(e.target.value))}
                      size="small"
                      fullWidth
                      sx={{
                        fontSize: '0.875rem',
                      }}
                    >
                      {/* {product.variants.map((variant, variantIndex) => (
                        <MenuItem key={variant.id} value={variantIndex}>
                          {variant.color_name} - {variant.storage} - {variant.finish}
                        </MenuItem>
                      ))} */}
                      {product.variants.map((variant, variantIndex) => {
                        const variantLabel = [
                          variant.color_name,
                          variant.storage,
                          variant.finish,
                        ]
                          .filter(Boolean) // Filtra null, undefined, string vacío
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
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '-0.025em', minWidth: 200 }}>
                    <Autocomplete
                      options={categoryOptions}
                      getOptionLabel={(option) => {
                        if (option.id === 'clear') return 'Sin categoría';
                        return option.name;
                      }}
                      value={selectedCategory || null}
                      //onChange={(event, newValue) => handleCategoryChange(product, newValue)}
                      onChange={(event, newValue) => {
                        if (newValue?.id === 'clear') {
                          // Eliminar categoría
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Asignar categoría"
                          size="small"
                        />
                      )}
                    />
                  </TableCell>
                  <CellTableProduct content={selectedVariant.stock.toString()} />
                  <CellTableProduct content={formatDate(product.created_at)} />
                  <TableCell sx={{ position: 'relative' }}>
                    <Button
                      onClick={(e) => handleMenuOpen(e, index)}
                      sx={{ color: '#1e293b', minWidth: 'auto', p: 0 }}
                    >
                      <MoreHorizIcon />
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
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#374151',
                        }}
                      >
                        Editar
                        <OpenInNewIcon sx={{ fontSize: '0.875rem' }} />
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteProduct(product)}
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#374151',
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
      </Box>

      {/* Controles de paginación */}
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
            setProductToDelete(null)
          }}
          isLoading={isPending}
        />
      )}

    </Card>
  );
};
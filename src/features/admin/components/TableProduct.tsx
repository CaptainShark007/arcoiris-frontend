import React from 'react';
import { useState } from 'react';
import {
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
  Typography,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as RouterLink } from 'react-router-dom';
import { CellTableProduct } from './CellTableProduct';
import { formatDate, formatPrice } from '@/helpers';
import { Loader, Pagination } from '@shared/components';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks';

const tableHeaders = [
  '',
  'Nombre',
  'Variante',
  'Precio',
  'Stock',
  'Fecha de creación',
  '',
];

export const TableProduct = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: number;
  }>({});
  const [page, setPage] = useState(1);

  const { products, isLoading, totalProducts } = useProducts({
    page,
  });

   const { mutate: deleteProduct, isPending } = useDeleteProduct();

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

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    handleMenuClose();
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
                      {product.variants.map((variant, variantIndex) => (
                        <option key={variant.id} value={variantIndex}>
                          {variant.color_name} - {variant.storage} - {variant.finish}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <CellTableProduct content={formatPrice(selectedVariant.price)} />
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
                        to={`/dashboard/productos/editar/${product.slug}`}
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
                        onClick={() => handleDeleteProduct(product.id)}
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
    </Card>
  );
};
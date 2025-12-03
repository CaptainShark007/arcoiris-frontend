import React from 'react';
import { useState, useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
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
  Tooltip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';

import { CellTableProduct } from './CellTableProduct';
import { formatDate, formatPrice } from '@/helpers';
import { Loader } from '@shared/components';
import { useCategories } from '@features/shop/hooks/products/useCategories';
import {
  useProducts,
  useToggleProduct,
  useUpdateProductCategory,
} from '@features/admin/hooks';
import CustomPagination from '@shared/components/CustomPagination';
import { OptimisticSwitch } from './OptimisticSwitch';

const tableHeaders = {
  desktop: [
    '',
    'Nombre',
    'Variante',
    'Precio',
    'Categoría',
    'Stock',
    'Fecha',
    '',
  ],
  mobile: ['Producto', 'Detalles', 'Acciones'],
};

export const TableProduct = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // --- ESTADOS DEL BUSCADOR ---
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // --- LÓGICA DE DEBOUNCE ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      // Al buscar, siempre reiniciamos a la página 0 para evitar estar en una pag vacía
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: number;
  }>({});

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Hook de Productos (ahora recibe search)
  const { products, isLoading, totalProducts } = useProducts({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearch,
  });

  // Categorias y Mutaciones
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { mutate: updateProductCategory, isPending: isUpdatingCategory } =
    useUpdateProductCategory();
  const { mutate: toggleProduct } = useToggleProduct();

  // Manejo de errores de imagen
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getProductImage = (productId: string, images: any[]) => {
    if (imageErrors[productId] || !images?.[0]) {
      return 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';
    }
    return images[0];
  };

  const handleVariantChange = (productId: string, variantIndex: number) => {
    setSelectedVariants({
      ...selectedVariants,
      [productId]: variantIndex,
    });
  };

  const handleCategoryChange = (product: any, newCategory: any) => {
    if (newCategory) {
      updateProductCategory({
        productId: product.id,
        categoryId: newCategory.id,
      });
    }
  };

  // Pagination Handlers
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  // --- VISTA MÓVIL ---
  const renderMobileView = () => {
    if (products?.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No se encontraron productos</Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: '#F9FAFB',
          mb: 2,
        }}
      >
        {products?.map((product, index) => {
          const selectedVariantIndex = selectedVariants[product.id] ?? 0;
          const selectedVariant = product.variants[selectedVariantIndex];
          const selectedCategory = categories.find(
            (cat) => cat.id === product.category_id
          );

          return (
            <Card
              key={index}
              sx={{
                p: 2,
                border: '1px solid #E5E7EB',
                boxShadow: 'none',
                transition: 'all 200ms ease',
              }}
            >
              {/* Imagen y nombre */}
              <Box
                sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}
              >
                <Box
                  component='img'
                  src={getProductImage(product.id, product.images)}
                  alt='Imagen Product'
                  loading='lazy'
                  onError={() => handleImageError(product.id)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant='subtitle2'
                    sx={{ fontWeight: 600, mb: 0.5, wordBreak: 'break-word' }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.secondary', fontWeight: 500 }}
                  >
                    {formatPrice(selectedVariant.price)}
                  </Typography>
                </Box>
              </Box>

              {/* Detalles */}
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}
              >
                {/* Variante */}
                <Box>
                  <Typography
                    variant='caption'
                    sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                  >
                    Variante
                  </Typography>
                  <Select
                    value={selectedVariantIndex}
                    onChange={(e) =>
                      handleVariantChange(product.id, Number(e.target.value))
                    }
                    size='small'
                    fullWidth
                    sx={{ fontSize: '0.8rem' }}
                  >
                    {product.variants.map((variant, variantIndex) => {
                      const variantLabel = [
                        variant.color_name,
                        variant.storage,
                        variant.finish,
                      ]
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
                  <Typography
                    variant='caption'
                    sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                  >
                    Categoría
                  </Typography>
                  <Autocomplete
                    options={[
                      { id: 'clear', name: 'Sin categoría' },
                      ...categories,
                    ]}
                    getOptionLabel={(option) =>
                      option.id === 'clear' ? 'Sin categoría' : option.name
                    }
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
                    size='small'
                    fullWidth
                    noOptionsText='No hay categorías'
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder='Asignar categoría'
                        size='small'
                      />
                    )}
                  />
                </Box>

                {/* Stock y Fecha */}
                <Box
                  sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
                >
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{ fontWeight: 600, display: 'block' }}
                    >
                      Stock
                    </Typography>
                    <Typography variant='body2'>
                      {selectedVariant.stock.toString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{ fontWeight: 600, display: 'block' }}
                    >
                      Fecha
                    </Typography>
                    <Typography variant='body2'>
                      {formatDate(product.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Acciones */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Estado:</Typography>
                  <OptimisticSwitch 
                    product={product} 
                    onToggle={toggleProduct} 
                  />
                </Box>
                <Button
                  component={RouterLink}
                  to={`/panel/productos/editar/${product.slug}`}
                  size='small'
                  variant='contained'
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
              </Box>
            </Card>
          );
        })}
      </Box>
    );
  };

  // --- VISTA DESKTOP ---
  const renderDesktopView = () => (
    <TableContainer
      sx={{
        borderRadius: 1,
        overflow: 'auto',
        mb: 2,
        '&::-webkit-scrollbar': { height: '8px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
        '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' },
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead
          sx={{
            backgroundColor: '#F9FAFB',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
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
          {products?.length === 0 ? (
             <TableRow>
               <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                 <Typography variant="body2" color="text.secondary">
                   No se encontraron productos que coincidan con la búsqueda.
                 </Typography>
               </TableCell>
             </TableRow>
          ) : (
            products?.map((product, index) => {
              const selectedVariantIndex = selectedVariants[product.id] ?? 0;
              const selectedVariant = product.variants[selectedVariantIndex];
              const selectedCategory = categories.find(
                (cat) => cat.id === product.category_id
              );
              const categoryOptions = [
                { id: 'clear', name: 'Sin categoría' },
                ...categories,
              ];

              return (
                <TableRow
                  key={index}
                  sx={{ borderBottom: '1px solid #F9FAFB' }}
                >
                  <TableCell sx={{ p: { md: 1, lg: 1.5 }, width: '70px' }}>
                    <Box
                      component='img'
                      src={getProductImage(product.id, product.images)}
                      alt='Imagen Product'
                      loading='lazy'
                      onError={() => handleImageError(product.id)}
                      sx={{
                        width: { md: 50, lg: 64 },
                        height: { md: 50, lg: 64 },
                        borderRadius: 1,
                        objectFit: 'contain',
                      }}
                    />
                  </TableCell>
                  <CellTableProduct content={product.name} />
                  <TableCell
                    sx={{ fontWeight: 500, minWidth: 140, px: { md: 1, lg: 2 } }}
                  >
                    <Select
                      value={selectedVariantIndex}
                      onChange={(e) =>
                        handleVariantChange(product.id, Number(e.target.value))
                      }
                      size='small'
                      fullWidth
                      sx={{ fontSize: { md: '0.8rem', lg: '0.875rem' } }}
                    >
                      {product.variants.map((variant, variantIndex) => {
                        const variantLabel = [
                          variant.color_name,
                          variant.storage,
                          variant.finish,
                        ]
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
                  <CellTableProduct
                    content={formatPrice(selectedVariant.price)}
                    sx={{ fontWeight: 'bold' }}
                  />
                  <TableCell
                    sx={{ fontWeight: 500, minWidth: 180, px: { md: 1, lg: 2 } }}
                  >
                    <Autocomplete
                      options={categoryOptions}
                      getOptionLabel={(option) =>
                        option.id === 'clear' ? 'Sin categoría' : option.name
                      }
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
                      size='small'
                      fullWidth
                      noOptionsText='No hay categorías'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: { md: '0.8rem', lg: '0.875rem' },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder='Asignar categoría'
                          size='small'
                        />
                      )}
                    />
                  </TableCell>
                  <CellTableProduct content={selectedVariant.stock.toString()} />
                  <CellTableProduct content={formatDate(product.created_at)} />
                  <TableCell
                    sx={{
                      p: { md: 0.5, lg: 1 },
                      width: '120px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OptimisticSwitch 
                        product={product} 
                        onToggle={toggleProduct}
                      />
                      <Tooltip title="Editar detalles">
                        <IconButton
                          component={RouterLink}
                          to={`/panel/productos/editar/${product.slug}`}
                          size="small"
                          sx={{ 
                            color: '#0007d7ff',
                            bgcolor: '#f0f4ff',
                            '&:hover': { bgcolor: '#dbeafe' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // IMPORTANTE: Aquí cambié la condición. 
  // Eliminé "!totalProducts" del chequeo para que no muestre el loader si la búsqueda devuelve 0 resultados.
  if (isLoading) return <Loader />;

  // Calcula el total de páginas para la paginación
  const totalPage = Math.ceil(totalProducts / rowsPerPage);

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: { xs: 1.5, sm: 2, md: 2.5 },
          bgcolor: '#F9FAFB',
          mb: 2,
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
          borderRadius: 1,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* CABECERA CON TÍTULO Y BUSCADOR */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Gestión de Productos
          </Typography>

          <TextField
            placeholder='Buscar producto...'
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ 
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': { borderRadius: 1, bgcolor: 'white' } 
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon color='action' fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={handleClearSearch} edge='end'>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {isMobile ? renderMobileView() : renderDesktopView()}

      </Card>
      
      {/* Solo mostrar paginación si hay productos */}
      {totalProducts > 0 && (
        <Box sx={{ px: { xs: 1, sm: 2 } }}>
          <CustomPagination 
            page={page}
            totalPages={totalPage}
            totalItems={totalProducts}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </>
  );
};
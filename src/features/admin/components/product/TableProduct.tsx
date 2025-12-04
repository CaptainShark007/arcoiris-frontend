import React, { useState, useEffect } from 'react';
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
  Stack,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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
import { ProductStockStatus } from './ProductStockStatus';


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

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryIdFilter, setCategoryIdFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<'newest' | 'oldest' | 'name_asc' | 'name_desc'>('newest');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
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

  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: number }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { products, isLoading, totalProducts } = useProducts({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearch,
    status: statusFilter,
    categoryId: categoryIdFilter === 'all' ? null : categoryIdFilter,
    sortBy: sortFilter,
  });

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { mutate: updateProductCategory, isPending: isUpdatingCategory } = useUpdateProductCategory();
  const { mutate: toggleProduct } = useToggleProduct();
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
    setSelectedVariants({ ...selectedVariants, [productId]: variantIndex });
  };

  const handleCategoryChange = (product: any, newCategory: any) => {
    if (newCategory) {
      updateProductCategory({ productId: product.id, categoryId: newCategory.id });
    }
  };

  const handleChangePage = (newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const handleStatusChange = (e: any) => { setStatusFilter(e.target.value); setPage(0); };
  const handleCategoryFilterChange = (e: any) => { setCategoryIdFilter(e.target.value); setPage(0); };
  const handleSortChange = (e: any) => { setSortFilter(e.target.value); setPage(0); };

  const isDefaultState = 
    searchTerm === '' && 
    statusFilter === 'all' && 
    categoryIdFilter === 'all' && 
    sortFilter === 'newest';

  const handleClearAll = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setCategoryIdFilter('all');
    setSortFilter('newest');
    setPage(0);
  };

  const renderMobileView = () => {
    if (products?.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No se encontraron productos</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#F9FAFB', mb: 2 }}>
        {products?.map((product, index) => {
          const selectedVariantIndex = selectedVariants[product.id] ?? 0;
          const selectedVariant = product.variants[selectedVariantIndex];
          const selectedCategory = categories.find((cat) => cat.id === product.category_id);

          return (
            <Card key={index} sx={{ p: 2, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                <Box
                  component='img'
                  src={getProductImage(product.id, product.images)}
                  loading='lazy'
                  onError={() => handleImageError(product.id)}
                  sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 0.5 }}>{product.name}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {selectedVariant ? formatPrice(selectedVariant.price) : '-'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                <Box>
                  <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>Variante</Typography>
                  <Select
                    value={selectedVariantIndex}
                    onChange={(e) => handleVariantChange(product.id, Number(e.target.value))}
                    size='small'
                    fullWidth
                    sx={{ fontSize: '0.8rem' }}
                  >
                    {product.variants.map((variant, variantIndex) => {
                      const variantLabel = [variant.color_name, variant.storage, variant.finish].filter(Boolean).join(' • ');
                      return <MenuItem key={variant.id} value={variantIndex}>{variantLabel}</MenuItem>;
                    })}
                  </Select>
                </Box>
                <Box>
                    <Typography variant='caption' sx={{ fontWeight: 600, display: 'block' }}>Categoría</Typography>
                     <Typography variant='body2'>{selectedCategory?.name || 'Sin categoría'}</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='caption' sx={{ fontWeight: 600 }}>
                        Stock:
                      </Typography>
                      <ProductStockStatus 
                        currentStock={selectedVariant?.stock ?? 0}
                        allVariants={product.variants}
                        currentVariantId={selectedVariant?.id}
                      />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='caption' sx={{ fontWeight: 600 }}>
                          Fecha:
                      </Typography>
                      <Typography variant='body2'>
                          {formatDate(product.created_at)}
                      </Typography>
                    </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                 <Typography variant="body2" color="text.secondary">Estado:</Typography>
                 <OptimisticSwitch product={product} onToggle={toggleProduct} />
                <Button
                  component={RouterLink}
                  to={`/panel/productos/editar/${product.slug}`}
                  size='small'
                  variant='contained'
                  sx={{ backgroundColor: '#0007d7ff', fontSize: '0.75rem', '&:hover': { backgroundColor: '#0005a0ff' } }}
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

  const renderDesktopView = () => (
    <TableContainer sx={{ borderRadius: 1, overflow: 'auto', mb: 2, '&::-webkit-scrollbar': { height: '8px' } }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ bgcolor: '#F9FAFB', position: 'sticky', top: 0, zIndex: 10 }}>
          <TableRow>
            {tableHeaders.desktop.map((header, index) => (
              <TableCell key={index} sx={{ fontWeight: 'bold', bgcolor: '#F9FAFB', whiteSpace: 'nowrap' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.length === 0 ? (
             <TableRow>
               <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                 <Typography variant="body2" color="text.secondary">No se encontraron productos.</Typography>
               </TableCell>
             </TableRow>
          ) : (
            products?.map((product, index) => {
              const selectedVariantIndex = selectedVariants[product.id] ?? 0;
              const selectedVariant = product.variants[selectedVariantIndex];
              const selectedCategory = categories.find((cat) => cat.id === product.category_id);
              const categoryOptions = [{ id: 'clear', name: 'Sin categoría' }, ...categories];

              return (
                <TableRow key={index} sx={{ borderBottom: '1px solid #F9FAFB' }}>
                  <TableCell sx={{ p: 1, width: '70px' }}>
                    <Box
                      component='img'
                      src={getProductImage(product.id, product.images)}
                      loading='lazy'
                      onError={() => handleImageError(product.id)}
                      sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'contain' }}
                    />
                  </TableCell>
                  <CellTableProduct content={product.name} />
                  <TableCell sx={{ minWidth: 140, px: 2 }}>
                    <Select
                      value={selectedVariantIndex}
                      onChange={(e) => handleVariantChange(product.id, Number(e.target.value))}
                      size='small'
                      fullWidth
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {product.variants.map((variant, variantIndex) => {
                        const variantLabel = [variant.color_name, variant.storage, variant.finish].filter(Boolean).join(' • ');
                        return <MenuItem key={variant.id} value={variantIndex}>{variantLabel}</MenuItem>;
                      })}
                    </Select>
                  </TableCell>
                  <CellTableProduct content={selectedVariant ? formatPrice(selectedVariant.price) : '-'} sx={{ fontWeight: 'bold' }} />
                  <TableCell sx={{ minWidth: 180, px: 2 }}>
                    <Autocomplete
                      options={categoryOptions}
                      getOptionLabel={(opt) => opt.id === 'clear' ? 'Sin categoría' : opt.name}
                      value={selectedCategory || null}
                      onChange={(_, newVal) => {
                        if (newVal?.id === 'clear') {
                          updateProductCategory({ productId: product.id, categoryId: null as any });
                        } else if (newVal) {
                          handleCategoryChange(product, newVal);
                        }
                      }}
                      loading={isCategoriesLoading || isUpdatingCategory}
                      size='small'
                      fullWidth
                      renderInput={(params) => <TextField {...params} placeholder='Asignar' size='small' />}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 140 }}> 
                    <ProductStockStatus 
                      currentStock={selectedVariant?.stock ?? 0}
                      allVariants={product.variants}
                      currentVariantId={selectedVariant?.id}
                    />
                  </TableCell>
                  <CellTableProduct content={formatDate(product.created_at)} />
                  <TableCell sx={{ width: '120px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OptimisticSwitch product={product} onToggle={toggleProduct} />
                      <Tooltip title="Editar detalles">
                        <IconButton
                          component={RouterLink}
                          to={`/panel/productos/editar/${product.slug}`}
                          size="small"
                          sx={{ color: '#0007d7ff', bgcolor: '#f0f4ff', '&:hover': { bgcolor: '#dbeafe' } }}
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

  if (isLoading) return <Loader />;

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
          overflow: 'visible',
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
          Gestión de Productos
        </Typography>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mb: 3 }} alignItems="center">
          
          <TextField
            placeholder='Buscar producto...'
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ flex: 1, width: { xs: '100%', lg: 'auto' }, '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
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

          <FormControl size="small" sx={{ minWidth: 140, width: { xs: '100%', lg: 'auto' } }}>
            <InputLabel>Estado</InputLabel>
            <Select value={statusFilter} label="Estado" onChange={handleStatusChange} sx={{ bgcolor: 'white' }}>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Activos</MenuItem>
              <MenuItem value="inactive">Inactivos</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, width: { xs: '100%', lg: 'auto' } }}>
            <InputLabel>Categoría</InputLabel>
            <Select 
              value={categoryIdFilter} 
              label="Categoría" 
              onChange={handleCategoryFilterChange} 
              sx={{ bgcolor: 'white' }}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="uncategorized">Sin categoría</MenuItem> 
              
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, width: { xs: '100%', lg: 'auto' } }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select value={sortFilter} label="Ordenar por" onChange={handleSortChange} sx={{ bgcolor: 'white' }}>
              <MenuItem value="newest">Más recientes</MenuItem>
              <MenuItem value="oldest">Más antiguos</MenuItem>
              <MenuItem value="name_asc">Nombre (A-Z)</MenuItem>
              <MenuItem value="name_desc">Nombre (Z-A)</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={handleClearAll}
            disabled={isDefaultState}
            sx={{ 
              minWidth: { xs: '100%', lg: 'auto' },
              height: 40,
              borderColor: '#E5E7EB',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.primary',
                color: 'text.primary',
                bgcolor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Limpiar
          </Button>

        </Stack>

        {isMobile ? renderMobileView() : renderDesktopView()}

      </Card>
      
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
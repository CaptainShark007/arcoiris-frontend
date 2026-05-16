import { useState, useEffect } from 'react';
import {
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
  IconButton,
  InputAdornment,
  Stack,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // <-- Importación agregada
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Loader } from '@shared/components';
import { useCategories } from '@features/shop/hooks/products/useCategories';
import {
  useProducts,
  useToggleProduct,
  useDeleteProduct,
} from '@features/admin/hooks';
import CustomPagination from '@shared/components/CustomPagination';
import Menu from '@mui/material/Menu';

const DEFAULT_IMAGE = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

export const TableProduct = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm]         = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');
  const [statusFilter, setStatusFilter]     = useState<'all' | 'active' | 'inactive' | 'low_stock'>(() => (searchParams.get('status') as any) || 'all');
  const [categoryIdFilter, setCategoryIdFilter] = useState(() => searchParams.get('category') || 'all');
  const [sortFilter, setSortFilter]         = useState<'newest' | 'oldest' | 'name_asc' | 'name_desc'>(() => (searchParams.get('sort') as any) || 'newest');
  const [page, setPage]                     = useState(() => Number(searchParams.get('page')) || 0);
  const [rowsPerPage, setRowsPerPage]       = useState(() => Number(searchParams.get('limit')) || 10);
  const [imageErrors, setImageErrors]       = useState<Record<string, boolean>>({});

  const [deleteModalOpen, setDeleteModalOpen]   = useState(false);
  const [productToDelete, setProductToDelete]   = useState<{ id: string; name: string } | null>(null);

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: toggleProduct } = useToggleProduct();
  const { categories } = useCategories();
  const { products, isLoading, totalProducts } = useProducts({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearch,
    status: statusFilter,
    categoryId: categoryIdFilter === 'all' ? null : categoryIdFilter,
    sortBy: sortFilter,
  });

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 0)               params.set('page', String(page));
    if (rowsPerPage !== 10)     params.set('limit', String(rowsPerPage));
    if (debouncedSearch)        params.set('search', debouncedSearch);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (categoryIdFilter !== 'all') params.set('category', categoryIdFilter);
    if (sortFilter !== 'newest') params.set('sort', sortFilter);
    setSearchParams(params, { replace: true });
  }, [page, rowsPerPage, debouncedSearch, statusFilter, categoryIdFilter, sortFilter, setSearchParams]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== searchParams.get('search') && searchTerm !== '') setPage(0);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm, searchParams]);

  const getImage = (id: string, thumbnail: string | null) =>
    imageErrors[id] || !thumbnail ? DEFAULT_IMAGE : thumbnail;

  const isDefaultState =
    searchTerm === '' && statusFilter === 'all' && categoryIdFilter === 'all' && sortFilter === 'newest';

  const handleClearAll = () => {
    setSearchTerm(''); setDebouncedSearch('');
    setStatusFilter('all'); setCategoryIdFilter('all');
    setSortFilter('newest'); setPage(0);
  };

  const handleOpenDeleteModal = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setTimeout(() => setProductToDelete(null), 200);
  };
  const handleConfirmDelete = () => {
    if (productToDelete) deleteProduct(productToDelete.id, { onSuccess: handleCloseDeleteModal });
  };

  // Action buttons
  const ActionButtons = ({ product }: { product: any }) => {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    return (
      <>
        <IconButton
          size="small"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { bgcolor: '#F3F4F6', color: 'text.primary' } 
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { minWidth: 180, borderRadius: 2, mt: 0.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } } }}
        >
          <MenuItem
            component={RouterLink}
            to={`/panel/productos/editar/${product.slug}`}
            onClick={() => setAnchor(null)}
            sx={{ gap: 1.5, fontSize: '0.875rem', py: 1.2 }}
          >
            <EditIcon fontSize="small" sx={{ color: '#2563EB' }} />
            Editar producto
          </MenuItem>

          <MenuItem 
            onClick={() => { toggleProduct(product.id); setAnchor(null); }} 
            sx={{ gap: 1.5, fontSize: '0.875rem', py: 1.2 }}
          >
            {product.is_active ? (
              <>
                <BlockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                Desactivar
              </>
            ) : (
              <>
                <CheckCircleOutlineIcon fontSize="small" color="success" />
                Activar
              </>
            )}
          </MenuItem>

          <MenuItem
            onClick={() => { handleOpenDeleteModal(product.id, product.name); setAnchor(null); }}
            sx={{ gap: 1.5, fontSize: '0.875rem', color: '#DC2626', py: 1.2 }}
          >
            <DeleteIcon fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>
      </>
    );
  };

  // Status chip
  const StatusChip = ({ isActive }: { isActive: boolean | null }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 700,
        bgcolor: isActive ? '#DCFCE7' : '#E5E7EB',
        color: isActive ? '#14532D' : '#1F2937',
        border: '1px solid',
        borderColor: isActive ? '#22C55E' : '#9CA3AF',
      }}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </Box>
  );

  // Desktop view
  const renderDesktopView = () => (
    <TableContainer sx={{ borderRadius: 1, overflow: 'auto', border: '1px solid #F3F4F6' }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
          <TableRow>
            {['Producto', 'Estado', 'Inventario', 'Categoría', ''].map((h, i) => (
              <TableCell 
                key={i} 
                align={i === 4 ? 'right' : 'left'} 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #E5E7EB',
                  py: 2
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!products?.length ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No se encontraron productos
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Intenta cambiar los filtros o el término de búsqueda.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow 
                key={product.id} 
                sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#F8FAFC' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                
                {/* Imagen y Nombre */}
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={getImage(product.id, product.thumbnail)}
                      loading="lazy"
                      onError={() => setImageErrors((p) => ({ ...p, [product.id]: true }))}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 1, 
                        objectFit: 'contain', 
                        display: 'block', 
                        flexShrink: 0,
                        border: '1px solid #E5E7EB',
                        bgcolor: '#FFFFFF',
                        p: 0.5 
                      }}
                    />
                    <Typography variant="body2" fontWeight={600} color="#111827">
                      {product.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Estado */}
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <StatusChip isActive={product.is_active} />
                </TableCell>

                {/* Inventario */}
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#374151">
                      {product.totalStock} en existencia
                    </Typography>
                    <Typography variant="caption" color="#6B7280" display="block" mt={0.5}>
                      {product.variantCount === 1 ? 'Producto simple' : `${product.variantCount} variantes`}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Categoría */}
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <Chip
                    label={product.category?.name ?? 'Sin categoría'}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#E5E7EB',
                      color: product.category ? '#374151' : '#9CA3AF',
                      bgcolor: '#FFFFFF',
                      borderRadius: 1,
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell align="right" sx={{ py: 1.5, width: 80, paddingRight: 3, borderBottom: '1px solid #F3F4F6' }}>
                  <ActionButtons product={product} />
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile view 
  const renderMobileView = () => {
    if (!products?.length)
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No se encontraron productos</Typography>
        </Box>
      );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        {products.map((product) => (
          <Card key={product.id} sx={{ p: 2, border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box
                component="img"
                src={getImage(product.id, product.thumbnail)}
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'contain', flexShrink: 0, border: '1px solid #E5E7EB', p: 0.5 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#111827" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.category?.name ?? 'Sin categoría'}
                </Typography>
              </Box>
              <StatusChip isActive={product.is_active} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px dashed #E5E7EB' }}>
              <Box>
                 <Typography variant="body2" fontWeight={600}>{product.totalStock} en existencia</Typography>
              </Box>
              <ActionButtons product={product} />
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: '#FFFFFF',
          mb: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
          border: '1px solid #E5E7EB',
          borderRadius: 1,
          overflow: 'visible',
        }}
      >
        {/* Encabezado Principal y Botón Nuevo Producto */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight="700" color="#111827">
            Gestión de Productos
          </Typography>
          
          <Button
            component={RouterLink}
            to="/panel/productos/nuevo"
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              backgroundColor: '#0007d7ff',
              py: { xs: 1, sm: 1 },
              px: { xs: 2, sm: 2.5 },
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              borderRadius: 1,
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#0005a0ff',
                boxShadow: '0px 4px 12px rgba(0, 7, 215, 0.2)',
              },
            }}
          >
            Nuevo Producto
          </Button>
        </Box>

        {/* Filtros */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mb: 4 }} alignItems="center">
          <TextField
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ 
              flex: 1, 
              width: { xs: '100%', lg: 'auto' }, 
              '& .MuiOutlinedInput-root': { borderRadius: 1 } 
            }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SearchIcon color="action" fontSize="small" /></InputAdornment>,
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setSearchTerm(''); setDebouncedSearch(''); setPage(0); }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140, width: { xs: '100%', lg: 'auto' } }}>
            <InputLabel>Estado</InputLabel>
            <Select value={statusFilter} label="Estado" onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0); }} sx={{ borderRadius: 1 }}>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Activos</MenuItem>
              <MenuItem value="inactive">Inactivos</MenuItem>
              <MenuItem value="low_stock" sx={{ color: '#D97706', fontWeight: 600 }}>Poco stock</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, width: { xs: '100%', lg: 'auto' } }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={categoryIdFilter} label="Categoría" onChange={(e) => { setCategoryIdFilter(e.target.value); setPage(0); }} sx={{ borderRadius: 1 }}>
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="uncategorized">Sin categoría</MenuItem>
              {categories?.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, width: { xs: '100%', lg: 'auto' } }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select value={sortFilter} label="Ordenar por" onChange={(e) => { setSortFilter(e.target.value as any); setPage(0); }} sx={{ borderRadius: 1 }}>
              <MenuItem value="newest">Más recientes</MenuItem>
              <MenuItem value="oldest">Más antiguos</MenuItem>
              <MenuItem value="name_asc">Nombre (A-Z)</MenuItem>
              <MenuItem value="name_desc">Nombre (Z-A)</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined" color="inherit" size="small"
            startIcon={<RestartAltIcon />}
            onClick={handleClearAll}
            disabled={isDefaultState}
            sx={{ minWidth: { xs: '100%', lg: 'auto' }, height: 40, borderColor: '#E5E7EB', color: 'text.secondary', borderRadius: 1 }}
          >
            Limpiar
          </Button>
        </Stack>

        {isMobile ? renderMobileView() : renderDesktopView()}

        {totalProducts > 0 && (
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <CustomPagination
              page={page}
              totalPages={Math.ceil(totalProducts / rowsPerPage)}
              totalItems={totalProducts}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        )}
      </Card>

      {/* Modal eliminar */}
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal} PaperProps={{ sx: { borderRadius: 1, maxWidth: 400, p: 1 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, px: 3 }}>
          <Box sx={{ bgcolor: '#FEF2F2', borderRadius: '50%', p: 1.5, display: 'flex', mb: 2 }}>
            <WarningAmberIcon sx={{ color: '#EF4444', fontSize: '2rem' }} />
          </Box>
          <DialogTitle sx={{ p: 0, fontWeight: 700, mb: 1, fontSize: '1.25rem' }}>¿Eliminar producto?</DialogTitle>
        </Box>
        <DialogContent sx={{ textAlign: 'center', px: 3 }}>
          <DialogContentText sx={{ color: '#4B5563' }}>
            Estás a punto de eliminar <strong>&quot;{productToDelete?.name}&quot;</strong>.<br /><br />
            Esta acción lo desactivará de la tienda inmediatamente.{' '}
            <Typography component="span" variant="caption" color="text.secondary" display="block" mt={1}>
              (Esta acción no se puede deshacer)
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1.5 }}>
          <Button onClick={handleCloseDeleteModal} variant="outlined" color="inherit" disabled={isDeleting} sx={{ flex: 1, textTransform: 'none', borderColor: '#E5E7EB', borderRadius: 1, fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus disabled={isDeleting} sx={{ flex: 1, textTransform: 'none', bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: 1, fontWeight: 600, boxShadow: 'none' }}>
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '@shared/components';
import CustomPagination from '@shared/components/CustomPagination';
import { useInventory } from '../../hooks/inventory/useInventory';

const DEFAULT_IMAGE = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

export const TableInventory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');
  const [page, setPage] = useState(() => Number(searchParams.get('page')) || 0);
  const [rowsPerPage, setRowsPerPage] = useState(() => Number(searchParams.get('limit')) || 10);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useInventory({
    page: page + 1,
    limit: rowsPerPage,
    search: debouncedSearch,
  });

  const variants = data?.variants || [];
  const totalItems = data?.count || 0;

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 0) params.set('page', String(page));
    if (rowsPerPage !== 10) params.set('limit', String(rowsPerPage));
    if (debouncedSearch) params.set('search', debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [page, rowsPerPage, debouncedSearch, setSearchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== searchParams.get('search') && searchTerm !== '') setPage(0);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm, searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
  };

  const constructVariantName = (v: any) => {
    const parts = [];
    if (v.color_name) parts.push(v.color_name);
    if (v.storage) parts.push(v.storage);
    if (v.finish) parts.push(v.finish);
    
    return parts.length > 0 ? parts.join(' • ') : 'Producto simple';
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

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

  const StockChip = ({ stock }: { stock: number }) => {
    const isMedium = stock > 0 && stock <= 10;
    const isHigh = stock > 10;

    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 700,
          bgcolor: isHigh ? '#DCFCE7' : isMedium ? '#FEF3C7' : '#FEE2E2',
          color: isHigh ? '#14532D' : isMedium ? '#92400E' : '#991B1B',
          border: '1px solid',
          borderColor: isHigh ? '#22C55E' : isMedium ? '#F59E0B' : '#EF4444',
        }}
      >
        {stock} unidades
      </Box>
    );
  };

  const renderDesktopView = () => (
    <TableContainer sx={{ borderRadius: 1, overflow: 'auto', border: '1px solid #F3F4F6' }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
          <TableRow>
            {['Producto / Variante', 'Estado', 'Precio', 'Existencia'].map((h, i) => (
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
          {!variants.length ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No se encontraron variantes en el inventario
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Intenta cambiar los filtros o el término de búsqueda.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            variants.map((v) => (
              <TableRow 
                key={v.id} 
                sx={{ 
                  transition: 'background-color 0.2s',
                  //'&:hover': { bgcolor: '#F8FAFC' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #e3e3e4' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={imageErrors[v.id] || !v.thumbnail ? DEFAULT_IMAGE : v.thumbnail}
                      loading="lazy"
                      onError={() => handleImageError(v.id)}
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
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="#111827">
                        {v.product_name}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        bgcolor: '#F3F4F6', 
                        px: 1, 
                        borderRadius: 1, 
                        width: 'fit-content'
                      }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          display="block" 
                          mt={0.5} 
                          fontWeight={'bold'}
                        >
                          {constructVariantName(v)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #e3e3e4' }}>
                  <StatusChip isActive={v.is_active} />
                </TableCell>

                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #e3e3e4' }}>
                  {v.original_price && v.original_price > v.price ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {formatPrice(v.original_price)}
                      </Typography>
                      <Typography variant="body2" fontWeight={800} color="#111827">
                        {formatPrice(v.price)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" fontWeight={800} color="#111827">
                      {formatPrice(v.price)}
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #e3e3e4' }}>
                  <StockChip stock={v.stock} />
                </TableCell>

                {/* <TableCell align="right" sx={{ py: 1.5, paddingRight: 3, borderBottom: '1px solid #F3F4F6' }}>
                  <Typography variant="body2" color="#6B7280">
                    —
                  </Typography>
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileView = () => {
    if (!variants.length)
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No se encontraron variantes en el inventario</Typography>
        </Box>
      );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        {variants.map((v) => (
          <Card key={v.id} sx={{ p: 2, border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box
                component="img"
                src={imageErrors[v.id] || !v.thumbnail ? DEFAULT_IMAGE : v.thumbnail}
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'contain', flexShrink: 0, border: '1px solid #E5E7EB', p: 0.5, bgcolor: '#FFFFFF' }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#111827" noWrap>
                  {v.product_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {constructVariantName(v)}
                </Typography>
              </Box>
              <StatusChip isActive={v.is_active} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px dashed #E5E7EB' }}>
              <Box>
                <StockChip stock={v.stock} />
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {formatPrice(v.price)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  if (isLoading) return <Loader />;

  return (
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" fontWeight="700" color="#111827">
          Gestión de Inventarios
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} alignItems="center">
        <TextField
          placeholder="Buscar variante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ 
            flex: 1, 
            width: { xs: '100%', sm: 300 }, 
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
      </Stack>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {totalItems > 0 && (
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          <CustomPagination
            page={page}
            totalPages={Math.ceil(totalItems / rowsPerPage)}
            totalItems={totalItems}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </Card>
  );
};

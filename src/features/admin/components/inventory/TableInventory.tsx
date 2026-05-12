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
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '@shared/components';
import CustomPagination from '@shared/components/CustomPagination';
import { useInventory } from '../../hooks/inventory/useInventory';

const DEFAULT_IMAGE = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

export const TableInventory = () => {
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
    
    return parts.length > 0 ? parts.join(' - ') : 'Única variante';
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* HEADER & CONTROLS */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Inventario
        </Typography>

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            placeholder="Buscar por producto..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              endAdornment: searchTerm ? (
                <IconButton size="small" onClick={() => { setSearchTerm(''); setDebouncedSearch(''); setPage(0); }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null
            }}
            sx={{ width: { xs: '100%', sm: 300 }, bgcolor: 'background.paper', borderRadius: 1 }}
          />
        </Stack>
      </Box>

      {/* DATA TABLE */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        {isLoading ? (
          <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
            <Loader />
          </Box>
        ) : variants.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No se encontraron variantes en el inventario.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>Producto / Variante</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="center">Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={imageErrors[v.id] || !v.thumbnail ? DEFAULT_IMAGE : v.thumbnail}
                          onError={() => handleImageError(v.id)}
                          sx={{ width: 44, height: 44, borderRadius: 1, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {v.product_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {constructVariantName(v)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={v.is_active ? 'Activo' : 'Inactivo'}
                        size="small"
                        color={v.is_active ? 'success' : 'default'}
                        variant={v.is_active ? 'filled' : 'outlined'}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {v.original_price && v.original_price > v.price ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            {formatPrice(v.original_price)}
                          </Typography>
                          <Typography variant="body2" color="error.main" fontWeight="bold">
                            {formatPrice(v.price)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2">
                          {formatPrice(v.price)}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Chip 
                        label={v.stock} 
                        size="small"
                        color={v.stock > 10 ? 'success' : v.stock > 0 ? 'warning' : 'error'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!isLoading && totalItems > 0 && (
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
    </Box>
  );
};

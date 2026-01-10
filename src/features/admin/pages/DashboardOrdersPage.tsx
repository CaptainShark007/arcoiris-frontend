import { Box, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Loader, SeoHead } from '@shared/components';
import { useAllOrders } from '../hooks';
import { TableOrdersAdmin } from '../components';
import { useState } from 'react';
import CustomPagination from '@shared/components/CustomPagination';
import { OrderFilterType } from '@/actions';

const DashboardOrdersPage = () => {

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filter, setFilter] = useState<OrderFilterType>('all');

  const { orders, totalItems, isLoading } = useAllOrders({
    page: page + 1,
    limit: rowsPerPage,
    filter,
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0);
  }

  const handleFilterChange = (e: any) => {
    setFilter(e.target.value);
    setPage(0);
  };

  if (isLoading || !orders) {
    return (
      <>
        <SeoHead title="Cargando pedidos..." description="Cargando la lista de pedidos en el panel de administración" />
        <Loader />
      </>
    );
  }

  const totalPage = Math.ceil(totalItems / rowsPerPage);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2.5,
      px: { xs: 1, sm: 0 },
    }}>
      <SeoHead 
        title="Panel de Pedidos" 
        description="Gestión de pedidos en el panel de administración"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: '800', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Pedidos
        </Typography>

        {/* SELECTOR DE FILTRO */}
        <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'white' }}>
          <InputLabel id="filter-select-label">Filtrar por origen</InputLabel>
          <Select
            labelId="filter-select-label"
            value={filter}
            label="Filtrar por origen"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Todos los pedidos</MenuItem>
            <MenuItem value="partner">Solo Socios / Referidos</MenuItem>
            <MenuItem value="direct">Solo Ventas Directas</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card sx={{ 
        p: { xs: 1.5, sm: 2.5 },
        bgcolor: '#F9FAFB', 
        boxShadow: 'none', 
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}>
        <TableOrdersAdmin orders={orders} />
      </Card>

      <Box sx={{ px: { xs: 1, sm: 2 } }}>
        <CustomPagination 
          page={page}
          totalPages={totalPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

    </Box>
  );
};

export default DashboardOrdersPage;
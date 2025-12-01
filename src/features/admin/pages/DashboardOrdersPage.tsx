import { Box, Card, Typography } from '@mui/material';
import { Loader } from '@shared/components';
import { useAllOrders } from '../hooks';
import { TableOrdersAdmin } from '../components';
import { useState } from 'react';
import CustomPagination from '@shared/components/CustomPagination';

const DashboardOrdersPage = () => {

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { orders, totalItems, isLoading } = useAllOrders({
    page: page + 1,
    limit: rowsPerPage,
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0); // Reinicia a la primera página cuando cambia la cantidad de filas
  }

  if (isLoading || !orders) return <Loader />;

  const totalPage = Math.ceil(totalItems / rowsPerPage);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2.5,
      px: { xs: 1, sm: 0 },
    }}>
      <Typography variant="h5" sx={{ fontWeight: '800', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Pedidos
      </Typography>

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
        {/* <Pagination 
          totalItems={totalItems}
          page={page}
          setPage={setPage}
        /> */}
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
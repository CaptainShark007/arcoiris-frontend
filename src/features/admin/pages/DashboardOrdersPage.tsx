import { Box, Card, Typography } from '@mui/material';
import { Loader, Pagination } from '@shared/components';
import { useAllOrders } from '../hooks';
import { TableOrdersAdmin } from '../components';

const DashboardOrdersPage = () => {
  const { orders, totalItems, isLoading, page, setPage } = useAllOrders();

  if (isLoading || !orders) return <Loader />;

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
        <Pagination 
          totalItems={totalItems}
          page={page}
          setPage={setPage}
        />
      </Box>

    </Box>
  );
};

export default DashboardOrdersPage;
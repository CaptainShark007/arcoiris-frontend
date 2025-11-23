import { Box, Card, Typography } from '@mui/material';
import { Loader } from '@shared/components';
import { useAllOrders } from '../hooks';
import { TableOrdersAdmin } from '../components';

const DashboardOrdersPage = () => {
  const { data, isLoading } = useAllOrders();

  if (isLoading || !data) return <Loader />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Órdenes
      </Typography>

      <Card sx={{ p: 2.5, bgcolor: 'white' }}>
        <TableOrdersAdmin orders={data} />
      </Card>
    </Box>
  );
};

export default DashboardOrdersPage;
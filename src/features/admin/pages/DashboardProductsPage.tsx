import { Box } from '@mui/material';
import { TableProduct } from '../components';
import { SeoHead } from '@shared/components';

const DashboardProductsPage = () => {
  return (
    <>
      <SeoHead 
        title="Panel de Productos" 
        description="Gestión de productos en el panel de administración"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          bgcolor: '#f3f4f6',
          height: '100%', 
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <TableProduct />
        </Box>
      </Box>
    </>
  );
};

export default DashboardProductsPage;
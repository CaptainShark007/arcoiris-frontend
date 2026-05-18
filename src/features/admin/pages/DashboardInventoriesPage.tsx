import { Box } from '@mui/material';
import { TableInventory } from '../components/inventory/TableInventory';
import { SeoHead } from '@shared/components';

const DashboardInventoriesPage = () => {
  return (
    <>
      <SeoHead 
        title="Panel de Inventarios" 
        description="Gestión de inventarios en el panel de administración"
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
          <TableInventory />
        </Box>
      </Box>
    </>
  );
};

export default DashboardInventoriesPage;

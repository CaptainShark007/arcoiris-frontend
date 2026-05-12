import { Box } from '@mui/material';
import { TableInventory } from '../components/inventory/TableInventory';

const DashboardInventoriesPage = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <TableInventory />
    </Box>
  );
};

export default DashboardInventoriesPage;

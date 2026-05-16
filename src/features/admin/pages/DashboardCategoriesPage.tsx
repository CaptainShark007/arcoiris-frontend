import { Box } from '@mui/material';
import { TableCategory } from '../components/category/TableCategory';
import { SeoHead } from '@shared/components';

const DashboardCategoriesPage = () => {
  return (
    <>
      <SeoHead
        title="Panel de Categorías"
        description="Gestión de categorías en el panel de administración"
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
          <TableCategory />
        </Box>
      </Box>
    </>
  );
};

export default DashboardCategoriesPage;

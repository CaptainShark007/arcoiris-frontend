import { Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CategoriesModal, TableProduct } from '../components';
import { useState } from 'react';

const DashboardProductsPage = () => {

  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => setCategoriesModalOpen(true)}
          sx={{
            backgroundColor: '#6b7280',
            py: 0.75,
            px: 1,
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          Categorías
        </Button>
        <Button
          component={RouterLink}
          to="/panel/productos/nuevo"
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{
            backgroundColor: '#0007d7ff',
            py: 0.75,
            px: 1,
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          Nuevo Producto
        </Button>
      </Box>
      <TableProduct />
      
      <CategoriesModal 
        open={categoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
      />
    </Box>
  );
};

export default DashboardProductsPage;
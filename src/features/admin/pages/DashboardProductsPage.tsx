import { Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CategoriesModal, TableProduct } from '../components';
import { useState } from 'react';
import { SeoHead } from '@shared/components';

const DashboardProductsPage = () => {
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

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
          gap: 2,
          width: '100%',
          bgcolor: '#f3f4f6'
        }}
      >
        {/* Header con botones */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Button
            variant="contained"
            onClick={() => setCategoriesModalOpen(true)}
            startIcon={<AddCircleIcon />}
            sx={{
              backgroundColor: '#0007d7ff',
              py: { xs: 1.25, sm: 1, md: 0.875 },
              px: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              fontWeight: 600,
              textTransform: 'none',
              flex: { xs: '1 1 calc(50% - 8px)', sm: '0 0 auto' },
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#0005a0ff',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
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
              py: { xs: 1.25, sm: 1, md: 0.875 },
              px: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              fontWeight: 600,
              textTransform: 'none',
              flex: { xs: '1 1 calc(50% - 8px)', sm: '0 0 auto' },
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#0005a0ff',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            Nuevo Producto
          </Button>
        </Box>

        {/* Contenedor principal */}
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

        {/* Modal de categorías */}
        <CategoriesModal
          open={categoriesModalOpen}
          onClose={() => setCategoriesModalOpen(false)}
        />
      </Box>
    </>
  );
};

export default DashboardProductsPage;
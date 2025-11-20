import { Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TableProduct } from '../components';

const DashboardProductsPage = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button
        component={RouterLink}
        to="/panel/productos/nuevo"
        variant="contained"
        startIcon={<AddCircleIcon />}
        sx={{
          alignSelf: 'flex-end',
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

      <TableProduct />
    </Box>
  );
};

export default DashboardProductsPage;
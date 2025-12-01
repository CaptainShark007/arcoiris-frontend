import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  CheckCircle,
  Receipt,
  //Email,
  AccountCircle,
  LocationOn,
} from '@mui/icons-material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { formatPrice } from '@/helpers';
import { useNavigate } from 'react-router';

// DESCOMENTAR para usar la version real
import { useOrder } from '@features/orders/hooks/useOrder';
import { Loader } from '@shared/components';

//import { mockData } from '../data/mock.data'; // COMENTAR para usar la version de prueba

interface ConfirmationStepProps {
  onReset: () => void;
}

export const ConfirmationStep = ({ onReset }: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const { orderId, clearCheckout } = useCheckoutStore();

  const handleResetMobile = () => {
    clearCheckout();
    onReset?.();
    navigate('/', { replace: true });
  };

  const handleViewOrdersHistory = () => {
    navigate('/cuenta/pedidos');
  }

  // DESCOMENTAR para usar la version real
  const { data, isLoading, isError } = useOrder(orderId || 0);
  if (isError) return <Typography variant='body2' sx={{ textAlign: 'center' }}>Error al cargar los detalles de la orden.</Typography>;
  if (isLoading) return <Loader />
  if (!data) return <Typography variant='body2' sx={{ textAlign: 'center' }}>No hay datos disponibles.</Typography>;

  //const data = mockData; // COMENTAR para usar la version de prueba

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 4 } }}>
      {/* Icono de éxito */}
      <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3, md: 4 } }}>
        <CheckCircle
          sx={{
            fontSize: { xs: 50, sm: 65, md: 80 },
            color: 'success.main',
            mb: { xs: 1, md: 2 },
          }}
        />
        <Typography 
          variant='h4' 
          gutterBottom 
          fontWeight='bold'
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
        >
          ¡Gracias, {data?.customer.full_name}!
        </Typography>
        <Typography 
          variant='body1' 
          color='text.secondary'
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Tu pedido ha sido recibido con éxito.
        </Typography>
      </Box>

      {/* Información de la orden */}
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 2, md: 3 },
          bgcolor: 'background.default',
          boxShadow: 'none',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1.5, md: 2 } }}>
          <Receipt color='primary' sx={{ fontSize: { xs: 20, md: 24 } }} />
          <Typography 
            variant='h6'
            sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            Orden #{orderId || '1000'}
          </Typography>
        </Box>

        <Divider sx={{ my: { xs: 1.5, md: 2 } }} />

        {/* DETALLES DEL PEDIDO */}
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography 
            variant='h6' 
            gutterBottom 
            sx={{ fontWeight: 600, mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            Detalles del pedido
          </Typography>

          {/* Tabla de items con altura fija y scroll */}
          <TableContainer
            sx={{
              mb: { xs: 2, md: 3 },
              maxHeight: { xs: 300, sm: 350, md: 410 },
              overflowY: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <Table stickyHeader>
              <TableBody>
                {data.orderItems.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell 
                      sx={{ 
                        width: { xs: 60, md: 80 }, 
                        pr: { xs: 1, md: 2 }, 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        py: { xs: 1, md: 1.5 }
                      }}
                    >
                      <Box
                        component='img'
                        src={item.productImage}
                        alt={item.productName}
                        sx={{
                          width: { xs: 48, md: 64 },
                          height: { xs: 48, md: 64 },
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: 1, borderColor: 'divider', py: { xs: 1, md: 1.5 } }}>
                      <Typography 
                        variant='subtitle2' 
                        sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        {item.productName}
                      </Typography>
                      <Typography 
                        variant='caption' 
                        color='text.secondary'
                        sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                      >
                        {[item.color_name, item.storage, item.finish].filter(Boolean).join(' • ')}
                      </Typography>
                    </TableCell>
                    <TableCell 
                      align='right' 
                      sx={{ borderBottom: 1, borderColor: 'divider', py: { xs: 1, md: 1.5 } }}
                    >
                      <Typography 
                        variant='subtitle2' 
                        sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        {formatPrice(item.price)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: { xs: 1.5, md: 2 },
              bgcolor: 'action.hover',
              borderRadius: 1,
              mb: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ display: 'flex', gap: { xs: 4, md: 8 } }}>
              <Typography 
                variant='subtitle2' 
                sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
              >
                Total:
              </Typography>
              <Typography 
                variant='subtitle2' 
                sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
              >
                {formatPrice(data.totalAmount)}
              </Typography>
            </Box>
          </Box>

          {/* Información adicional */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: { xs: 2, md: 3 },
            }}
          >
            {/* Información de contacto */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: { xs: 0.5, md: 1 } }}>
                <AccountCircle color='primary' sx={{ fontSize: { xs: 18, md: 20 } }} />
                <Typography 
                  variant='subtitle2' 
                  sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  Información de contacto
                </Typography>
              </Box>
              <Typography 
                variant='body2' 
                color='text.secondary' 
                sx={{ ml: { xs: 3, md: 4 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              >
                {data.customer.email}
              </Typography>
              <Typography 
                variant='body2' 
                color='text.secondary' 
                sx={{ ml: { xs: 3, md: 4 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              >
                {data.customer.phone}
              </Typography>
            </Box>

            {/* Dirección de envío */}
            {data.address && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: { xs: 0.5, md: 1 } }}>
                  <LocationOn color='primary' sx={{ fontSize: { xs: 18, md: 20 } }} />
                  <Typography 
                    variant='subtitle2' 
                    sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                  >
                    Dirección de envío
                  </Typography>
                </Box>
                <Box sx={{ ml: { xs: 3, md: 4 } }}>
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.addressLine1}
                  </Typography>
                  {data.address.addressLine2 && (
                    <Typography 
                      variant='body2' 
                      color='text.secondary'
                      sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                    >
                      {data.address.addressLine2}
                    </Typography>
                  )}
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.city}, {data.address.state}
                  </Typography>
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.postalCode}
                  </Typography>
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.country}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 1.5, md: 2 } }} />
      </Paper>

      {/* Botones solo visibles en móviles */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          variant='contained'
          onClick={handleViewOrdersHistory}
          fullWidth
          sx={{ py: { xs: 1, sm: 1.25 } }}
        >
          Ver detalles de la orden
        </Button>

        <Button 
          variant='outlined' 
          onClick={handleResetMobile} 
          fullWidth
          sx={{ py: { xs: 1, sm: 1.25 } }}
        >
          Volver a inicio
        </Button>
      </Box>
    </Box>
  );
};
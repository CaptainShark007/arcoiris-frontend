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
//import { useOrder } from '@features/orders/hooks/useOrder';
//import { Loader } from '@shared/components';

import { mockData } from '../data/mock.data'; // COMENTAR para usar la version de prueba

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
  /* const { data, isLoading, isError } = useOrder(orderId || 0);
  if (isError) return <Typography variant='body2' sx={{ textAlign: 'center' }}>Error al cargar los detalles de la orden.</Typography>;
  if (isLoading) return <Loader />
  if (!data) return <Typography variant='body2' sx={{ textAlign: 'center' }}>No hay datos disponibles.</Typography>; */

  const data = mockData; // COMENTAR para usar la version de prueba

  return (
    <Box>
      {/* Icono de éxito */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle
          sx={{
            fontSize: 80,
            color: 'success.main',
            mb: 2,
          }}
        />
        <Typography variant='h4' gutterBottom fontWeight='bold'>
          ¡Gracias, {data?.customer.full_name}!
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Tu pedido ha sido recibido con éxito.
        </Typography>
      </Box>

      {/* Información de la orden */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: 'background.default',
          boxShadow: 'none',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Receipt color='primary' />
          <Typography variant='h6'>Orden #{orderId || '1000'}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* DETALLES DEL PEDIDO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Detalles del pedido
          </Typography>

          {/* Tabla de items con altura fija y scroll */}
          <TableContainer
            sx={{
              mb: 3,
              maxHeight: 410,
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
                  <TableRow key={index} sx={{ '&:last-child td': { border: 0 }}}>
                    <TableCell sx={{ width: 80, pr: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Box
                        component='img'
                        src={item.productImage}
                        alt={item.productName}
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: 'contain',
                          borderRadius: 1,
                          //bgcolor: 'red'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.productName}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {item.color_name} / {item.storage} / {item.finish}
                      </Typography>
                    </TableCell>
                    <TableCell align='right' sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
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
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', gap: 8 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                Total:
              </Typography>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                {formatPrice(data.totalAmount)}
              </Typography>
            </Box>
          </Box>

          {/* Información adicional - Sin Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            {/* Información de contacto */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {/* <Email color='primary' sx={{ fontSize: 20 }} /> */}
                <AccountCircle color='primary' sx={{ fontSize: 20 }} />
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  Información de contacto
                </Typography>
              </Box>
              <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
                {data.customer.email}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
                {data.customer.phone}
              </Typography>
            </Box>

            {/* Dirección de envío - Mostrar solo si existe */}
            {data.address && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <LocationOn color='primary' sx={{ fontSize: 20 }} />
                  <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                    Dirección de envío
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {data.address.addressLine1}
                  </Typography>
                  {data.address.addressLine2 && (
                    <Typography variant='body2' color='text.secondary'>
                      {data.address.addressLine2}
                    </Typography>
                  )}
                  <Typography variant='body2' color='text.secondary'>
                    {data.address.city}, {data.address.state}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {data.address.postalCode}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {data.address.country}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
      </Paper>

      {/* Botones solo visibles en móviles */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Button
          variant='contained'
          onClick={handleViewOrdersHistory}
          fullWidth
          //disabled={!orderId}
        >
          Ver detalles de la orden
        </Button>

        <Button variant='outlined' onClick={handleResetMobile} fullWidth>
          Volver a inicio
        </Button>
      </Box>
    </Box>
  );
};
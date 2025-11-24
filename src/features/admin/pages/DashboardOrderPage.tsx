import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Loader } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPrice, formatDateLong } from '@/helpers';
import { useOrderAdmin } from '../hooks';

const tableHeaders = ['Producto', 'Cantidad', 'Total'];

const DashboardOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderAdmin(Number(id));

  if (isLoading || !order) return <Loader />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            //bgcolor: 'white',
            //border: '1px solid #e2e8f0',
            transition: 'all 300ms',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Pedido #{id}
          </Typography>
          <Typography variant='body2' sx={{ color: '#6b7280' }}>
            {formatDateLong(order.created_at)}
          </Typography>
        </Box>

        <Box sx={{ width: 48 }} />
      </Box>

      {/* Tabla de Items */}
      <Card
        sx={{
          p: 2.5,
          bgcolor: '#F9FAFB',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
        }}
      >
        <Box sx={{ width: '100%', overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      height: 48,
                      px: 2,
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {order.orderItems.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  {/* Producto */}
                  <TableCell sx={{ p: 2 }}>
                    <Box
                      sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                    >
                      <Box
                        component='img'
                        src={item.productImage}
                        alt={item.productName}
                        sx={{
                          height: 80,
                          width: 80,
                          objectFit: 'contain',
                          borderRadius: 1,
                          //border: '1px solid #e5e7eb',
                        }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                        >
                          {item.productName}
                        </Typography>
                        <Typography
                          sx={{ fontSize: '0.75rem', color: '#6b7280' }}
                        >
                          {/* {item.color_name} / {item.storage} / {item.finish} */}
                          {[item.color_name, item.storage, item.finish].filter(Boolean).join(' • ')}
                        </Typography>
                        <Typography
                          sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                        >
                          {formatPrice(item.price)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Cantidad */}
                  <TableCell
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {item.quantity}
                  </TableCell>

                  {/* Total */}
                  <TableCell
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* Resumen y Dirección */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Resumen */}
        <Card sx={{ p: 2.5, bgcolor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#F9FAFB', boxShadow: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1.5,
                borderBottom: '1px solid #e5e7eb',
                bgcolor: '#F9FAFB',
                boxShadow: 'none',
              }}
            >
              <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1.5,
                borderBottom: '1px solid #e5e7eb',
                bgcolor: '#F9FAFB'
              }}
            >
              <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Envío (Standard)
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(0)}
              </Typography>
            </Box>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                Total
              </Typography>
              <Typography
                sx={{ fontWeight: 700, fontSize: '1rem', color: '#0007d7ff' }}
              >
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Dirección */}
        <Card sx={{ p: 2.5, bgcolor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>
            Dirección de Envío
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#F9FAFB', boxShadow: 'none' }}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  mb: 0.5,
                }}
              >
                Cliente:
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#1e293b' }}>
                {order.customer.full_name}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  mb: 0.5,
                }}
              >
                Dirección:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {order.address.addressLine1}
                </Typography>
                {order.address.addressLine2 && (
                  <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {order.address.addressLine2}
                  </Typography>
                )}
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {order.address.city}, {order.address.state}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {order.address.postalCode}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {order.address.country}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardOrderPage;

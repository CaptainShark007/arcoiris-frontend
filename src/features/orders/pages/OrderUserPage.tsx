import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../hooks';
import { Loader } from '@shared/components';
import { formatDateLong, formatPrice } from '@/helpers';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Stack,
} from '@mui/material';

const tableHeaders = ['Producto', 'Cantidad', 'Total'];

// PAGINA DE UN SOLO PEDIDO DEL USUARIO IDENTIFICADO POR EL ID
const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id!));
  const navigate = useNavigate();

  if (isLoading || !order) return <Loader />;

  return (
    <Box sx={{ mb: 10 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2.5,
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: { xs: '100%', md: 'auto' },
            //bgcolor: 'red',
          }}
        >
          <Button
            variant='outlined'
            startIcon={<ArrowBackIosIcon fontSize='small' />}
            onClick={() => navigate(-1)}
            size='small'
            sx={{ fontWeight: 'bold' }}
          >
            Volver a los pedidos
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            //bgcolor: 'red',
          }}
        >
          <Typography variant='h4' component='h1' fontWeight='bold'>
            Pedido #{id}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {formatDateLong(order.created_at)}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={5}>
        {/* Products Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            maxHeight: 395, // calc(5 * 80px + 56px)
            overflow: 'auto',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'background.default' }}>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header}
                    align={header === 'Producto' ? 'left' : 'center'}
                    sx={{
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      py: 2,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((product, index) => (
                <TableRow
                  key={index}
                  sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <TableCell sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box display='flex' gap={2} alignItems='flex-start' >
                      <Box
                        component='img'
                        src={product.productImage}
                        alt={product.productName}
                        sx={{
                          height: 80,
                          width: 80,
                          objectFit: 'contain',
                          borderRadius: 1,
                          flexShrink: 0,
                          //bgcolor: 'aqua'
                        }}
                      />
                      <Box>
                        <Typography variant='body2' fontWeight='500'>
                          {product.productName}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          display='block'
                        >
                          {product.color_name} / {product.storage}
                        </Typography>
                        <Typography
                          variant='caption'
                          display='block'
                          sx={{ mt: 0.5 }}
                        >
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='center' sx={{ fontWeight: 500, borderBottom: 1, borderColor: 'divider' }}>
                    {product.quantity}
                  </TableCell>
                  <TableCell align='center' sx={{ fontWeight: 500, borderBottom: 1, borderColor: 'divider' }}>
                    {formatPrice(product.price * product.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Section */}
        <Box sx={{ alignSelf: 'flex-end', width: { xs: '100%', sm: '50%' } }}>
          <Stack spacing={1.5}>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='body2' color='text.secondary'>
                Subtotal
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='body2' color='text.secondary'>
                Envío (Standard)
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {formatPrice(0)}
              </Typography>
            </Box>
            <Box
              display='flex'
              justifyContent='space-between'
              sx={{
                pt: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant='subtitle2' fontWeight='600'>
                Total
              </Typography>
              <Typography variant='subtitle2' fontWeight='600'>
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Address Section */}
        <Box>
          <Typography variant='h6' fontWeight='bold' mb={2}>
            Información proporcionada
          </Typography>
          <Card variant='outlined'>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='subtitle2' fontWeight='600' mb={0.5}>
                    Cliente:
                  </Typography>
                  <Typography variant='body2'>
                    {order.customer.full_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' fontWeight='600' mb={1}>
                    Dirección de envío:
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant='body2'>
                      {order.address.addressLine1}
                    </Typography>
                    {order.address.addressLine2 && (
                      <Typography variant='body2'>
                        {order.address.addressLine2}
                      </Typography>
                    )}
                    <Typography variant='body2'>
                      {order.address.city}
                    </Typography>
                    <Typography variant='body2'>
                      {order.address.state}
                    </Typography>
                    <Typography variant='body2'>
                      {order.address.postalCode}
                    </Typography>
                    <Typography variant='body2'>
                      {order.address.country}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default OrderUserPage;

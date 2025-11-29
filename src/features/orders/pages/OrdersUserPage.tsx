import { Link } from "react-router";
import { useOrders } from "../hooks";
import { Loader } from "@shared/components";
import { TableOrders } from "../components";
import { Box, Typography, Button, Stack, Card, CardContent, Divider } from "@mui/material";
import { useCustomer, useUsers } from "@shared/hooks";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const OrdersUserPage = () => {
  const { session, isLoading: sessionLoading } = useUsers();
  const userId = session?.user.id;
  
  const { data: customer, isLoading: customerLoading } = useCustomer(userId!);
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (sessionLoading || customerLoading || ordersLoading) {
    return <Loader />;
  }

  if (!session) {
    return null;
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 }, 
      mb: 5,
      maxWidth: '1200px',
      mx: 'auto'
    }}>

      {/* De momento solo lo mostramos en este archivo */}
      {/* Card de perfil */}
      <Card 
        //elevation={2}
        sx={{ 
          mb: 4,
          borderRadius: 1,
          overflow: 'visible',
          boxShadow: 'none',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.default'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 2, sm: 3 }}
            alignItems={{ xs: 'center', sm: 'flex-start' }}
          >

            {/* Información del usuario */}
            <Box flex={1} width="100%">
              <Typography 
                variant="h5" 
                fontWeight={700}
                mb={2}
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {customer?.full_name || 'Usuario'}
              </Typography>

              <Stack spacing={1.5}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <MailOutlineIcon 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: 20, sm: 22 }
                    }} 
                  />
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: 'text.secondary'
                    }}
                  >
                    {session?.user.email || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <LocalPhoneIcon 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: 20, sm: 22 }
                    }} 
                  />
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: 'text.secondary'
                    }}
                  >
                    {customer?.phone || 'No especificado'}
                  </Typography>
                </Box>
              </Stack>

              {/* Botón de editar */}
              <Button
                component={Link}
                to="/cuenta/editar-perfil"
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ 
                  mt: 3,
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  display: { xs: 'flex', sm: 'inline-flex' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Editar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      {/* Sección de pedidos */}
      <Box mb={3}>
        <Box 
          display="flex" 
          alignItems="center" 
          gap={2}
          mb={2}
        >
          <ShoppingBagIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            component="h2" 
            fontWeight={600}
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Mis Pedidos
          </Typography>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {orders?.length || 0}
          </Box>
        </Box>
      </Box>

      {/* Lista de pedidos o mensaje vacío */}
      {!orders || orders.length === 0 ? (
        <Card elevation={1} sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
          <CardContent>
            <ShoppingBagIcon 
              sx={{ 
                fontSize: { xs: 60, sm: 80 }, 
                color: 'text.secondary',
                opacity: 0.3,
                mb: 2
              }} 
            />
            <Typography 
              variant="h6" 
              mb={1}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Todavía no has hecho ningún pedido
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              mb={3}
            >
              Explora nuestra tienda y encuentra productos increíbles
            </Typography>
            <Button
              component={Link}
              to="/tienda"
              variant="contained"
              size="large"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 4,
                py: 1.5
              }}
            >
              Ir a la tienda
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableOrders orders={orders} />
      )}
    </Box>
  );
};

export default OrdersUserPage;
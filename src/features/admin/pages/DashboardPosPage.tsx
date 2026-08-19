import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { usePosStore } from '../hooks';
import { PosCart, PosProductGrid } from '../components';

const DashboardPosPage = () => {
  const navigate = useNavigate();

  const {
    search,
    setSearch,
    products,
    loadingProducts,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    confirmSale,
    confirmingOrder,
    categoryId,
    setCategoryId,
    page,
    setPage,
    totalProducts,
    fetchingProducts,
    selectedClient,
    setSelectedClient,
  } = usePosStore();

  const handleConfirm = () => {
    confirmSale(undefined, {
      onSuccess: () => {
        toast.success('Venta registrada correctamente');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Error al registrar la venta');
      },
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.2,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
          backgroundColor: 'white',
          flexShrink: 0,
        }}
      >
        <Tooltip title="Volver al panel">
          <IconButton size="small" onClick={() => navigate('/panel')}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography variant="subtitle1" fontWeight={700}>
          Punto de Venta
        </Typography>
      </Box>

      {/* Contenido principal — split panel */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 2,
          p: 2,
          overflow: 'hidden',
        }}
      >
        {/* Panel izquierdo: catálogo */}
        <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <PosProductGrid
            products={products}
            loading={loadingProducts}
            search={search}
            onSearchChange={setSearch}
            onAddToCart={addToCart}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            page={page}
            totalProducts={totalProducts}
            onPageChange={setPage}
            fetching={fetchingProducts}
          />
        </Box>

        {/* Panel derecho: carrito */}
        <Box sx={{ overflow: 'hidden' }}>
          <PosCart
            cart={cart}
            totalItems={totalItems}
            totalAmount={totalAmount}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            onConfirm={handleConfirm}
            confirming={confirmingOrder}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPosPage;
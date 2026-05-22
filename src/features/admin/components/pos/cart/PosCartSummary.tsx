import { Box, Typography, Button, Divider } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

interface PosCartSummaryProps {
  totalItems: number;
  totalAmount: number;
  onConfirm: () => void;
  confirming: boolean;
  disabled: boolean;
}

export const PosCartSummary = ({
  totalItems,
  totalAmount,
  onConfirm,
  confirming,
  disabled,
}: PosCartSummaryProps) => {
  return (
    <Box
      sx={{
        borderTop: '1px solid',
        borderColor: 'grey.300',
        pt: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Total
          </Typography>
          <Typography variant="h6" fontWeight={800} color="primary.main" lineHeight={1}>
            ${totalAmount.toLocaleString('es-AR')}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={disabled || confirming}
        onClick={onConfirm}
        startIcon={<ShoppingCartCheckoutIcon />}
        sx={{
          borderRadius: 1,
          fontWeight: 700,
          fontSize: '0.95rem',
          py: 1.4,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
        }}
      >
        {confirming ? 'Procesando...' : 'Confirmar Venta'}
      </Button>
    </Box>
  );
};
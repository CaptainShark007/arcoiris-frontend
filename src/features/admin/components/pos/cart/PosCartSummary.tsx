//import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
//import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
//import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
//import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
//import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { PaymentMethod } from '@features/admin/hooks/pos/usePosStore';

interface PosCartSummaryProps {
  totalItems: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onConfirm: () => void;
  confirming: boolean;
  disabled: boolean;
}

/* const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'efectivo', label: 'Efectivo', icon: <PaymentsOutlinedIcon fontSize="small" /> },
  { value: 'transferencia', label: 'Transferencia', icon: <AccountBalanceOutlinedIcon fontSize="small" /> },
  { value: 'tarjeta', label: 'Tarjeta', icon: <CreditCardOutlinedIcon fontSize="small" /> },
]; */

export const PosCartSummary = ({
  totalItems,
  totalAmount,
  //paymentMethod,
  //onPaymentMethodChange,
  onConfirm,
  confirming,
  disabled,
}: PosCartSummaryProps) => {
  return (
    <Box
      sx={{
        borderTop: '1px solid',
        borderColor: 'grey.200',
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

      {/* <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
          MÉTODO DE PAGO
        </Typography>
        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          onChange={(_, val) => val && onPaymentMethodChange(val)}
          fullWidth
          size="small"
          sx={{
            gap: 0.5,
            '& .MuiToggleButtonGroup-grouped': {
              border: '1px solid !important',
              borderColor: 'grey.300 !important',
              borderRadius: '8px !important',
              flex: 1,
              flexDirection: 'column',
              gap: 0.3,
              py: 0.8,
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'text.secondary',
              transition: 'all 150ms ease',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                borderColor: 'primary.main !important',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' },
              },
              '&:hover:not(.Mui-selected)': {
                borderColor: 'primary.main !important',
                color: 'primary.main',
                backgroundColor: 'primary.50',
              },
            },
          }}
        >
          {PAYMENT_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.icon}
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box> */}

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={disabled || confirming}
        onClick={onConfirm}
        //startIcon={<ShoppingCartCheckoutIcon />}
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
        {confirming ? 'Procesando...' : 'Pago'}
      </Button>
    </Box>
  );
};
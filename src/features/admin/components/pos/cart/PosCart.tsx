import { Box, Typography, Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { PosCartItem } from './PosCartItem';
import { PosCartSummary } from './PosCartSummary';
import { CartItem } from '@features/admin/hooks/pos/usePosStore';
import { AdminClientSelector } from '../AdminClientSelector';
import { AdminClient } from '@shared/types/admin-client';

interface PosCartProps {
  cart: CartItem[];
  totalItems: number;
  totalAmount: number;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  onClear: () => void;
  onConfirm: () => void;
  confirming: boolean;
  selectedClient: AdminClient | null;
  onSelectClient: (client: AdminClient | null) => void;
}

export const PosCart = ({
  cart,
  totalItems,
  totalAmount,
  onUpdateQuantity,
  onRemove,
  onClear,
  onConfirm,
  confirming,
  selectedClient,
  onSelectClient,
}: PosCartProps) => {
  const isEmpty = cart.length === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'grey.400',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'grey.100',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartOutlinedIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight={700}>
            Carrito
          </Typography>
          {!isEmpty && (
            <Box
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" fontSize="0.65rem" fontWeight={700}>
                {totalItems}
              </Typography>
            </Box>
          )}
        </Box>

        {!isEmpty && (
          <Button
            size="small"
            color="error"
            onClick={onClear}
            startIcon={<DeleteSweepOutlinedIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              py: 0.3,
            }}
          >
            Vaciar
          </Button>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: isEmpty ? 0 : 1 }}>
        {isEmpty ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 1.5,
              py: 4,
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 52, color: 'grey.300' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              El carrito está vacío
            </Typography>
            <Typography variant="caption" color="text.disabled" textAlign="center">
              Agregá productos desde el catálogo
            </Typography>
          </Box>
        ) : (
          cart.map((item) => (
            <PosCartItem
              key={item.variantId}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </Box>

      <Box sx={{ px: 2, pb: 1 }}>
        <AdminClientSelector selectedClient={selectedClient} onSelect={onSelectClient} />
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <PosCartSummary
          totalItems={totalItems}
          totalAmount={totalAmount}
          onConfirm={onConfirm}
          confirming={confirming}
          disabled={isEmpty}
        />
      </Box>
    </Box>
  );
};
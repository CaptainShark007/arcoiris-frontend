import { Box, Typography, Button, TextField, Divider, IconButton } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { BudgetCartLine } from './BudgetCartLine';
import { AdminClientSelector } from '../pos/AdminClientSelector';
import { AdminClient } from '@shared/types/admin-client';
import { BudgetCartLine as BudgetCartLineType } from '@shared/types/budget';

interface BudgetCartProps {
  cart: BudgetCartLineType[];
  totalItems: number;
  totalAmount: number;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
  selectedClient: AdminClient | null;
  onSelectClient: (client: AdminClient | null) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  validityDays: number;
  onValidityChange: (value: number) => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export const BudgetCart = ({
  cart,
  totalItems,
  totalAmount,
  onUpdateQuantity,
  onRemove,
  onClear,
  onSave,
  saving,
  disabled,
  selectedClient,
  onSelectClient,
  notes,
  onNotesChange,
  validityDays,
  onValidityChange,
  onClose,
  onCancel,
}: BudgetCartProps) => {
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
          <DescriptionIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight={700}>
            Presupuesto
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ ml: 0.5 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
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
            <DescriptionIcon sx={{ fontSize: 52, color: 'grey.300' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              El presupuesto está vacío
            </Typography>
            <Typography variant="caption" color="text.disabled" textAlign="center">
              Activá el modo presupuesto y seleccioná productos
            </Typography>
          </Box>
        ) : (
          cart.map((line) => (
            <BudgetCartLine
              key={line.key}
              line={line}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </Box>

      <Box sx={{ px: 2, pb: 1 }}>
        <AdminClientSelector
          selectedClient={selectedClient}
          onSelect={onSelectClient}
        />
      </Box>

      <Box sx={{ px: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          label="Vigencia (días)"
          type="number"
          size="small"
          value={validityDays}
          onChange={(e) => onValidityChange(Number(e.target.value) || 0)}
          InputProps={{ inputProps: { min: 1 } }}
          fullWidth
        />
        <TextField
          label="Notas"
          placeholder="Condiciones, observaciones..."
          size="small"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          multiline
          minRows={2}
          fullWidth
        />
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
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

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={disabled || saving}
          onClick={onSave}
          startIcon={<SaveOutlinedIcon />}
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
          {saving ? 'Guardando...' : 'Guardar presupuesto'}
        </Button>
        {onCancel && (
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={onCancel}
            sx={{
              borderRadius: 1,
              fontWeight: 600,
              fontSize: '0.9rem',
              py: 1.2,
              textTransform: 'none',
              mt: 1,
            }}
          >
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
};

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  ButtonBase,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PosProduct, PosVariant } from '@/actions/pos';

interface PosVariantModalProps {
  product: PosProduct | null;
  open: boolean;
  onClose: () => void;
  onSelectVariant: (product: PosProduct, variant: PosVariant) => void;
}

export const PosVariantModal = ({
  product,
  open,
  onClose,
  onSelectVariant,
}: PosVariantModalProps) => {
  if (!product) return null;

  const handleSelect = (variant: PosVariant) => {
    onSelectVariant(product, variant);
    onClose();
  };

  const getVariantLabel = (variant: PosVariant): string => {
    const parts = [
      variant.color_name,
      variant.storage,
      variant.finish,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : 'Variante estándar';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1 },
      }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Seleccioná una variante
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {product.variants.map((variant) => (
            <ButtonBase
              key={variant.id}
              onClick={() => handleSelect(variant)}
              sx={{
                width: '100%',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
                p: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
                transition: 'all 150ms ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.50',
                },
              }}
            >
              {/* Nombre de variante */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Swatch de color si existe */}
                {variant.color && (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: variant.color,
                      border: '1px solid rgba(0,0,0,0.15)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <Typography variant="body2" fontWeight={500}>
                  {getVariantLabel(variant)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Chip
                  label={`Stock: ${variant.stock}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    backgroundColor: variant.stock <= 3 ? 'warning.50' : 'success.50',
                    color: variant.stock <= 3 ? 'warning.dark' : 'success.dark',
                    border: '1px solid',
                    borderColor: variant.stock <= 3 ? 'warning.200' : 'success.200',
                  }}
                />
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  ${variant.price.toLocaleString('es-AR')}
                </Typography>
              </Box>
            </ButtonBase>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
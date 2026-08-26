import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { BudgetCartLine as BudgetCartLineType } from '@shared/types/budget';

const DEFAULT_IMAGE =
  'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

const getVariantLabel = (v: {
  color_name: string | null;
  storage: string | null;
  finish: string | null;
}): string => {
  return [v.color_name, v.storage, v.finish].filter(Boolean).join(' · ');
};

interface BudgetCartLineProps {
  line: BudgetCartLineType;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}

export const BudgetCartLine = ({
  line,
  onUpdateQuantity,
  onRemove,
}: BudgetCartLineProps) => {
  const [imageError, setImageError] = useState(false);
  const subtotal = line.price * line.quantity;

  const imageSrc =
    imageError || !line.image ? DEFAULT_IMAGE : line.image;

  const variantLabel = getVariantLabel(line);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr auto',
        gridTemplateRows: 'auto auto',
        columnGap: 1.5,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'grey.400',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={line.productName}
        onError={() => setImageError(true)}
        sx={{
          gridColumn: 1,
          gridRow: '1 / 3',
          width: 52,
          height: 52,
          objectFit: 'contain',
          borderRadius: 1,
          bgcolor: '#f5f5f5',
          border: '1px solid',
          borderColor: 'grey.300',
          p: 0.3,
          alignSelf: 'center',
        }}
      />

      {/* Info */}
      <Box sx={{ gridColumn: 2, gridRow: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={800}
          fontSize="0.85rem"
          color="grey.900"
          sx={{ wordBreak: 'break-word', lineHeight: 1.3 }}
        >
          {line.productName}
        </Typography>

        {variantLabel && (
          <Box sx={{ mt: 0.5, mb: 0.5 }}>
            <Typography
              variant="caption"
              color="grey.800"
              fontWeight={600}
              fontSize="0.72rem"
              sx={{
                display: 'inline-block',
                backgroundColor: 'grey.100',
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              {variantLabel}
            </Typography>
          </Box>
        )}

        <Typography
          variant="body2"
          color="primary.main"
          fontWeight={800}
          fontSize="0.85rem"
          display="block"
        >
          ${subtotal.toLocaleString('es-AR')}
        </Typography>
      </Box>

      {/* Eliminar */}
      <IconButton
        size="small"
        onClick={() => onRemove(line.key)}
        sx={{
          gridColumn: 3,
          gridRow: 1,
          alignSelf: 'flex-start',
          color: 'grey.600',
          '&:hover': { color: 'error.main', backgroundColor: 'error.light' },
          p: 0.3,
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Controles de cantidad */}
      <Box
        sx={{
          gridColumn: '2 / 4',
          gridRow: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(line.key, line.quantity - 1)}
          sx={{
            width: 26,
            height: 26,
            border: '1px solid',
            borderColor: 'grey.400',
            borderRadius: 1,
            color: 'text.primary',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <RemoveIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <Typography
          variant="body2"
          fontWeight={800}
          fontSize="0.82rem"
          sx={{ minWidth: 22, textAlign: 'center' }}
        >
          {line.quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(line.key, line.quantity + 1)}
          sx={{
            width: 26,
            height: 26,
            border: '1px solid',
            borderColor: 'grey.400',
            borderRadius: 1,
            color: 'text.primary',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <AddIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

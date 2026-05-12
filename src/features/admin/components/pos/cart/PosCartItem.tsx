import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CartItem } from '@features/admin/hooks/pos/usePosStore';
import { useState } from 'react';

interface PosCartItemProps {
  item: CartItem;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export const PosCartItem = ({ item, onUpdateQuantity, onRemove }: PosCartItemProps) => {
  const subtotal = item.price * item.quantity;

  const getVariantLabel = (): string => {
    const parts = [item.color_name, item.storage, item.finish].filter(Boolean);
    return parts.join(' · ');
  };

  const variantLabel = getVariantLabel();

  const [imageError, setImageError] = useState(false);

  const imageSrc = imageError || !item.image
    ? 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'
    : item.image;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.2,
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={item.productName}
        onError={() => setImageError(true)}
        sx={{
          width: 44,
          height: 44,
          objectFit: 'contain',
          borderRadius: 1,
          backgroundColor: '#f5f5f5',
          flexShrink: 0,
          p: 0.3,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          fontSize="0.78rem"
          noWrap
          title={item.productName}
        >
          {item.productName}
        </Typography>
        {variantLabel && (
          <Typography variant="caption" color="text.secondary" fontSize="0.68rem">
            {variantLabel}
          </Typography>
        )}
        <Typography variant="caption" color="primary.main" fontWeight={700} display="block">
          ${subtotal.toLocaleString('es-AR')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
          sx={{
            width: 24,
            height: 24,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          <RemoveIcon sx={{ fontSize: 14 }} />
        </IconButton>

        <Typography
          variant="body2"
          fontWeight={700}
          fontSize="0.82rem"
          sx={{ minWidth: 22, textAlign: 'center' }}
        >
          {item.quantity}
        </Typography>

        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
          sx={{
            width: 24,
            height: 24,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          <AddIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      <IconButton
        size="small"
        onClick={() => onRemove(item.variantId)}
        sx={{
          color: 'grey.400',
          flexShrink: 0,
          '&:hover': { color: 'error.main' },
        }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
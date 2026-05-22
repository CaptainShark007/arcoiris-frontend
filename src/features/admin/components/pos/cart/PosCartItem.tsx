import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { CartItem } from '@features/admin/hooks/pos/usePosStore';
import { useState } from 'react';

interface PosCartItemProps {
  item: CartItem;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export const PosCartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: PosCartItemProps) => {
  const subtotal = item.price * item.quantity;
  const [imageError, setImageError] = useState(false);

  const getVariantLabel = (): string => {
    const parts = [item.color_name, item.storage, item.finish].filter(Boolean);
    return parts.join(' · ');
  };

  const variantLabel = getVariantLabel();

  const imageSrc =
    imageError || !item.image
      ? 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'
      : item.image;

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
      {/* Imagen — ocupa las 2 filas */}
      <Box
        component='img'
        src={imageSrc}
        alt={item.productName}
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
          variant='body2'
          fontWeight={800}
          fontSize='0.85rem'
          color='grey.900'
          sx={{ wordBreak: 'break-word', lineHeight: 1.3 }}
        >
          {item.productName}
        </Typography>
        {variantLabel && (
          <Box sx={{ mt: 0.5, mb: 0.5 }}>
            <Typography
              variant='caption'
              color='grey.800'
              fontWeight={600}
              fontSize='0.72rem'
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
          variant='body2'
          color='primary.main'
          fontWeight={800}
          fontSize='0.85rem'
          display='block'
        >
          ${subtotal.toLocaleString('es-AR')}
        </Typography>
      </Box>

      {/* Botón eliminar — arriba a la derecha */}
      <IconButton
        size='small'
        onClick={() => onRemove(item.variantId)}
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

      {/* Controles de cantidad — fila 2, columnas 2-3 */}
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
          size='small'
          onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
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
          variant='body2'
          fontWeight={800}
          fontSize='0.82rem'
          sx={{ minWidth: 22, textAlign: 'center' }}
        >
          {item.quantity}
        </Typography>
        <IconButton
          size='small'
          onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
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

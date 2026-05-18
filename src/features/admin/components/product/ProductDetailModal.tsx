import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import LinkIcon from '@mui/icons-material/Link';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetProductById } from '@features/admin/hooks';

const BASE_URL = 'https://www.tiendaarcoiris.net/tienda/';

interface ProductDetailModalProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

const DEFAULT_IMAGE = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

export const ProductDetailModal = ({ productId, open, onClose }: ProductDetailModalProps) => {
  const { product, isLoading, isError } = useGetProductById(productId ?? undefined);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!open) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockColor = (stock: number) => {
    if (stock > 10) return { bg: '#DCFCE7', color: '#14532D', border: '#22C55E' };
    if (stock > 0) return { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' };
    return { bg: '#FEE2E2', color: '#991B1B', border: '#EF4444' };
  };

  const getVariantLabel = (variant: any): string => {
    const parts = [variant.color_name, variant.storage, variant.finish].filter(Boolean);
    return parts.length > 0 ? parts.join(' • ') : 'Estándar';
  };

  const totalStock = product?.variants?.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0) ?? 0;

  const handleCopyLink = async () => {
    if (!product?.slug) return;
    
    const fullUrl = `${BASE_URL}${product.slug}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#111827">
          Detalle del Producto
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        ) : isError || !product ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, px: 3 }}>
            <WarningAmberIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No se pudo cargar la información del producto.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
              <Box
                component="img"
                src={product.images?.[0] ?? DEFAULT_IMAGE}
                alt={product.name}
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: 1.5,
                  objectFit: 'contain',
                  border: '1px solid #E5E7EB',
                  bgcolor: '#FAFAFA',
                  p: 1,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700} color="#111827" lineHeight={1.3} mb={1}>
                  {product.name}
                </Typography>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  <Chip
                    icon={<BadgeIcon sx={{ fontSize: '16px !important' }} />}
                    label={product.brand}
                    size="small"
                    sx={{
                      bgcolor: '#F3F4F6',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      borderRadius: 1,
                    }}
                  />
                  <Chip
                    icon={copySuccess 
                      ? <CheckCircleIcon sx={{ fontSize: '16px !important', color: '#16A34A' }} />
                      : <LinkIcon sx={{ fontSize: '16px !important' }} />
                    }
                    label={product.slug}
                    size="small"
                    onClick={handleCopyLink}
                    sx={{
                      bgcolor: '#EEF2FF',
                      color: '#4338CA',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: 24,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#E0E7FF',
                        transform: 'scale(1.02)',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      bgcolor: product.is_active ? '#DCFCE7' : '#E5E7EB',
                      color: product.is_active ? '#14532D' : '#1F2937',
                      border: '1px solid',
                      borderColor: product.is_active ? '#22C55E' : '#9CA3AF',
                    }}
                  >
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </Box>
                </Stack>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    <Typography variant="body2" color="#374151">
                      <strong>Categoría:</strong>{' '}
                      {product.categories?.name ?? 'Sin categoría'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    <Typography variant="body2" color="#374151">
                      <strong>Stock total:</strong>{' '}
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          color: totalStock === 0 ? '#991B1B' : totalStock <= 5 ? '#92400E' : '#166534',
                        }}
                      >
                        {totalStock} unidades
                      </Box>
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} color="#111827">
                  Variantes del Producto
                </Typography>
                <Chip
                  label={`${product.variants?.length ?? 0} variante${product.variants?.length === 1 ? '' : 's'}`}
                  size="small"
                  sx={{
                    bgcolor: '#EEF2FF',
                    color: '#4338CA',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>

              {product.variants && product.variants.length > 0 ? (
                <TableContainer
                  sx={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 1,
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: '#6B7280',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E5E7EB',
                            py: 1.5,
                          }}
                        >
                          Variante
                        </TableCell>
                        <TableCell
                          sx={{
                            color: '#6B7280',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E5E7EB',
                            py: 1.5,
                            textAlign: 'right',
                          }}
                        >
                          Precio
                        </TableCell>
                        <TableCell
                          sx={{
                            color: '#6B7280',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E5E7EB',
                            py: 1.5,
                            textAlign: 'center',
                          }}
                        >
                          Existencia
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.variants.map((variant: any) => {
                        const stockStyle = getStockColor(variant.stock);
                        return (
                          <TableRow
                            key={variant.id}
                            sx={{
                              '&:hover': { bgcolor: '#F9FAFB' },
                              '&:last-child td': { borderBottom: 0 },
                            }}
                          >
                            <TableCell sx={{ borderBottom: '1px solid #E5E7EB', py: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                                <Typography variant="body2" fontWeight={500} color="#111827">
                                  {getVariantLabel(variant)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #E5E7EB',
                                py: 1.5,
                                textAlign: 'right',
                              }}
                            >
                              {variant.original_price && variant.original_price > variant.price ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ textDecoration: 'line-through', color: '#9CA3AF' }}
                                  >
                                    {formatPrice(variant.original_price)}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                      label="Oferta"
                                      size="small"
                                      sx={{
                                        height: 18,
                                        fontSize: '0.6rem',
                                        fontWeight: 700,
                                        bgcolor: '#FEE2E2',
                                        color: '#991B1B',
                                        border: '1px solid #FECACA',
                                      }}
                                    />
                                    <Typography variant="body2" fontWeight={800} color="#111827">
                                      {formatPrice(variant.price)}
                                    </Typography>
                                  </Box>
                                </Box>
                              ) : (
                                <Typography variant="body2" fontWeight={800} color="#111827">
                                  {formatPrice(variant.price)}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: '1px solid #E5E7EB',
                                py: 1.5,
                                textAlign: 'center',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  bgcolor: stockStyle.bg,
                                  color: stockStyle.color,
                                  border: '1px solid',
                                  borderColor: stockStyle.border,
                                }}
                              >
                                {variant.stock} unidades
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 6,
                    bgcolor: '#F9FAFB',
                    borderRadius: 1,
                    border: '1px dashed #E5E7EB',
                  }}
                >
                  <InventoryIcon sx={{ fontSize: 40, color: '#9CA3AF', mb: 1.5 }} />
                  <Typography variant="body2" color="#6B7280" fontWeight={500}>
                    Este producto no tiene variantes
                  </Typography>
                  <Typography variant="caption" color="#9CA3AF">
                    Producto simple (sin opciones de color, almacenamiento, etc.)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
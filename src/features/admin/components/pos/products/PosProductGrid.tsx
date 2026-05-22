// src/features/pos/components/products/PosProductGrid.tsx
import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Skeleton,
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import { PosProduct, PosVariant } from '@/actions/pos';
import { PosProductCard } from './PosProductCard';
import { PosVariantModal } from './PosVariantModal';
import { PosCategoryTabs } from './PosCategoryTabs';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

interface PosProductGridProps {
  products: PosProduct[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onAddToCart: (product: PosProduct, variant: PosVariant) => void;
  categoryId: string | null;
  onCategoryChange: (id: string | null) => void;
  page: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  fetching: boolean;
}

export const PosProductGrid = ({
  products,
  loading,
  search,
  onSearchChange,
  onAddToCart,
  categoryId,
  onCategoryChange,
  page,
  totalProducts,
  onPageChange,
  fetching,
}: PosProductGridProps) => {
  const [modalProduct, setModalProduct] = useState<PosProduct | null>(null);

  const handleProductSelect = (product: PosProduct, variant?: PosVariant) => {
    if (variant) {
      onAddToCart(product, variant);
    } else {
      setModalProduct(product);
    }
  };

  const handleVariantSelect = (product: PosProduct, variant: PosVariant) => {
    onAddToCart(product, variant);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Buscador */}
      <TextField
        fullWidth
        size="small"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {fetching ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SearchIcon fontSize="small" sx={{ color: 'text.primary' }} />
              )}
            </InputAdornment>
          ),
          sx: { borderRadius: 1, backgroundColor: 'white', border: '1px solid', borderColor: 'grey.400' },
        }}
      />

      <PosCategoryTabs selected={categoryId} onChange={onCategoryChange} />

      {/* Contenido */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5, py: 0.5 }}>
        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
                lg: 'repeat(6, 1fr)',
              },
              gap: 1.5,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : products.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50%',
              gap: 1.5,
              color: 'text.secondary',
            }}
          >
            <InventoryIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary">
              {search.length >= 2
                ? `Sin resultados para "${search}"`
                : 'No hay productos con stock disponible'}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(5, 1fr)',
                  lg: 'repeat(6, 1fr)',
                },
                gap: 1.5,
                opacity: fetching ? 0.6 : 1,
                transition: 'opacity 200ms ease',
              }}
            >
              {products.map((product) => (
                <PosProductCard key={product.id} product={product} onSelect={handleProductSelect} />
              ))}
            </Box>
            
            {totalProducts > 40 && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, pt: 2, pb: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                >
                  <KeyboardArrowLeft fontSize="small" />
                </IconButton>

                {Array.from({ length: Math.ceil(totalProducts / 40) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="small"
                    variant={p === page ? 'contained' : 'outlined'}
                    color={p === page ? 'primary' : 'inherit'}
                    onClick={() => onPageChange(p)}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      p: 0,
                      borderColor: p === page ? 'primary.main' : 'divider',
                      color: p === page ? 'white' : 'text.primary',
                    }}
                  >
                    {p}
                  </Button>
                ))}

                <IconButton
                  size="small"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= Math.ceil(totalProducts / 40)}
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                >
                  <KeyboardArrowRight fontSize="small" />
                </IconButton>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Modal de variantes */}
      <PosVariantModal
        product={modalProduct}
        open={!!modalProduct}
        onClose={() => setModalProduct(null)}
        onSelectVariant={handleVariantSelect}
      />
    </Box>
  );
};
import { Box, Typography, Button, Stack } from '@mui/material';
import { CartList, CartSearch } from '@shared/components';
import { useCartStore } from '@/storage/useCartStore';
import { useState } from 'react';

interface CartStepProps {
  onNext: () => void;
}

export const CartStep = ({ onNext }: CartStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const items = useCartStore(state => state.items);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
        spacing={2}
        sx={{ 
          mb: 1,
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'semibold' }}>
          Vista previa de la orden
        </Typography>

        {items.length > 0 && (
          <Box sx={{ maxWidth: '600px', width: '100%' }}>
            <CartSearch onSearchChange={setSearchQuery} />
          </Box>
        )}
      </Stack>

      {/* CONTENEDOR CON ALTURA FIJA Y SCROLL */}
      <Box
        sx={{
          maxHeight: '282px',
          overflowY: 'auto',
          overflowX: 'hidden',
          mb: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'grey.100',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.400',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'grey.500',
            },
          },
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
        }}
      >
        {filteredItems.length > 0 ? (
          <CartList items={filteredItems} />
        ) : searchQuery ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No se encontraron productos que coincidan con {searchQuery}
            </Typography>
          </Box>
        ) : (
          <CartList />
        )}
      </Box>

      {/* Botón solo visible en móviles */}
      <Button 
        variant="contained" 
        onClick={onNext}
        disabled={items.length === 0}
        fullWidth
        sx={{ 
          mt: 2, 
          mb: 8,
          display: { xs: 'block', md: 'none' }
        }}
      >
        Continuar con entrega
      </Button>
    </Box>
  );
};
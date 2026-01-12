/* import { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { CartList } from '../../../shared/components/CartList';
import { CartSummary } from '../../../shared/components/CartSummary';
import { CartSearch } from '../../../shared/components/CartSearch';
import { useCartStore } from '../../../storage/useCartStore';

const CartPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query }); 
    } else {
      setSearchParams({}); 
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth='xl' sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant='h3' component='h1' gutterBottom sx={{ mb: 4 }}>
        Carrito de Compras
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          {items.length > 0 && (
            <CartSearch onSearchChange={handleSearchChange} />
          )}
          {filteredItems.length > 0 ? (
            <CartList items={filteredItems} />
          ) : searchQuery ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                No se encontraron productos que coincidan con "{searchQuery}"
              </Typography>
            </Box>
          ) : (
            <CartList />
          )}
        </Box>

        <Box>
          <CartSummary />
        </Box>
      </Box>
    </Container>
  );
};

export default CartPage;
 */
import { useState, useEffect } from 'react';
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

  // Cuando el usuario escribe en el buscador: actualiza el estado local y actualiza la URL con el texto buscado
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query }); 
    } else {
      setSearchParams({}); 
    }
  };

  // Filtra los productos del carrito según lo que escribió el usuario
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth='xl' sx={{ py: { xs: 3, md: 5 } }}>
      {/* Título de la página */}
      <Typography variant='h3' component='h1' gutterBottom sx={{ mb: 4 }}>
        Carrito de Compras
      </Typography>

      {/* Grid de 2 columnas: Izquierda = productos, Derecha = resumen */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, // 1 col en móvil, 2 en desktop
          gap: 3,
        }}
      >
        {/* COLUMNA IZQUIERDA: Lista de productos */}
        <Box>
          {/* Muestra el buscador solo si hay productos en el carrito */}
          {items.length > 0 && (
            <CartSearch onSearchChange={handleSearchChange} />
          )}
          
          {/* Decide qué mostrar según los resultados de búsqueda: */}
          {filteredItems.length > 0 ? (
            // Caso 1: Hay productos que coinciden → muestra la lista filtrada
            <CartList items={filteredItems} />
          ) : searchQuery ? (
            // Caso 2: No hay coincidencias pero sí hay texto buscado → mensaje de "no encontrado"
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                No se encontraron productos que coincidan con "{searchQuery}"
              </Typography>
            </Box>
          ) : (
            // Caso 3: No hay búsqueda → muestra el carrito normal (vacío o con productos)
            <CartList />
          )}
        </Box>

        {/* COLUMNA DERECHA: Resumen del pedido (total, botones) */}
        <Box>
          <CartSummary />
        </Box>
      </Box>
    </Container>
  );
};

export default CartPage;

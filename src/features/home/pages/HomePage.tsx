import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { carouselSlides, categories } from '../data/mockData'
import { CategoryCarousel, HeroCarousel, ProductCarousel } from '../components';
import { useHomeProducts } from '../hooks/products/useHomeProducts';

const HomePage = () => {
  const { recentProducts, popularProducts, isLoading, isError } = useHomeProducts();

  if (isError) {
    return (
      <Container>
        <Typography color="error" sx={{ py: 4, textAlign: 'center' }}>
          Error al cargar los productos
        </Typography>
      </Container>
    );
  }

  return (
    <Box className="homepage">
      {/* Carrusel inicial */}
      <HeroCarousel slides={carouselSlides} />
      
      {/* Contenedor con padding */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Categorias */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <CategoryCarousel categories={categories} />
        </Box>

        {/* Nuevos Ingresos */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
              marginLeft: 5
            }}
          >
            Nuevos Ingresos
          </Typography>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <ProductCarousel 
              products={recentProducts || []}
              showOriginalPrice={false}
            />
          )}
        </Box>

        {/* Productos Populares */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
              marginLeft: 5
            }}
          >
            Productos Populares
          </Typography>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <ProductCarousel 
              products={popularProducts || []}
              showOriginalPrice={false}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
import { Box, Container, Typography } from "@mui/material";
import { 
  carouselSlides, 
  categories, 
  allProducts,
} from '../data/mockData'
import { CategoryCarousel, HeroCarousel, ProductCarousel } from '../components';

const HomePage = () => {
  return (
    <Box className="homepage">
      {/* Carrusel inicial - sin padding para que ocupe todo el ancho */}
      <HeroCarousel slides={carouselSlides} />
      
      {/* Contenedor con padding para el resto del contenido */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Categorias */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          {/* <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Categorías
          </Typography> */}
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
          <ProductCarousel 
            products={allProducts}
            showOriginalPrice={false}
          />
        </Box>

        {/* Los Más Vendidos */}
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
            Los Más Vendidos
          </Typography>
          <ProductCarousel 
            products={allProducts}
            showOriginalPrice={false}
          />
        </Box>

        {/* Ofertas Especiales */}
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
            Ofertas Especiales
          </Typography>
          <ProductCarousel 
            products={allProducts}
            showOriginalPrice={true}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
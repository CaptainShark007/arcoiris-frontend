import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { carouselSlides } from '../data/mockData'
import { CategoryCarousel, HeroCarousel, ProductCarousel } from '../components';
import { useHomeProducts } from '../hooks/useHomeProducts';
import { useCategories } from "@features/shop/hooks/products/useCategories";
import { Loader, SeoHead } from "@shared/components";

const HomePage = () => {

  const { recentProducts, saleProducts, randomProducts, isLoading, isError } = useHomeProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  if (isError) {
    return (
      <Container>
        <Typography color="error" sx={{ py: 4, textAlign: 'center' }}>
          Error al cargar los productos
        </Typography>
      </Container>
    );
  }

  if (isCategoriesLoading) return <Loader />;

  return (
    <>
      <SeoHead
        title="Inicio"
        description="Bienvenido a Arcoiris - Tu tienda de productos de pinturas y ferreteria"
      />
      <Box className="homepage">
        {/* Carrusel inicial */}
        <HeroCarousel slides={carouselSlides} />
        
        {/* Contenedor con padding */}
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
          {/* Categorias */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <CategoryCarousel categories={categories} />
          </Box>

          {/* Ofertas */}
          <Box 
            sx={{ 
              position: 'relative',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: { xs: 4, md: 6 },
              pt: 6,
              px: 2,
              pb: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -1,
                left: -1,
                backgroundColor: 'primary.main',
                color: 'common.white',
                py: 1,
                px: 3,
                borderTopLeftRadius: 8,
                borderBottomRightRadius: 8,
                boxShadow: 1
              }}
            >
              <Typography 
                variant="h6"
                component="h2"
                sx={{ 
                  fontWeight: 700,
                }}
              >
                Ofertas únicas
              </Typography>
            </Box>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ProductCarousel 
                products={saleProducts || []}
              />
            )}
          </Box>

          {/* Nuevos ingresos */}
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
              Fijate lo nuevo
            </Typography>
            
            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ProductCarousel 
                products={recentProducts || []}
              />
            )}
          </Box>

          {/* Otros productos */}
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
              Otros productos
            </Typography>
            
            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ProductCarousel 
                products={randomProducts || []}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
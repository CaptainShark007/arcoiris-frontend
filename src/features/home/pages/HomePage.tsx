import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { carouselSlides } from '../data/mockData'
import { CategoryCarousel, HeroCarousel, ProductCarousel } from '../components';
import { useHomeProducts } from '../hooks/useHomeProducts';
import { useCategories } from "@features/shop/hooks/products/useCategories";
import { Loader, SeoHead } from "@shared/components";
//import useSEO from "@shared/hooks/useSEO";

const HomePage = () => {

  //useSEO("Inicio", "Bienvenido a Arcoiris - Tu tienda de productos de pinturas y ferreteria");
  
  const { recentProducts, popularProducts, isLoading, isError } = useHomeProducts();
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
          {/* <Box sx={{ 
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            mb: { xs: 4, md: 6 } 
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
                marginLeft: 5
              }}
            >
              Ofertas únicas
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
          </Box> */}

          {/* Ofertas */}
          <Box 
            sx={{ 
              position: 'relative', // 1. Necesario para posicionar el título absolutamente dentro
              border: 1,
              borderColor: 'divider',
              borderRadius: 1, // Aumenté un poco el radio para que se vea más moderno
              mb: { xs: 4, md: 6 },
              pt: 6, // 4. Padding superior IMPORTANTE para que el carrusel no quede debajo del título
              px: 2,
              pb: 2
            }}
          >
            {/* ESTE ES EL NUEVO BLOQUE DEL TÍTULO */}
            <Box
              sx={{
                position: 'absolute',
                top: -1, // Se mueve 1px hacia arriba para tapar el borde del contenedor padre
                left: -1, // Se mueve 1px hacia la izquierda para tapar el borde
                backgroundColor: 'primary.main', // Color violeta similar al de la imagen (puedes usar 'primary.main' si tu tema lo tiene)
                color: 'common.white', // Texto blanco
                py: 1, // Padding vertical
                px: 3, // Padding horizontal
                borderTopLeftRadius: 8, // Bordes redondeados solo en las esquinas superiores
                borderBottomRightRadius: 8,
                boxShadow: 1 // Sombra suave para darle profundidad
              }}
            >
              <Typography 
                variant="h6" // Usamos h6 para que no sea excesivamente grande dentro de la etiqueta
                component="h2"
                sx={{ 
                  fontWeight: 700, // Negrita
                  // Quitamos los márgenes y tamaños anteriores ya que el Box contenedor maneja el espacio
                }}
              >
                Ofertas únicas
              </Typography>
            </Box>
            {/* FIN DEL NUEVO BLOQUE DEL TÍTULO */}

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
                products={popularProducts || []}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
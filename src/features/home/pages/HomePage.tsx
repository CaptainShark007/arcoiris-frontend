import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { carouselSlides } from '../data/mockData';
import { CategoryCarousel } from '../components';
import { useHomeProducts } from '../hooks/useHomeProducts';
import { useCategories } from '@features/shop/hooks/products/useCategories';
import { HeroCarousel, Loader, ProductCarousel, SeoHead } from '@shared/components';
import { motion, Variants } from 'framer-motion';
import { SectionHeader } from '@shared/components';

const MotionBox = motion(Box);

const sectionAnimation: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const HomePage = () => {
  const { recentProducts, saleProducts, randomProducts, isLoading, isError } =
    useHomeProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  // Lógica: Mostrar ofertas si está cargando (para ver el spinner) O si hay productos reales.
  // Si terminó de cargar y saleProducts está vacío, esto será false y ocultará la sección.
  const shouldShowOffers =
    isLoading || (saleProducts && saleProducts.length > 0);

  if (isError) {
    return (
      <Container>
        <Typography color='error' sx={{ py: 4, textAlign: 'center' }}>
          Error al cargar los productos
        </Typography>
      </Container>
    );
  }

  if (isCategoriesLoading) return <Loader />;

  return (
    <>
      <SeoHead
        title='Inicio'
        description='Bienvenido a Arcoiris - Tu tienda de productos de pinturas y ferreteria'
      />
      <Box className='homepage' sx={{ overflowX: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroCarousel slides={carouselSlides} />
        </motion.div>

        <Container maxWidth='xl' sx={{ py: { xs: 3, md: 5 } }}>
          {/* Categorias */}
          <MotionBox
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-50px' }}
            variants={sectionAnimation}
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            <CategoryCarousel categories={categories} />
          </MotionBox>

          {/* Ofertas */}
          {shouldShowOffers && (
            <MotionBox
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, margin: '-100px' }}
              variants={sectionAnimation}
              sx={{
                position: 'relative',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: { xs: 4, md: 6 },
                pt: 6,
                px: 2,
                pb: 2,
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
                  boxShadow: 1,
                  zIndex: 1,
                }}
              >
                <Typography
                  variant='h6'
                  component='h2'
                  sx={{ fontWeight: 700 }}
                >
                  Ofertas únicas
                </Typography>
              </Box>

              {/* Botón ver más */}
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <SectionHeader title='' linkTo='/tienda?ofertas=true' />
              </Box>

              {isLoading ? (
                <Box display='flex' justifyContent='center' py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProductCarousel products={saleProducts || []} />
              )}
            </MotionBox>
          )}

          {/* Nuevos ingresos */}
          <MotionBox
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={sectionAnimation}
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            <SectionHeader title='Fijate lo nuevo' />

            {isLoading ? (
              <Box display='flex' justifyContent='center' py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ProductCarousel products={recentProducts || []} />
            )}
          </MotionBox>

          {/* Otros productos */}
          <MotionBox
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={sectionAnimation}
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            <SectionHeader title='Otros productos' />

            {isLoading ? (
              <Box display='flex' justifyContent='center' py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <ProductCarousel products={randomProducts || []} />
            )}
          </MotionBox>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;

import { Box, CircularProgress } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { SectionHeader } from '@shared/components';
import { useSimilarProducts } from '../hooks/useSimilarProducts';
import { ProductCarousel } from '@features/home/components';

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

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export const RelatedProductsSection = ({ categoryId, currentProductId }: RelatedProductsProps) => {
  const { similarProducts, isLoading } = useSimilarProducts(categoryId, currentProductId);

  if (!isLoading && (!similarProducts || similarProducts.length === 0)) {
    return null;
  }

  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={sectionAnimation}
      sx={{ 
        mb: { xs: 4, md: 6 }, 
        mt: { xs: 4, md: 8 },
        pt: 4,
        borderTop: '1px solid #e0e0e0'
      }}
    >
      <SectionHeader title="También te podría interesar" />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductCarousel products={similarProducts || []} />
      )}
    </MotionBox>
  );
};
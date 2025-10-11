import { Box, Typography, IconButton } from '@mui/material';
import { useCallback, memo } from 'react';
import { useCarousel } from '@shared/hooks/useCarousel';
import type { Product } from '@shared/types';
import { ProductCard } from '@shared/components/ProductCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  showOriginalPrice?: boolean;
}

export const ProductCarousel = memo(
  ({ products, title, showOriginalPrice = false }: ProductCarouselProps) => {
    const itemsPerSlide = 4;
    const totalSlides = Math.ceil(products.length / itemsPerSlide);

    const { currentIndex, isAnimating, nextSlide, prevSlide } = useCarousel({
      slidesCount: totalSlides,
      autoPlay: false,
      infinite: false,
    });

    const handleAddToCart = useCallback((product: Product) => {
      console.log(`Agregar ${product.name} al carrito`);
    }, []);

    const createSlides = () => {
      const slides = [];
      for (let i = 0; i < totalSlides; i++) {
        const start = i * itemsPerSlide;
        let slideProducts = products.slice(start, start + itemsPerSlide);

        if (slideProducts.length < itemsPerSlide) {
          slideProducts = [
            ...slideProducts,
            ...products.slice(0, itemsPerSlide - slideProducts.length),
          ];
        }
        slides.push(slideProducts);
      }
      return slides;
    };

    const slides = createSlides();
    const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

    return (
      <Box sx={{ position: 'relative', py: 4 }}>
        <Typography variant='h4' sx={{ mb: 3, ml: 8, fontWeight: 'bold' }}>
          {title}
        </Typography>

        <Box sx={{ overflow: 'hidden', mx: 6 }}>
          <Box
            sx={{
              display: 'flex',
              transition: isAnimating
                ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'none',
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {extendedSlides.map((slideProducts, slideIndex) => (
              <Box
                key={slideIndex}
                sx={{
                  minWidth: '100%',
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 2,
                  px: 1,
                  flexShrink: 0,
                }}
              >
                {slideProducts.map((product, idx) => (
                  <Box key={`${product.id}-${slideIndex}-${idx}`}>
                    <ProductCard
                      product={product}
                      showOriginalPrice={showOriginalPrice}
                      onAddToCart={handleAddToCart}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        <IconButton
          onClick={prevSlide}
          disabled={isAnimating}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            bgcolor: 'action.disabled',
            color: 'text.primary',
            opacity: 0.6,
            zIndex: 2,
            '&:hover': {
              bgcolor: 'action.disabled',
              opacity: 0.8,
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.3s ease',
            '&:disabled': {
              bgcolor: 'action.disabled',
              opacity: 0.3,
            },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          disabled={isAnimating}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 8,
            transform: 'translateY(-50%)',
            bgcolor: 'action.disabled',
            color: 'text.primary',
            opacity: 0.6,
            zIndex: 2,
            '&:hover': {
              bgcolor: 'action.disabled',
              opacity: 0.8,
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.3s ease',
            '&:disabled': {
              bgcolor: 'action.disabled',
              opacity: 0.3,
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    );
  }
);

ProductCarousel.displayName = 'ProductCarousel';

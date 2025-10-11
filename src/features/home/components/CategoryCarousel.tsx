import { Box, /* Typography, */ IconButton, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useCarousel } from '@shared/hooks/useCarousel';
import type { Category } from '../types/home.types';

interface CategoryCarouselProps {
  categories: Category[];
}

export const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  const itemsPerSlide = 6; // Muestra 5 categorías por slide
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const { currentIndex, isAnimating, nextSlide, prevSlide } = useCarousel({
    slidesCount: totalSlides,
    autoPlay: false,
    infinite: true,
  });

  // Crear slides con las categorías
  const createSlides = () => {
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
      const start = i * itemsPerSlide;
      let slideCategories = categories.slice(start, start + itemsPerSlide);

      // Si el último slide tiene menos items, completar con los primeros
      if (slideCategories.length < itemsPerSlide) {
        slideCategories = [
          ...slideCategories,
          ...categories.slice(0, itemsPerSlide - slideCategories.length),
        ];
      }
      slides.push(slideCategories);
    }
    return slides;
  };

  const slides = createSlides();
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  return (
    <Box sx={{ position: 'relative', py: 2 }}>
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
          {extendedSlides.map((slideCategories, slideIndex) => (
            <Box
              key={slideIndex}
              sx={{
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: 6,
                px: 2,
                flexShrink: 0,
              }}
            >
              {slideCategories.map((category, idx) => (
                <Box
                  key={`${category.id}-${slideIndex}-${idx}`}
                  sx={{
                    flex: '0 0 auto',
                    textAlign: 'center',
                    width: 180,
                    /* backgroundColor: "red", */
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 160,
                      height: 160,
                      /* borderRadius: "50%", */
                      overflow: 'hidden',
                      mx: 'auto',
                      mb: 1,
                      /* boxShadow: 3, */
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                  {/* <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {category.name.toUpperCase()}
                  </Typography> */}
                  <Button
                    variant='outlined'
                    sx={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    }}
                  >
                    {category.name.toUpperCase()}
                  </Button>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Botón Anterior */}
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

      {/* Botón Siguiente */}
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
};

import { Box, Typography, Button, IconButton } from '@mui/material';
import { useCarousel } from '@shared/hooks/useCarousel';
import type { CarouselSlide } from '../types/home.types';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const { currentIndex, isAnimating, nextSlide, prevSlide, goToSlide } =
    useCarousel({
      slidesCount: slides.length,
      autoPlay: true,
      autoPlayInterval: 5000,
      infinite: true,
    });

  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Slides Container */}
      <Box
        sx={{
          display: 'flex',
          transition: isAnimating
            ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {extendedSlides.map((slide, index) => (
          <Box
            key={`${slide.id}-${index}`}
            sx={{
              minWidth: '100%',
              position: 'relative',
              height: { xs: 400, md: 400 },
              flexShrink: 0,
            }}
          >
            <Box
              component='img'
              src={slide.image}
              alt={slide.title}
              loading={index === 1 ? 'eager' : 'lazy'} // Primera imagen eager, resto lazy
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                bgcolor: 'action.hover',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: { xs: '5%', md: '10%' },
                transform: 'translateY(-50%)',
                color: 'white',
                maxWidth: { xs: '85%', md: '45%' },
                zIndex: 1,
              }}
            >
              <Typography
                variant='h2'
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  opacity: 0.95,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                {slide.subtitle}
              </Typography>
              <Button
                variant='contained'
                size='large'
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                  /* borderRadius: 24, */
                }}
                onClick={() => console.log(slide.buttonText)}
              >
                {slide.buttonText}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={prevSlide}
        disabled={isAnimating}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 8,
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          color: 'primary.main',
          opacity: 0.9,
          zIndex: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            opacity: 1,
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.3s ease',
          '&:disabled': {
            bgcolor: 'background.paper',
            opacity: 0.5,
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
          bgcolor: 'background.paper',
          color: 'primary.main',
          opacity: 0.9,
          zIndex: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            opacity: 1,
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.3s ease',
          '&:disabled': {
            bgcolor: 'background.paper',
            opacity: 0.5,
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1.5,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: currentIndex - 1 === index ? 40 : 12,
              height: 12,
              borderRadius: 6,
              bgcolor:
                currentIndex - 1 === index
                  ? 'background.paper'
                  : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              '&:hover': {
                bgcolor: 'background.paper',
                transform: 'scale(1.1)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

/* no se usa */

import { Box, IconButton } from '@mui/material';
import { useCarousel } from '../hooks/useCarousel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  infinite?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  height?: string | number;
  className?: string;
}

export const Carousel = ({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  infinite = true,
  showArrows = true,
  showDots = true,
  height = 400,
  className,
}: CarouselProps) => {
  const { currentIndex, isAnimating, nextSlide, prevSlide, goToSlide } =
    useCarousel({
      slidesCount: children.length,
      autoPlay,
      autoPlayInterval,
      infinite,
    });

  const extendedChildren = infinite
    ? [children[children.length - 1], ...children, children[0]]
    : children;

  return (
    <Box
      sx={{ position: 'relative', width: '100%', overflow: 'hidden', height }}
      className={className}
    >
      {/* Slides Container */}
      <Box
        sx={{
          display: 'flex',
          transition: isAnimating
            ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
          transform: `translateX(-${currentIndex * 100}%)`,
          height: '100%',
        }}
      >
        {extendedChildren.map((child, index) => (
          <Box
            key={index}
            sx={{
              minWidth: '100%',
              height: '100%',
              flexShrink: 0,
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
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
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
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
          {children.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex - (infinite ? 1 : 0) === index ? 40 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor:
                  currentIndex - (infinite ? 1 : 0) === index
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
      )}
    </Box>
  );
};

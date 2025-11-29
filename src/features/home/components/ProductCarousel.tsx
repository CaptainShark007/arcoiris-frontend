import React, { useState, useCallback, useRef } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Product } from '@shared/types';
import { ProductCard } from './ProductCard'; 

interface ProductCarouselProps {
  products: Product[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const theme = useTheme();

  // --- NUEVO ESTADO: Bloqueo de interacción ---
  // Esto servirá para detener el carrusel si un hijo (modal) está abierto
  const [isLocked, setIsLocked] = useState(false);

  // 1. Configuración Responsive
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));

  let visibleItems = 4;
  if (isXs) visibleItems = 1;      
  else if (isSm) visibleItems = 2; 
  else if (isMd) visibleItems = 3; 

  // 2. Lógica del Carrusel Infinito
  const CLONES_COUNT = 5;
  const originalLength = products.length;
  const shouldClone = originalLength > visibleItems;

  const extendedProducts = shouldClone
    ? Array(CLONES_COUNT).fill(products).flat()
    : products;

  const START_INDEX = shouldClone
    ? Math.floor(extendedProducts.length / 2) - (originalLength % 2 === 0 ? 0 : 1)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isAnimating = useRef(false);

  // --- Estado para Swipe (Táctil) ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // 3. Manejo de Navegación
  const handleNext = useCallback(() => {
    // Agregamos !isLocked a la condición
    if (isAnimating.current || !shouldClone || isLocked) return;
    setIsTransitioning(true);
    isAnimating.current = true;
    setCurrentIndex((prev) => prev + 1);
  }, [shouldClone, isLocked]);

  const handlePrev = useCallback(() => {
    // Agregamos !isLocked a la condición
    if (isAnimating.current || !shouldClone || isLocked) return;
    setIsTransitioning(true);
    isAnimating.current = true;
    setCurrentIndex((prev) => prev - 1);
  }, [shouldClone, isLocked]);

  // 4. Teleportación (Reset silencioso)
  const handleTransitionEnd = () => {
    isAnimating.current = false;
    if (!shouldClone) return;

    const totalLength = extendedProducts.length;
    const singleSetLength = originalLength;

    if (currentIndex >= totalLength - visibleItems - 1) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - singleSetLength);
    } else if (currentIndex <= visibleItems + 1) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + singleSetLength);
    }
  };

  // 5. Manejadores Táctiles
  const onTouchStart = (e: React.TouchEvent) => {
    // Si está bloqueado (modal abierto), no iniciamos el gesto
    if (isLocked) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // Si está bloqueado, ignoramos el movimiento
    if (isLocked) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (isLocked || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    else if (isRightSwipe) handlePrev();
  };

  const itemWidthPercent = 100 / visibleItems;
  const activeDotIndex = currentIndex % originalLength;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      
      {/* Botones de navegación (ahora respetan isLocked) */}
      {shouldClone && (
        <IconButton
          onClick={handlePrev}
          disabled={isLocked} // Deshabilitar visualmente si es necesario
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            left: { md: -20, lg: -8 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s ease',
            opacity: isLocked ? 0 : 1, // Ocultar si hay modal
            pointerEvents: isLocked ? 'none' : 'auto',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: theme.shadows[6],
              transform: 'translateY(-50%) scale(1.1)',
            },
          }}
        >
          <ChevronLeftIcon color="primary" />
        </IconButton>
      )}

      {/* Viewport */}
      <Box
        sx={{ overflow: 'hidden', width: '100%', mx: 'auto', py: 2 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Box
          onTransitionEnd={handleTransitionEnd}
          sx={{
            display: 'flex',
            transform: `translateX(-${currentIndex * itemWidthPercent}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            width: '100%',
          }}
        >
          {extendedProducts.map((product, index) => (
            <Box
              key={`${product.id}-${index}`}
              sx={{
                flex: `0 0 ${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                px: { xs: 1, sm: 1.5 },
                boxSizing: 'border-box',
                userSelect: 'none',
                display: 'flex', 
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', '& img': { pointerEvents: 'none' } }}>
                 {/* Pasamos la función de bloqueo a la tarjeta */}
                 <ProductCard 
                    product={product} 
                    onModalStateChange={setIsLocked} 
                 />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Botón Siguiente */}
      {shouldClone && (
        <IconButton
          onClick={handleNext}
          disabled={isLocked}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            right: { md: -20, lg: -8 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s ease',
            opacity: isLocked ? 0 : 1,
            pointerEvents: isLocked ? 'none' : 'auto',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: theme.shadows[6],
              transform: 'translateY(-50%) scale(1.1)',
            },
          }}
        >
          <ChevronRightIcon color="primary" />
        </IconButton>
      )}

      {/* Indicadores */}
      {shouldClone && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
            gap: 1,
            opacity: isLocked ? 0.3 : 1, // Feedback visual
            transition: 'opacity 0.3s'
          }}
        >
          {products.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === activeDotIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: index === activeDotIndex ? theme.palette.primary.main : theme.palette.action.disabled,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
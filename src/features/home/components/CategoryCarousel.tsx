import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Category } from "@shared/types";
import { CategoryCard } from "./CategoryCard";

interface CategoryCarouselProps {
  categories: Category[];
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories }) => {
  const theme = useTheme();

  // 1. Configuración Responsive
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));

  let visibleItems = 4;
  if (isXs) visibleItems = 2;
  else if (isSm) visibleItems = 3;

  // 2. Lógica del Carrusel Infinito
  const CLONES_COUNT = 5;
  const originalLength = categories.length;
  const shouldClone = originalLength > visibleItems;

  const extendedCategories = shouldClone
    ? Array(CLONES_COUNT).fill(categories).flat()
    : categories;

  const START_INDEX = shouldClone
    ? Math.floor(extendedCategories.length / 2) - (originalLength % 2 === 0 ? 0 : 1)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isAnimating = useRef(false);

  // Estado para manejo de Swipe (Táctil)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; // Mínima distancia en px para considerar un swipe

  // 3. Manejo de Navegación (Next / Prev)
  const handleNext = useCallback(() => {
    if (isAnimating.current || !shouldClone) return;
    setIsTransitioning(true);
    isAnimating.current = true;
    setCurrentIndex((prev) => prev + 1);
  }, [shouldClone]);

  const handlePrev = useCallback(() => {
    if (isAnimating.current || !shouldClone) return;
    setIsTransitioning(true);
    isAnimating.current = true;
    setCurrentIndex((prev) => prev - 1);
  }, [shouldClone]);

  // 4. Lógica de "Teleportación"
  const handleTransitionEnd = () => {
    isAnimating.current = false;
    if (!shouldClone) return;

    const totalLength = extendedCategories.length;
    const singleSetLength = originalLength;

    if (currentIndex >= totalLength - visibleItems - 1) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - singleSetLength);
    } else if (currentIndex <= visibleItems + 1) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + singleSetLength);
    }
  };

  useEffect(() => {
    if (shouldClone && !isTransitioning) {
      // Lógica opcional de resize
    }
  }, [visibleItems, shouldClone, isTransitioning]);

  // Manejadores de Eventos Táctiles
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const itemWidthPercent = 100 / visibleItems;

  // Cálculo para saber qué punto (dot) está activo.
  // Usamos el modulo (%) para mapear el índice gigante al índice original (0 a N).
  // Nota: currentIndex puede ser un número muy grande debido a la clonación.
  const activeDotIndex = currentIndex % originalLength;

  return (
    <Box sx={{ position: "relative", width: "100%", py: 2 }}>
      
      {/* Botón Anterior - Oculto en XS/SM (Mobile), visible en MD+ */}
      {shouldClone && (
        <IconButton
          onClick={handlePrev}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            left: -8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            boxShadow: theme.shadows[3],
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: theme.shadows[6],
              transform: "translateY(-50%) scale(1.1)",
            },
          }}
        >
          <ChevronLeftIcon color="primary" />
        </IconButton>
      )}

      {/* Contenedor Viewport con eventos táctiles */}
      <Box 
        sx={{ overflow: "hidden", width: "100%", mx: "auto", py: 1 }}
        // Eventos nativos de React para swipe
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Box
          onTransitionEnd={handleTransitionEnd}
          sx={{
            display: "flex",
            transform: `translateX(-${currentIndex * itemWidthPercent}%)`,
            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
            width: "100%",
          }}
        >
          {extendedCategories.map((cat, index) => (
            <Box
              key={`${cat.id}-${index}`}
              sx={{
                flex: `0 0 ${itemWidthPercent}%`,
                maxWidth: `${itemWidthPercent}%`,
                px: { xs: 0.5, sm: 1, md: 1.5 },
                boxSizing: "border-box",
                // Deshabilitar selección de texto al arrastrar en desktop/mobile
                userSelect: "none", 
              }}
            >
              {/* Prevenimos que la imagen sea arrastrable por defecto para no romper el swipe */}
              <Box sx={{ "& img": { pointerEvents: "none" } }}>
                <CategoryCard category={cat} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Botón Siguiente - Oculto en XS/SM, visible en MD+ */}
      {shouldClone && (
        <IconButton
          onClick={handleNext}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            right: -8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            boxShadow: theme.shadows[3],
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: theme.shadows[6],
              transform: "translateY(-50%) scale(1.1)",
            },
          }}
        >
          <ChevronRightIcon color="primary" />
        </IconButton>
      )}

      {/* Indicadores (Dots)*/}
      {shouldClone && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            gap: 1,
          }}
        >
          {categories.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === activeDotIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: index === activeDotIndex ? theme.palette.primary.main : theme.palette.action.disabled,
                transition: "all 0.3s ease",
                // Opcional: Si quisieras que los dots fueran clickeables, habría que implementar
                // una lógica compleja para buscar el clon más cercano. 
                // Por ahora son solo visuales.
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
// hooks/useCarousel.ts
import { useState, useEffect, useRef } from 'react';

interface UseCarouselOptions {
  slidesCount: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  infinite?: boolean;
}

export const useCarousel = ({ 
  slidesCount, 
  autoPlay = false, 
  autoPlayInterval = 5000,
  infinite = false 
}: UseCarouselOptions) => {
  const startIndex = infinite ? 1 : 0;
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSlides = infinite ? slidesCount + 2 : slidesCount;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => infinite ? prev + 1 : (prev + 1) % slidesCount);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => infinite ? prev - 1 : (prev - 1 + slidesCount) % slidesCount);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(infinite ? index + 1 : index);
  };

  // Reset animating + handle infinite loop
  useEffect(() => {
    if (!isAnimating) return;

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);

      if (infinite) {
        if (currentIndex === totalSlides - 1) {
          setCurrentIndex(1);
        }
        if (currentIndex === 0) {
          setCurrentIndex(totalSlides - 2);
        }
      }
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAnimating, currentIndex, infinite, totalSlides]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;

    const autoPlayTimer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(autoPlayTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, isAnimating]);

  return {
    currentIndex,
    isAnimating,
    nextSlide,
    prevSlide,
    goToSlide,
  };
};
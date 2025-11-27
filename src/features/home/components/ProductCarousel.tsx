import React, { useState } from "react";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { ProductCard } from "./ProductCard";
import { Product } from "@shared/types";

interface ProductCarouselProps {
  products: Product[];
  showOriginalPrice?: boolean;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products,
  //showOriginalPrice = false 
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  let itemsPerSlide = 4;
  if (isXs) itemsPerSlide = 1;
  else if (isSm) itemsPerSlide = 2;
  else if (isMd) itemsPerSlide = 3;

  const totalSlides = Math.ceil(products.length / itemsPerSlide);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const createSlides = () => {
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
      slides.push(products.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide));
    }
    return slides;
  };

  const slides = createSlides();

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center", // Siempre centrado
              alignItems: "center",
              flex: "0 0 100%",
              gap: { xs: 2, sm: 2 },
              px: { xs: 2, sm: 1 },
            }}
          >
            {slide.map((product) => (
              <Box 
                key={product.id} 
                sx={{ 
                  flex: isXs ? "0 0 auto" : `0 0 ${100 / itemsPerSlide}%`,
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: 280, sm: 300 },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ProductCard 
                  product={product} 
                  //showOriginalPrice={showOriginalPrice}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: -4, sm: 8 },
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.9)",
          boxShadow: 2,
          "&:hover": { bgcolor: "white" },
          zIndex: 2,
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
        }}
      >
        <ArrowBackIos sx={{ ml: 0.5, fontSize: { xs: 16, sm: 20 } }} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: { xs: -4, sm: 8 },
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.9)",
          boxShadow: 2,
          "&:hover": { bgcolor: "white" },
          zIndex: 2,
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
        }}
      >
        <ArrowForwardIos sx={{ fontSize: { xs: 16, sm: 20 } }} />
      </IconButton>
    </Box>
  );
};
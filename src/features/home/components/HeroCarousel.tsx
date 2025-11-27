import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useCarousel } from "../../../shared/hooks/useCarousel";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { CarouselSlide } from "@shared/types";

interface HeroCarouselProps {
  slides: CarouselSlide[];
  mobileSlides?: CarouselSlide[];
}

export const HeroCarousel = ({ slides, mobileSlides }: HeroCarouselProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { currentIndex, isAnimating, nextSlide, prevSlide, goToSlide } =
    useCarousel({
      slidesCount: slides.length,
      autoPlay: true,
      autoPlayInterval: 10000,
      infinite: true,
    });

  const displaySlides = isMobile && mobileSlides ? mobileSlides : slides;
  const extendedSlides = [
    displaySlides[displaySlides.length - 1],
    ...displaySlides,
    displaySlides[0],
  ];

  const getImageSource = (slide: CarouselSlide) => {
    if (isMobile && slide.mobileImage) {
      return slide.mobileImage;
    }
    return slide.image;
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Slides Container */}
      <Box
        sx={{
          display: "flex",
          transition: isAnimating
            ? "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {extendedSlides.map((slide, index) => (
          <Box
            key={`${slide.id}-${index}`}
            sx={{
              minWidth: "100%",
              position: "relative",
              // Altura basada en el ratio de tus imágenes
              paddingTop: {
                xs: "62.5%", // 400/640 = 0.625 (móvil)
                md: "31.25%", // 600/1920 = 0.3125 (desktop)
              },
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={getImageSource(slide)}
              alt={slide.title}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: isMobile 
                  ? (slide.mobilePosition || "center center")
                  : (slide.desktopPosition || "center center"),
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Botones de navegación */}
      <IconButton
        onClick={prevSlide}
        disabled={isAnimating}
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: 4, md: 16 },
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.9)",
          color: "primary.main",
          zIndex: 2,
          width: { xs: 36, md: 48 },
          height: { xs: 36, md: 48 },
          "&:hover": {
            bgcolor: "white",
            transform: "translateY(-50%) scale(1.1)",
          },
          transition: "all 0.3s ease",
          "&:disabled": {
            bgcolor: "rgba(255,255,255,0.5)",
          },
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        disabled={isAnimating}
        sx={{
          position: "absolute",
          top: "50%",
          right: { xs: 4, md: 16 },
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.9)",
          color: "primary.main",
          zIndex: 2,
          width: { xs: 36, md: 48 },
          height: { xs: 36, md: 48 },
          "&:hover": {
            bgcolor: "white",
            transform: "translateY(-50%) scale(1.1)",
          },
          transition: "all 0.3s ease",
          "&:disabled": {
            bgcolor: "rgba(255,255,255,0.5)",
          },
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
      </IconButton>

      {/* Indicadores */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 16, md: 24 },
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 2,
        }}
      >
        {displaySlides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width:
                currentIndex - 1 === index
                  ? { xs: 24, md: 40 }
                  : { xs: 8, md: 12 },
              height: { xs: 8, md: 12 },
              borderRadius: 6,
              bgcolor:
                currentIndex - 1 === index ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.4s ease",
              "&:hover": {
                bgcolor: "white",
                transform: "scale(1.1)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
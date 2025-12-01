// /src/features/product/components/GridImages.tsx
import { useState } from "react";
import { Box, IconButton, CardMedia } from "@mui/material";

interface Props {
  images: string[];
  onImageError: () => void;
}

export const GridImages = ({ images, onImageError }: Props) => {
  const defaultImage = "https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png";
  
  // Rastrear errores por índice de imagen
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  
  // Estado inicial: primera imagen o por defecto
  const [activeImage, setActiveImage] = useState(images[0] || defaultImage);

  // Obtiene la imagen correcta considerando si hubo error
  const getImage = (imageUrl: string, index: number) => {
    if (imageErrors[index] || !imageUrl) {
      return defaultImage;
    }
    return imageUrl;
  };

  // Maneja error de una imagen específica
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    // Si la imagen activa falla, cambiar a la por defecto
    if (activeImage === images[index]) {
      setActiveImage(defaultImage);
    }
    onImageError(); // Llamar al callback del padre
  };

  const handleImageClick = (image: string, index: number) => {
    const validImage = getImage(image, index);
    setActiveImage(validImage);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      {/* Miniaturas a la izquierda */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxWidth: 80,
        }}
      >
        {images.map((image, index) => {
          const displayImage = getImage(image, index);
          
          return (
            <IconButton
              key={index}
              onClick={() => handleImageClick(image, index)}
              sx={{
                border:
                  activeImage === displayImage
                    ? "2px solid #000"
                    : "2px solid transparent",
                borderRadius: 1,
                p: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#666",
                },
              }}
            >
              <CardMedia
                component="img"
                src={displayImage}
                alt={`Miniatura ${index + 1}`}
                onError={() => handleImageError(index)}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
            </IconButton>
          );
        })}
      </Box>

      {/* Imagen principal */}
      <Box sx={{ flex: 1 }}>
        <CardMedia
          component="img"
          src={activeImage}
          alt="Imagen del producto"
          onError={() => {
            setActiveImage(defaultImage);
            onImageError(); // Llama al callback del padre
          }}
          sx={{
            width: "100%",
            borderRadius: 1,
            boxShadow: 3,
            maxHeight: 500,
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
};
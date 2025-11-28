// /src/features/product/components/GridImages.tsx
import { useState } from "react";
import { Box, IconButton, CardMedia } from "@mui/material";

interface Props {
  images: string[];
}

export const GridImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  const handleImageClick = (image: string) => setActiveImage(image);

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
        {images.map((image, index) => (
          <IconButton
            key={index}
            onClick={() => handleImageClick(image)}
            sx={{
              border:
                activeImage === image
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
              src={image}
              alt={`Miniatura ${index + 1}`}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                objectFit: "cover",
              }}
            />
          </IconButton>
        ))}
      </Box>

      {/* Imagen principal */}
      <Box sx={{ flex: 1 }}>
        <CardMedia
          component="img"
          src={activeImage}
          alt="Imagen del producto"
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
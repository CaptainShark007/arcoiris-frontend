import { Box, Typography } from "@mui/material";
import type { ReactNode, ElementType } from "react";

interface InfoItemProps {
  icon: ElementType;
  title: string;
  description: ReactNode;
}

export const InfoItem = ({ 
  icon: IconComponent, 
  title, 
  description 
}: InfoItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        px: { xs: 2, sm: 3 },
        maxWidth: { xs: "100%", sm: "350px" },
        width: "100%",
      }}
    >
      {/* Contenedor del ícono */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          width: { xs: 70, sm: 80, md: 90 },
          height: { xs: 70, sm: 80, md: 90 },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: { xs: 2, sm: 2.5 },
          boxShadow: 2,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <IconComponent 
          sx={{ 
            fontSize: { xs: 35, sm: 40, md: 45 }, 
            color: "#fff" 
          }} 
        />
      </Box>

      {/* Título */}
      <Typography 
        variant="h6" 
        component="h3"
        sx={{
          fontWeight: 700,
          mb: { xs: 1, sm: 1.5 },
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          color: "text.primary",
        }}
      >
        {title}
      </Typography>

      {/* Descripción */}
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          fontSize: { xs: "0.9rem", sm: "0.95rem" },
          lineHeight: 1.7,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
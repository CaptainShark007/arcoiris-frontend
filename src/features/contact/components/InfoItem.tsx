import { Box, Typography, alpha, useTheme } from "@mui/material";
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
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          transform: "translateX(5px)"
        }
      }}
    >
      {/* Icono Minimalista */}
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
          mt: 0.5 // Alineación óptica con el título
        }}
      >
        <IconComponent sx={{ fontSize: 28 }} />
      </Box>

      <Box>
        {/* Título */}
        <Typography 
          variant="subtitle1" 
          fontWeight="700"
          color="text.primary"
          sx={{ lineHeight: 1.2, mb: 0.5 }}
        >
          {title}
        </Typography>

        {/* Descripción */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};
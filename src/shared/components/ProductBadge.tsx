import React from "react";
import { Box } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface ProductBadgeProps {
  type: "nuevo" | "agotado" | "oferta" | "destacado" | "custom";
  label?: string;
  children?: React.ReactNode;
}

const badgeConfig: Record<string, string> = {
  nuevo: "#2196F3",
  agotado: "#9e9e9e", 
  oferta: "#ff0000f6",
  destacado: "#00bcd4",
  custom: "#333",
};

export const ProductBadge = ({ type, label, children }: ProductBadgeProps) => {
  const bg = badgeConfig[type];
  const text = label || children || type.toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",           
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        position: "absolute",
        top: 15,
        left: 0,
        zIndex: 10,
        backgroundColor: bg,
        color: "white",
        pl: 1.5,
        pr: 2,
        py: 0.5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        boxShadow: 2,
        fontSize: "0.75rem",
        fontWeight: "bold",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        lineHeight: 1, 
      }}
    >
      {type === "oferta" && <LocalOfferIcon sx={{ fontSize: "1rem" }} />}
      <span>{text}</span>
    </Box>
  );
};
/* import { Box } from "@mui/material";

interface ProductBadgeProps {
  type: "nuevo" | "agotado" | "oferta" | "destacado" | "custom";
  label?: string; 
}

const badgeStyles: Record<string, any> = {
  nuevo: {
    bg: "primary.main",
    text: "white",
    defaultLabel: "NUEVO",
  },
  agotado: {
    bg: "error.main",
    text: "white",
    defaultLabel: "AGOTADO",
  },
  oferta: {
    bg: "warning.main",
    text: "black",
    defaultLabel: "OFERTA",
  },
  destacado: {
    bg: "success.main",
    text: "white",
    defaultLabel: "DESTACADO",
  },
  custom: {
    bg: "grey.800",
    text: "white",
    defaultLabel: "",
  },
};

export const ProductBadge = ({ type, label }: ProductBadgeProps) => {
  const style = badgeStyles[type];
  const text = label || style.defaultLabel;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: style.bg,
        color: style.text,
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: 12,
        fontWeight: 600,
        zIndex: 10,
      }}
    >
      {text}
    </Box>
  );
};
 */

import React from "react";
import { Box } from "@mui/material";

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
        position: "absolute",
        top: 15,
        left: 0,
        backgroundColor: bg,
        color: "white",
        pl: 1.5,
        pr: 2,
        py: 0.5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 10,
        boxShadow: 2,
        fontSize: "0.75rem",
        fontWeight: "bold",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
      }}
    >
      {text}
    </Box>
  );
};
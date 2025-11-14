import { Box } from "@mui/material";

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

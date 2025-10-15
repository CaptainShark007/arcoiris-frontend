import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import type { Product } from "../types/product.type";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card
      sx={{
        textAlign: "center",
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
        transition: "0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={product.image}
        alt={product.name}
        sx={{
          objectFit: "contain",
          borderRadius: 1,
          mb: 1,
          /* backgroundColor: "#f3f4f6", */
        }}
      />

      <CardContent
        sx={{
          p: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Nombre del producto */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            minHeight: 38,
            overflow: "hidden",
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
          }}
        >
          {product.name}
        </Typography>

        {/* Precio + Acciones */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary.main"
          >
            ${product.price.toFixed(2)}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              sx={{
                "&:hover": { backgroundColor: "primary.main", color: "#fff" },
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              sx={{
                "&:hover": { backgroundColor: "error.main", color: "#fff" },
              }}
            >
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


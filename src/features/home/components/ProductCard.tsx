import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import type { Product } from "../types/home.types";

interface ProductCardProps {
  product: Product;
  showOriginalPrice?: boolean;
}

export const ProductCard = ({
  product,
  showOriginalPrice = false,
}: ProductCardProps) => {
  const discountedPrice =
    product.discount > 0
      ? (product.price * (1 - product.discount / 100)).toFixed(2)
      : product.price.toFixed(2);

  return (
    <Card
      sx={{ 
        width: '100%',
        maxWidth: 280,
        textAlign: "center", 
        position: "relative",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        mx: 'auto', // Centrar la card
      }}
    >
      {/* Imagen */}
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ height: 200, objectFit: "contain" }}
      />

      {/* Badges */}
      <Box
        sx={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 1 }}
      >
        {product.isNew && (
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 1,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            Nuevo
          </Box>
        )}
        {product.discount > 0 && (
          <Box
            sx={{
              bgcolor: "error.main",
              color: "white",
              px: 1,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            -{product.discount}%
          </Box>
        )}
      </Box>

      {/* Información */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {product.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 2,
            alignItems: "baseline",
          }}
        >
          <Typography variant="h6" color="primary">
            ${discountedPrice}
          </Typography>
          {showOriginalPrice && product.originalPrice && (
            <Typography
              variant="body2"
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              ${product.originalPrice}
            </Typography>
          )}
          {!showOriginalPrice && product.discount > 0 && (
            <Typography
              variant="body2"
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              ${product.price}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 'auto' }}
          onClick={() => console.log(`Agregar ${product.name} al carrito`)}
        >
          Agregar al Carrito
        </Button>
      </CardContent>
    </Card>
  );
};
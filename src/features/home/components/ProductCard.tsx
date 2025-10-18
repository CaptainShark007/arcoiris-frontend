import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { formatPrice } from "@/helpers";
import type { Product } from "../types/home.types";

interface ProductCardProps {
  product: Product;
  showOriginalPrice?: boolean;
}

export const ProductCard = ({
  product,
  //showOriginalPrice = false,
}: ProductCardProps) => {
  // Calcular si es nuevo (productos de menos de 30 días)
  const isNew = () => {
    const productDate = new Date(product.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate > thirtyDaysAgo;
  };

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
        mx: 'auto',
      }}
    >
      {/* Imagen */}
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ height: 200, objectFit: "contain", p: 1 }}
      />

      {/* Badge de Nuevo */}
      {isNew() && (
        <Box
          sx={{ 
            position: "absolute", 
            top: 8, 
            left: 8, 
            bgcolor: "primary.main",
            color: "white",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Nuevo
        </Box>
      )}

      {/* Información */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: 48,
            fontWeight: 500,
          }}
        >
          {product.name}
        </Typography>

        {/* <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {product.brand}
        </Typography> */}

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            {formatPrice(product.price)}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => console.log(`Agregar ${product.name} al carrito`)}
          >
            Agregar al Carrito
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
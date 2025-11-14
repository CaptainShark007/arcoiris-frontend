import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";
import toast from "react-hot-toast";
import { formatPrice } from "@/helpers";
import { useCartStore } from "@/storage/useCartStore";
import { useProductVariants } from "../hooks";
import { useState } from "react";
import { Product } from "@shared/types";
import { VariantSelectModal } from "@shared/components";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { variants, loading } = useProductVariants(product.id); // variants ahora es VariantProduct[]

  const [openModal, setOpenModal] = useState(false);

  const handleAddToCart = () => {
    if (loading) return;

    // Si NO hay variantes → error lógico
    if (variants.length === 0) {
      toast.error("Sin stock disponible", { position: "bottom-right" });
      return;
    }

    // Si solo tiene UNA variante → agregar directo
    if (variants.length === 1) {
      const variant = variants[0];

      addItem({
        id: variant.id,
        name: product.name,
        price: variant.price,
        image: product.images[0],
      });

      toast.success("Producto agregado al carrito", { position: "bottom-right" });
      return;
    }

    // Si tiene más variantes → abrir modal
    setOpenModal(true);
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: 280,
          textAlign: "center",
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          mx: "auto",
        }}
      >
        <CardMedia
          component="img"
          image={product.images[0]}
          alt={product.name}
          sx={{ height: 200, objectFit: "contain", p: 1 }}
        />

        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 48,
              fontWeight: 500,
            }}
          >
            {product.name}
          </Typography>

          <Box sx={{ mt: "auto" }}>
            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
              {formatPrice(product.variants[0]?.price)}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Agregar al Carrito"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* MODAL - Ahora variants es compatible directamente */}
      {variants.length > 1 && (
        <VariantSelectModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          variants={variants} // Ya es VariantProduct[]
          product={product}
        />
      )}
    </>
  );
};
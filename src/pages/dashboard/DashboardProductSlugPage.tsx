import { FormProduct } from "@/components/dashboard";
import { useProduct } from "@/hooks/products/useProduct";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import { Loader } from "@shared/components";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { ProductFormData } from "@/lib/validators";

export const DashboardProductSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug!);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  if (isLoading) return <Loader />;
  if (!product) return <Typography>Producto no encontrado</Typography>;

  const handleSubmit = (data: ProductFormData) => {
    updateProduct(
      { productId: product.id, productInput: data },
      {
        onSuccess: () => {
          navigate("/dashboard/productos");
        },
      }
    );
  };

  // Transformar los datos del producto al formato del formulario
  const initialData: Partial<ProductFormData> = {
    name: product.name,
    brand: product.brand,
    slug: product.slug,
    description: typeof product.description === "string" ? product.description : "",
    features: product.features || [],
    images: product.images || [],
    variants: product.variants.map((v: any) => ({
      id: v.id,
      color: v.color,
      colorName: v.color_name,
      storage: v.storage,
      price: v.price,
      stock: v.stock,
    })),
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Editar Producto
      </Typography>
      <FormProduct initialData={initialData} onSubmit={handleSubmit} isLoading={isPending} />
    </Box>
  );
};

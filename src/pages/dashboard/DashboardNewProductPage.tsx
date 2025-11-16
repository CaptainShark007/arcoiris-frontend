import { FormProduct } from "@/components/dashboard";
import { useCreateProduct } from "@/hooks/products/useCreateProduct";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { ProductFormData } from "@/lib/validators";

export const DashboardNewProductPage = () => {
  const navigate = useNavigate();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (data: ProductFormData) => {
    createProduct(data, {
      onSuccess: () => {
        navigate("/dashboard/productos");
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Nuevo Producto
      </Typography>
      <FormProduct onSubmit={handleSubmit} isLoading={isPending} />
    </Box>
  );
};

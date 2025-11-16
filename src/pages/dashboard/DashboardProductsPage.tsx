import { useProducts } from "@/hooks/products/useProducts";
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";
import { TableProduct } from "@/components/dashboard";
import { Loader } from "@shared/components";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Pagination } from "@shared/components";

export const DashboardProductsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading } = useProducts({ page });
  const { mutate: deleteProduct } = useDeleteProduct();

  if (isLoading) return <Loader />;

  const products = (data?.data || []).map((p: any) => ({
    ...p,
    createdAt: p.created_at,
    variants: p.variants.map((v: any) => ({
      ...v,
      colorName: v.color_name,
    })),
  }));
  const totalItems = data?.count || 0;

  const handleDelete = (productId: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      deleteProduct(productId);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Productos</Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard/productos/new")}>
          Nuevo producto
        </Button>
      </Box>
      <TableProduct products={products} onDelete={handleDelete} />
      <Pagination
        page={page}
        setPage={setPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={() => {}}
        itemsPerPageOptions={[10]}
      />
    </Box>
  );
};

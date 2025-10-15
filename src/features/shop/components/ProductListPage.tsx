import { useState, useMemo } from "react";
import { Box, TextField, Select, MenuItem } from "@mui/material";
import { ProductFilters, ProductGrid } from "../components";
import { mockProducts } from "../data/mock.products";
import CustomPagination from "../../../shared/components/CustomPagination";

export const ProductListPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Filtrar los productos visibles según la página
  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return mockProducts.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage]);

  const totalPages = Math.ceil(mockProducts.length / rowsPerPage);

  return (
    <Box 
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={2}
      p={2}
    >
      {/* Panel lateral */}
      <Box
        width={{ xs: "100%", sm: 250 }}
        sx={{ mt: { xs: 0, sm: 1.4 } }}
      >
        <ProductFilters />
      </Box>

      {/* Contenido principal */}
      <Box flex={1}>
        {/* Filtros / Orden */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          p={1.5}
          sx={{ borderRadius: 1 }}
        >
          <TextField
            size="small"
            placeholder="Buscar producto..."
            sx={{ width: "80%" }}
          />
          <Select size="small" defaultValue="precioAsc">
            <MenuItem value="precioAsc">Precio - Bajo a alto</MenuItem>
            <MenuItem value="precioDesc">Precio - Alto a bajo</MenuItem>
          </Select>
        </Box>

        {/* Grid de productos */}
        <ProductGrid products={paginatedProducts} />

        {/* Paginación */}
        <CustomPagination
          page={page}
          totalPages={totalPages}
          totalItems={mockProducts.length}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0); // resetear página al cambiar cantidad de filas
          }}
          rowsPerPageOptions={[4, 8, 12, 16, 20]}
        />
      </Box>
    </Box>
  );
};

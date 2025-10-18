//import React, { useState, useMemo } from 'react';
import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { ProductFilters, ProductGrid } from '../components';
//import { mockProducts } from "../data/mock.products";
//import CustomPagination from '../../../shared/components/CustomPagination';
import { Product } from '../types/product.type';
import { Pagination } from '@shared/components/Pagination';

/* interface ProductListPageProps {
  products: Product[];
  isLoading?: boolean;
} */

interface ProductListPageProps {
  products: Product[];
  isLoading: boolean;
  totalProducts: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number; // nuevo
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>; // nuevo
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductListPage = ({
  products,
  isLoading,
  totalProducts,
  page,
  setPage,
  itemsPerPage, // nuevo
  setItemsPerPage, // nuevo
  selectedBrands,
  setSelectedBrands,
}: ProductListPageProps) => {

  /* const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8); */

  // Filtrar los productos visibles según la página
  /* const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return products.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, products]);

  const totalPages = Math.ceil(products.length / rowsPerPage); */

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={2}
      p={2}
    >
      {/* Panel lateral */}
      <Box width={{ xs: "100%", sm: 250 }} sx={{ mt: { xs: 0, sm: 1.4 } }}>
        <ProductFilters
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
        />
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
          <TextField size="small" placeholder="Buscar producto..." sx={{ width: "80%" }} />
          <Select size="small" defaultValue="precioAsc">
            <MenuItem value="precioAsc">Precio - Bajo a alto</MenuItem>
            <MenuItem value="precioDesc">Precio - Alto a bajo</MenuItem>
          </Select>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <ProductGrid products={products} />

            <Box mt={2}>
              {/* <Pagination totalItems={totalProducts} page={page} setPage={setPage} /> */}
              <Pagination 
                totalItems={totalProducts} 
                page={page} 
                setPage={setPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

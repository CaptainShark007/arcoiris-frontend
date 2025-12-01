import React, { useState, useMemo } from 'react';
import {
  Box,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { ProductFilters, ProductGrid } from '../components';
import { Product } from '@shared/types';
import CustomPagination from '@shared/components/CustomPagination';

interface ProductListPageProps {
  products: (Product & { price?: number; maxPrice?: number })[];
  isLoading: boolean;
  totalProducts: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductListPage = ({
  products,
  isLoading,
  totalProducts,
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
}: ProductListPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('precioAsc');

  // Filtrar productos por búsqueda
  const filteredBySearch = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Ordenar productos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredBySearch];
    if (sortOrder === 'precioAsc') {
      sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortOrder === 'precioDesc') {
      sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return sorted;
  }, [filteredBySearch, sortOrder]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll al inicio de la página al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (newRows: number) => {
    setItemsPerPage(newRows);
    setPage(0);
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      gap={2}
      p={2}
    >
      {/* Panel lateral */}
      <Box width={{ xs: '100%', sm: 250 }} sx={{ mt: { xs: 0, sm: 1.4 } }}>
        <ProductFilters
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </Box>

      {/* Contenido principal */}
      <Box flex={1}>
        {/* Búsqueda y Ordenamiento */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          p={1.5}
          sx={{ borderRadius: 1, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}
        >
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            variant="outlined"
            size="small"
            sx={{ width: { xs: '100%', sm: '80%' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
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
            <ProductGrid products={sortedProducts} />

            <Box mt={2}>
              {/* <Pagination
                totalItems={totalProducts}
                page={page}
                setPage={setPage}
              /> */}
              <CustomPagination 
                page={page}
                totalPages={totalPages}
                totalItems={totalProducts}
                rowsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[4, 8, 12, 24]}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
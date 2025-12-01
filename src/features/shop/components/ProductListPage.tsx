import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
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
  // paginacion
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  // filtros
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  // busqueda y orden
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
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
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
}: ProductListPageProps) => {
  

  const handleClearSearch = () => {
    setSearchTerm('');
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              endAdornment: searchTerm && (
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
          <FormControl size="small" sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 200 }}>
            <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                displayEmpty
            >
                <MenuItem value="created_at-desc">Más nuevos</MenuItem>
                <MenuItem value="created_at-asc">Más antiguos</MenuItem>
                <MenuItem value="name-asc">Nombre (A-Z)</MenuItem>
                <MenuItem value="name-desc">Nombre (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <ProductGrid products={products} />

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
import { getFilteredProducts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

// custom hook para obtener productos filtrados y paginados
export const useFilteredProducts = ({
  page,
  brands,
  categoriesIds,
  itemsPerPage = 8,
  searchTerm,
  sortOrder,
}: {
  page: number;
  brands?: string[];
  categoriesIds?: string[];
  itemsPerPage?: number;
  searchTerm?: string;
  sortOrder?: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      'filteredProducts',
      page,
      brands,
      categoriesIds,
      itemsPerPage,
      searchTerm,
      sortOrder,
    ], // itemsPerPage nuevo
    queryFn: () =>
      getFilteredProducts({
        page,
        brands,
        categoriesIds,
        itemsPerPage,
        searchTerm,
        sortOrder,
      }), // itemsPerPage nuevo
    retry: false, // no reintentar en caso de error
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    data: data?.data,
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};

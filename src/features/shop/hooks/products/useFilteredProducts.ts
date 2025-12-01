import { getFilteredProducts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

// custom hook para obtener productos filtrados y paginados
export const useFilteredProducts = ({
  page,
  brands,
  categoriesIds,
  itemsPerPage = 8, // nuevo
}: {
  page: number;
  brands?: string[];
  categoriesIds?: string[]; // nuevo
  itemsPerPage?: number; // nuevo
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['filteredProducts', page, brands, categoriesIds, itemsPerPage], // itemsPerPage nuevo
    queryFn: () => getFilteredProducts({ page, brands, categoriesIds, itemsPerPage }), // itemsPerPage nuevo
    retry: false, // no reintentar en caso de error
  });

  return {
    data: data?.data,
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};

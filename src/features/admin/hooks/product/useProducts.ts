import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts, type ProductFilters } from '@/actions';

interface Props {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductFilters['status'];
  categoryId?: string | null;
  sortBy?: ProductFilters['sortBy'];
}

export const useProducts = ({
  page = 1,
  limit = 10,
  search = '',
  status = 'all',
  categoryId = null,
  sortBy = 'newest',
}: Props) => {
  
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['products', page, limit, search, status, categoryId, sortBy],
    queryFn: () =>
      getProducts({
        page,
        limit,
        search,
        status,
        categoryId,
        sortBy,
      }),
    placeholderData: keepPreviousData, 
  });

  return {
    products: data?.products ?? [],
    totalProducts: data?.count ?? 0,
    isLoading,
    isFetching,
    isError,
    error,
  };
};
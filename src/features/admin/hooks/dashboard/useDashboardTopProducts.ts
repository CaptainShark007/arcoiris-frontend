import { getDashboardTopProducts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardTopProducts = (days: number, limitCount: number = 5) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'top-products', days, limitCount],
    queryFn: () => getDashboardTopProducts(days, limitCount),
  });

  return {
    products: data || [],
    isLoading,
    isError,
  };
};

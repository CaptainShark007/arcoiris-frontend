import { getDashboardSalesSeries } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardSalesSeries = (days: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'sales-series', days],
    queryFn: () => getDashboardSalesSeries(days),
  });

  return {
    series: data || [],
    isLoading,
    isError,
  };
};

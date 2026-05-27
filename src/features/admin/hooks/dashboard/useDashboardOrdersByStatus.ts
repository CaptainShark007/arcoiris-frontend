import { getDashboardOrdersByStatus } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardOrdersByStatus = (days: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'orders-status', days],
    queryFn: () => getDashboardOrdersByStatus(days),
  });

  return {
    statuses: data || [],
    isLoading,
    isError,
  };
};

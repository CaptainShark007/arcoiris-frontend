import { getDashboardOrdersByStatus } from '@/actions';
import type { DashboardOrderStatus } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardOrdersByStatus = (days: number) => {
  const { data, isLoading, isError } = useQuery<DashboardOrderStatus[]>({
    queryKey: ['dashboard', 'orders-status', days],
    queryFn: () => getDashboardOrdersByStatus(days),
  });

  return {
    statuses: data || [],
    isLoading,
    isError,
  };
};

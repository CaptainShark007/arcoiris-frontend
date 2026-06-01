import { getDashboardRecentOrders } from '@/actions';
import type { DashboardRecentOrder } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardRecentOrders = (days: number, limitCount: number = 8) => {
  const { data, isLoading, isError } = useQuery<DashboardRecentOrder[]>({
    queryKey: ['dashboard', 'recent-orders', days, limitCount],
    queryFn: () => getDashboardRecentOrders(days, limitCount),
  });

  return {
    orders: data || [],
    isLoading,
    isError,
  };
};

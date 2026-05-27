import { getDashboardStats } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardStats = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });

  return {
    stats: data,
    isLoading,
    isError,
  };
};

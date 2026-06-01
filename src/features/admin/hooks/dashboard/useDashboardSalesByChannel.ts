import { getDashboardSalesByChannel } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useDashboardSalesByChannel = (days: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'sales-channel', days],
    queryFn: () => getDashboardSalesByChannel(days),
  });

  return {
    channels: data || [],
    isLoading,
    isError,
  };
};

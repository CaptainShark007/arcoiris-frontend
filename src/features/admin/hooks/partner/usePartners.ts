import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPartners } from '@/actions/partners';
import { PartnerSearchFilters } from '@shared/types';

export const usePartners = (filters: PartnerSearchFilters) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['partners', filters],
    queryFn: () => getPartners(filters),
    placeholderData: keepPreviousData, // <--- CAMBIO v5
  });

  return {
    partners: data?.partners || [],
    count: data?.count || 0,
    isLoading,
    isError,
    error,
    refetch,
  };
};
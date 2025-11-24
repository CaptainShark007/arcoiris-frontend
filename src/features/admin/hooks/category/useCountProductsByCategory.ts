
import { countProductsByCategory } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useCountProductsByCategory = (categoryId: string) => {
  const { data: count, isLoading, isError } = useQuery({
    queryKey: ['products-count', categoryId],
    queryFn: () => countProductsByCategory(categoryId),
    enabled: !!categoryId,
  });

  return {
    count: count || 0,
    isLoading,
    isError,
  };
};
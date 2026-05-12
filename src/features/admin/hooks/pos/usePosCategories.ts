// src/features/pos/hooks/usePosCategories.ts
import { useQuery } from '@tanstack/react-query';
import { getCategoriesLookup } from '@/actions/categories';

export const usePosCategories = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories-lookup'],
    queryFn: getCategoriesLookup,
    staleTime: 1000 * 60 * 10,
  });

  return { categories, isLoading };
};
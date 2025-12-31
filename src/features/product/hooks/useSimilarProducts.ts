import { getSimilarProducts } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useSimilarProducts = (categoryId: string, excludeProductId: string) => {
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['similarProducts', categoryId, excludeProductId], 
    queryFn: () => getSimilarProducts(categoryId, excludeProductId),
    staleTime: 1000 * 60 * 5,
    enabled: !!categoryId, 
  });

  return {
    similarProducts: data || [],
    isLoading,
    isError,
  };
};
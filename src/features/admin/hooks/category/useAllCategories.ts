import { getAllCategories } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useAllCategories = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['all-categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    categories: data || [],
    isLoading,
    isError,
    refetch,
  };
};
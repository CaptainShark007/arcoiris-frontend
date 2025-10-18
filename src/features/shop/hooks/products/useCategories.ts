import { getCategories } from "@/actions"
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutos - las categorias no cambian tan seguido
  });

  return {
    categories: data || [],
    isLoading,
    isError,
  };

};
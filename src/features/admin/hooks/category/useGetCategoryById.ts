import { getCategoryById } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryById = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

  return {
    category: data,
    isLoading,
    isError,
  };
};
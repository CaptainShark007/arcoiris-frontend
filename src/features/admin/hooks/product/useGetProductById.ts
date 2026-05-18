import { getProductById } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetProductById = (productId?: string) => {
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', 'id', productId],
    queryFn: () => getProductById(productId!),
    retry: false,
    enabled: !!productId,
  });

  return { product, isLoading, isError };
};
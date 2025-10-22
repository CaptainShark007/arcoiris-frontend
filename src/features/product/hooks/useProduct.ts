import { getProductBySlug } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (slug: string) => {

  const { 
    data: product,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    retry: false,
  });

  return {
    product,
    isLoading,
    isError
  };

};
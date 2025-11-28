import { getProductBySlug } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (slug?: string) => {

  const { 
    data: product,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug!),
    retry: false,
    enabled: !!slug, // Solo ejecutar la consulta si slug está definido
  });

  return {
    product,
    isLoading,
    isError
  };

};
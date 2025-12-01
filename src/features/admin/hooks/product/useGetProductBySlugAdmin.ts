import { getProductBySlugAdmin } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetProductBySlugAdmin = (slug?: string) => {

  const { 
    data: product,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlugAdmin(slug!),
    retry: false,
    enabled: !!slug, // Solo ejecutar la consulta si slug está definido
  });

  return {
    product,
    isLoading,
    isError
  };

};
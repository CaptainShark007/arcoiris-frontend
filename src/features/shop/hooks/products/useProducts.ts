import { getProducts } from "@/actions";
import { useQuery } from "@tanstack/react-query";

// custom hook para obtener todos los productos - deprecated
export const useProducts = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { products: data, isLoading };

}
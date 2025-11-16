import { getProducts } from "@/actions/product";
import { useQuery } from "@tanstack/react-query";

export const useProducts = ({ page }: { page: number }) => {
  return useQuery({
    queryKey: ["products-admin", page],
    queryFn: () => getProducts(page),
  });
};

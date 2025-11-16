import { getProductBySlug } from "@/actions/product";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product-slug", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

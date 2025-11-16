import { getOrderByIdAdmin } from "@/actions/order";
import { useQuery } from "@tanstack/react-query";

export const useOrderAdmin = (id: number) => {
  return useQuery({
    queryKey: ["order-admin", id],
    queryFn: () => getOrderByIdAdmin(id),
    enabled: !!id,
  });
};

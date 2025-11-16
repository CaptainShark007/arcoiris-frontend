import { getAllOrders } from "@/actions/order";
import { useQuery } from "@tanstack/react-query";

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders-admin"],
    queryFn: getAllOrders,
  });
};

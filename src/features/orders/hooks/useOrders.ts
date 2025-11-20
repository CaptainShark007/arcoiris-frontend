import { getOrdersByCustomerId } from "@/actions"
import { useQuery } from "@tanstack/react-query"

export const useOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersByCustomerId,
    retry: false,
  });
  return { data, isLoading };
}
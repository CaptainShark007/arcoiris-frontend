import { getOrderById } from "@/actions";
import { useQuery } from "@tanstack/react-query"

export const useOrder = (orderId: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    retry: false,
  });
  return { data, isLoading, isError };
}
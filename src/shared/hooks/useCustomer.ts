import { getCustomerByUserId } from "@/actions"
import { useQuery } from "@tanstack/react-query"

export const useCustomer = (userId?: string) => {
  return useQuery({
    queryKey: ['customer', userId],
    queryFn: () => getCustomerByUserId(userId!),
    enabled: !!userId, // solo se ejecuta si userId tiene un valor
  });
};
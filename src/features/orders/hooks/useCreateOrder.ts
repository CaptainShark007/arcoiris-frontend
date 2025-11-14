import { createOrder } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useCreateOrder = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending, data } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders']
      });
      // Ya no navegamos aquí - dejamos que el componente decida qué hacer
    },
    onError: error => {
      toast.error(error.message, {
        position: 'bottom-right'
      })
    }
  });

  return { mutate, isPending, data };

}
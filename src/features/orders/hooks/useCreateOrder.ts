import { createOrder } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useCreateOrder = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['orders']
      });
      navigate(`/verificar/${data.id}/gracias`);
    },
    onError: error => {
      toast.error(error.message, {
        position: 'bottom-right'
      })
    }
  });

  return { mutate, isPending };

}
import { updateOrderStatus } from "@/actions/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useChangeStatusOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      toast.success("Estado actualizado correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar el estado");
    },
  });
};

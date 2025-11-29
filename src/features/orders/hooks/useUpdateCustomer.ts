import { updateCustomer } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useUpdateCustomer = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      toast.success('Usuario actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
    onError: (err) => {
      const message = (err as Error).message || 'Error al actualizar el usuario';
      toast.error(message);
    },
  });

  return { mutate, isPending };

}
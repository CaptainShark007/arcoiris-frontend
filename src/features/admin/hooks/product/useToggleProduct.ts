import { toggleProductStatus } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useToggleProduct = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string, isActive: boolean }) =>
      toggleProductStatus(productId, isActive),

    onSuccess: (data, variables) => {
      const status = data.is_active ? 'activado' : 'desactivado';
      toast.success(`Producto ${status} exitosamente`);

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el estado del producto');
    },
  });

  return { mutate, isPending };
};

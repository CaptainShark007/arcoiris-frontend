import { updateProductCategory } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useUpdateProductCategory = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ productId, categoryId }: { productId: string; categoryId: string }) => updateProductCategory(productId, categoryId),
    onSuccess: (_, variables) => {
      toast.success('Categoría del producto actualizada con éxito.');
      // Invalidar queries para refrescar la tabla
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar la categoría del producto.';
      toast.error(message);
      console.error(error);
    }
  })

  return { mutate, isPending };
  
}
import { updateProductCategory } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useUpdateProductCategory = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ productId, categoryId }: { productId: string; categoryId: string }) => updateProductCategory(productId, categoryId),
    onSuccess: async () => {
      toast.success('Categoría del producto actualizada con éxito.');
      await queryClient.invalidateQueries({ 
          queryKey: ['products'],
          refetchType: 'all'
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar la categoría del producto.';
      toast.error(message);
      console.error(error);
    }
  })

  return { mutate, isPending };
  
}
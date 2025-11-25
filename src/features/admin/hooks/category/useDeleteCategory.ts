import { deleteCategory } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl?: string | null }) =>
      deleteCategory(id, imageUrl),
    onSuccess: () => {
      toast.success('Categoría eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al eliminar';
      toast.error(message);
    },
  });

  return { mutate, isPending };
};
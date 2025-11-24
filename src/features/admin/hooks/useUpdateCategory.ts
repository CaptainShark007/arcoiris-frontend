import { updateCategory } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(id, data),
    onSuccess: () => {
      toast.success('Categoría actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['all-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar';
      toast.error(message);
    },
  });

  return { mutate, isPending };
};
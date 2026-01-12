import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePartner } from '@/actions/partners';
import toast from 'react-hot-toast';

export const useDeletePartner = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Socio eliminado');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al eliminar');
    },
  });

  return {
    deletePartner: mutateAsync,
    isDeleting: isPending,
  };
};
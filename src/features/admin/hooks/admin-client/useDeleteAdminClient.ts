import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAdminClient } from '@/actions/admin-clients';
import toast from 'react-hot-toast';

export const useDeleteAdminClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el cliente');
    },
  });
};

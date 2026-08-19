import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminClient } from '@/actions/admin-clients';
import { AdminClientInput } from '@shared/types/admin-client';
import toast from 'react-hot-toast';

export const useUpdateAdminClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AdminClientInput> }) =>
      updateAdminClient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el cliente');
    },
  });
};

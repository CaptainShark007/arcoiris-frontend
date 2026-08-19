import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminClient } from '@/actions/admin-clients';
import { AdminClientInput } from '@shared/types/admin-client';
import toast from 'react-hot-toast';

export const useCreateAdminClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AdminClientInput) => createAdminClient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el cliente');
    },
  });
};

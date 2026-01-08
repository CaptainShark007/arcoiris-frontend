import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePartner } from '@/actions/partners';
import { PartnerInput } from '@shared/types';
import toast from 'react-hot-toast';

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({ // <--- CAMBIO: isPending
    mutationFn: ({ id, data }: { id: string; data: Partial<PartnerInput> }) => 
      updatePartner(id, data),
    onSuccess: () => {
      // <--- CAMBIO v5
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Socio actualizado correctamente');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al actualizar');
    },
  });

  return {
    updatePartner: mutateAsync,
    isUpdating: isPending, // Mapeamos isPending
  };
};
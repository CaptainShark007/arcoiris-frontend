import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPartner } from '@/actions/partners';
import { PartnerInput } from '@shared/types';
import toast from 'react-hot-toast';

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error } = useMutation({ // <--- CAMBIO: isPending
    mutationFn: (newPartner: PartnerInput) => createPartner(newPartner.name, newPartner.code),
    onSuccess: () => {
      // <--- CAMBIO v5: queryKey dentro de objeto
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Socio creado correctamente');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al crear el socio');
    },
  });

  return {
    createPartner: mutateAsync,
    isLoading: isPending, // Mapeamos isPending a isLoading para mantener compatibilidad con tu UI
    isError,
    error,
  };
};
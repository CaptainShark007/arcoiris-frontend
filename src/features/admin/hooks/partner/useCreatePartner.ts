import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPartner } from '@/actions/partners';
import { PartnerInput } from '@shared/types';
import toast from 'react-hot-toast';

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (newPartner: PartnerInput) => createPartner(newPartner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Socio creado correctamente');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al crear el socio');
    },
  });

  return {
    createPartner: mutateAsync,
    isLoading: isPending,
    isError,
    error,
  };
};
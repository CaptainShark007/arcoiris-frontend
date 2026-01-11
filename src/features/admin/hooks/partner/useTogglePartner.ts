import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePartnerStatus } from '@/actions/partners';
import toast from 'react-hot-toast';


export const useTogglePartner = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      togglePartnerStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success(
        `Socio ${variables.isActive ? 'activado' : 'desactivado'} correctamente`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al cambiar estado');
    },
  });

  return {
    togglePartner: mutateAsync,
    isToggling: isPending,
  };
};
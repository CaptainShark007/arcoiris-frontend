import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBudgetStatus } from '@/actions/budgets';
import { BudgetStatus } from '@shared/types';
import toast from 'react-hot-toast';

interface UseUpdateBudgetStatusOptions {
  onSuccess?: () => void | Promise<void>;
}

export const useUpdateBudgetStatus = (
  id: number,
  options?: UseUpdateBudgetStatusOptions
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (status: BudgetStatus) => updateBudgetStatus({ id, status }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['budget', id] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Estado actualizado', { position: 'top-right' });
      if (options?.onSuccess) await options.onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo actualizar el estado', {
        position: 'top-right',
      });
    },
  });

  return { mutate, isPending };
};

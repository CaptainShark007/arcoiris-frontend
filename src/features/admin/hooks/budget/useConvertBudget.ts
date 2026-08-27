import { useMutation, useQueryClient } from '@tanstack/react-query';
import { convertBudgetToOrder } from '@/actions/budgets';
import toast from 'react-hot-toast';

interface UseConvertBudgetOptions {
  onSuccess?: (orderId: number) => void | Promise<void>;
}

export const useConvertBudget = (
  id: number,
  options?: UseConvertBudgetOptions
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => convertBudgetToOrder(id),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ['budget', id] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast.success('Presupuesto convertido a venta', { position: 'top-right' });

      if (options?.onSuccess && response.orderId) {
        await options.onSuccess(response.orderId);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo convertir el presupuesto', {
        position: 'top-right',
      });
    },
  });

  return { mutate, isPending };
};

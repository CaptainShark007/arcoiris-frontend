import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget } from '@/actions/budgets';
import { CreateBudgetInput } from '@shared/types';
import toast from 'react-hot-toast';

interface UseCreateBudgetOptions {
  onSuccess?: (budgetId: number) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

export const useCreateBudget = (options?: UseCreateBudgetOptions) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: (input: CreateBudgetInput) => createBudget(input),
    onSuccess: async (response) => {
      if (!response.success) {
        throw new Error(response.error || response.message || 'Error desconocido');
      }

      queryClient.invalidateQueries({ queryKey: ['budgets'] });

      toast.success('Presupuesto creado correctamente', {
        position: 'top-right',
        duration: 4000,
      });

      if (options?.onSuccess && response.budgetId) {
        await options.onSuccess(response.budgetId);
      }
    },
    onError: async (err: Error) => {
      toast.error(err.message || 'Hubo un error al crear el presupuesto', {
        position: 'top-right',
        duration: 4000,
      });

      if (options?.onError) {
        await options.onError(err);
      }
    },
  });

  return {
    mutate,
    isPending,
    data,
    error,
    isSuccess: data?.success ?? false,
    budgetId: data?.budgetId,
  };
};

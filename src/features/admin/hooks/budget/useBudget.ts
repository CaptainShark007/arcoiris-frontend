import { useQuery } from '@tanstack/react-query';
import { getBudgetById } from '@/actions/budgets';

export const useBudget = (id: number) => {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: () => getBudgetById(id),
    enabled: !!id,
  });
};

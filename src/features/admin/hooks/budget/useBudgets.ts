import { useQuery } from '@tanstack/react-query';
import { getBudgets } from '@/actions/budgets';
import { BudgetStatus } from '@shared/types';

export const useBudgets = (
  page: number = 1,
  limit: number = 10,
  status: BudgetStatus | 'all' = 'all'
) => {
  return useQuery({
    queryKey: ['budgets', page, limit, status],
    queryFn: () => getBudgets(page, limit, status),
    staleTime: 1000 * 60 * 1,
  });
};

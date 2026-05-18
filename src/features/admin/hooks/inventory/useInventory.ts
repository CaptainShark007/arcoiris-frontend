import { useQuery } from '@tanstack/react-query';
import { getInventoryVariants, InventoryFilters } from '../../../../actions/inventory';

export const useInventory = (filters: InventoryFilters) => {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => getInventoryVariants(filters),
    placeholderData: (previousData) => previousData,
  });
};
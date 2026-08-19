import { useQuery } from '@tanstack/react-query';
import { getAdminClients } from '@/actions/admin-clients';

export const useAdminClients = (search: string = '', onlyActive: boolean = false) => {
  return useQuery({
    queryKey: ['admin-clients', search, onlyActive],
    queryFn: () => getAdminClients(search, onlyActive),
    staleTime: 1000 * 60 * 2,
  });
};

import { getOrderByIdAdmin } from '@/actions';
import { useQuery } from '@tanstack/react-query';

export const useOrderAdmin = (id: number) => {
	const { data, isLoading } = useQuery({
		queryKey: ['order', 'admin', id],
		queryFn: () => getOrderByIdAdmin(id),
		enabled: !!id,
		retry: false,
	});

	return {
		data,
		isLoading,
	};
};
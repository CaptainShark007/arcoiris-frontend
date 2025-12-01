import { getAllOrders } from '@/actions';
import { useQuery } from '@tanstack/react-query';

interface Props {
	page?: number;
	limit?: number;
}

export const useAllOrders = ({ page = 1, limit = 10 }: Props) => {

	const { data, isLoading } = useQuery({
		queryKey: ['orders', 'admin', page, limit],
		queryFn: () => getAllOrders(page, limit),
	});

	return {
		orders: data?.data || [],
		totalItems: data?.count || 0,
		isLoading,
	};
	
};
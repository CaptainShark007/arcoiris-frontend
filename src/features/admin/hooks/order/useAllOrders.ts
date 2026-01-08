import { getAllOrders, OrderFilterType } from '@/actions';
import { useQuery } from '@tanstack/react-query';

interface Props {
	page?: number;
	limit?: number;
	filter?: OrderFilterType;
}

export const useAllOrders = ({ page = 1, limit = 10, filter = 'all' }: Props) => {

	const { data, isLoading } = useQuery({
		queryKey: ['orders', 'admin', page, limit, filter],
		queryFn: () => getAllOrders(page, limit, filter),
	});

	return {
		orders: data?.data || [],
		totalItems: data?.count || 0,
		isLoading,
	};
	
};
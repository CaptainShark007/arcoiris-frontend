import { getAllOrders } from '@/actions';
import { useQuery } from '@tanstack/react-query';


export const useAllOrders = () => {
	const { data, isLoading } = useQuery({
		queryKey: ['orders', 'admin'],
		queryFn: getAllOrders,
	});

	return {
		data,
		isLoading,
	};
};
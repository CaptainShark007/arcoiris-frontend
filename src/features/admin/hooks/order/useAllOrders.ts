import { getAllOrders } from '@/actions';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';


export const useAllOrders = () => {

	const [page, setPage] = useState(1);
	const pageSize = 10;

	const { data, isLoading } = useQuery({
		queryKey: ['orders', 'admin', page],
		queryFn: () => getAllOrders(page, pageSize),
	});

	return {
		orders: data?.data || [],
		totalItems: data?.count || 0,
		isLoading,
		page,
		setPage,
		pageSize,
	};
	
};
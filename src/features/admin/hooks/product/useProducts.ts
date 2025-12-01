import { getProducts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

interface Props {
	page?: number;
	limit?: number;
}

export const useProducts = ({ page = 1, limit = 10 }: Props) => {
	const { data, isLoading } = useQuery({
		queryKey: ['products', page, limit],
		queryFn: () => getProducts(page, limit),
		staleTime: 1000 * 60 * 5, // su funcion es que los datos se consideren frescos por 5 minutos
	});

	return {
		products: data?.products,
		isLoading,
		totalProducts: data?.count ?? 0,
	};
};
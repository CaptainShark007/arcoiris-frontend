import { updateOrderStatus } from '@/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useChangeStatusOrder = () => {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: updateOrderStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['orders', 'admin'],
			});
		},
		onError: error => {
			console.log(error);
			toast.error('No se pudo actualizar el estado de la orden', {
				position: 'top-right',
			});
		},
	});

	return {
		mutate,
		isPending,
	};
};
import { createProduct } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useCreateProduct = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/panel/productos');
    },
    onError: (error) => {
      toast.error('Error al crear el producto');
      console.error(error);
    },
  });

  return { mutate, isPending };

}
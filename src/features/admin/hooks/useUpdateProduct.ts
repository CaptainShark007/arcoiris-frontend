import { updateProduct } from "@/actions";
import { ProductInput } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useUpdateProduct = (productId: string) => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductInput) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado con éxito', {
        position: 'top-right',
      });
      navigate('/panel/productos');
    },
    onError: error => {
      console.error(error);
      toast.error('Error al actualizar el producto', {
        position: 'top-right',
      });
    }
  })

  return { mutate, isPending }

}
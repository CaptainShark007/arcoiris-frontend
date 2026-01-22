/* import { deleteProduct } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useDeleteProduct = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado correctamente', {
        position: 'top-right',
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error al eliminar el producto', {
        position: 'top-right',
      });
    }
  });

  return { mutate, isPending };

} */

// soft delete 
import { softDeleteProduct } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (productId: string) => softDeleteProduct(productId),
    
    onSuccess: () => {
      toast.success("Producto eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo eliminar el producto");
    },
  });

  return { mutate, isPending };
};
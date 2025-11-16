import { deleteProduct } from "@/actions/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast.success("Producto eliminado correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar el producto");
    },
  });
};

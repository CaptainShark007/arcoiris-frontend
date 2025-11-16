import { updateProduct } from "@/actions/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productInput }: { productId: string; productInput: any }) =>
      updateProduct(productId, productInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast.success("Producto actualizado correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar el producto");
    },
  });
};

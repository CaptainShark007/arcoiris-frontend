import { createProduct } from "@/actions/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast.success("Producto creado correctamente");
    },
    onError: () => {
      toast.error("Error al crear el producto");
    },
  });
};

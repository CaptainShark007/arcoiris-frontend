/* import { createOrder } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useCreateOrder = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending, data } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders']
      });
      // Ya no navegamos aquí - dejamos que el componente decida qué hacer
    },
    onError: error => {
      toast.error(error.message, {
        position: 'bottom-right'
      })
    }
  });

  return { mutate, isPending, data };

} */

import { createOrder } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

interface UseCreateOrderOptions {
  onSuccess?: (data: any) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

export const useCreateOrder = (options?: UseCreateOrderOptions) => {

  const queryClient = useQueryClient();

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: createOrder,
    onSuccess: async (response) => {
      // Validar que la respuesta sea exitosa
      if (!response.success) {
        throw new Error(response.error || response.message || 'Error desconocido');
      }

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['orders']
      });

      // Toast de éxito
      toast.success(`Orden #${response.orderId} creada exitosamente!`, {
        position: 'bottom-right',
        duration: 4000,
      });

      // Callback personalizado si se proporciona
      if (options?.onSuccess) {
        await options.onSuccess(response);
      }
    },
    onError: async (error: Error) => {
      console.error('Error al crear orden:', error);

      // Toast de error
      toast.error(error.message || 'Hubo un error al crear la orden', {
        position: 'bottom-right',
        duration: 4000,
      });

      // Callback personalizado si se proporciona
      if (options?.onError) {
        await options.onError(error);
      }
    }
  });

  return { 
    mutate, 
    isPending, 
    data, 
    error,
    isSuccess: data?.success ?? false,
    orderId: data?.orderId,
  };
};
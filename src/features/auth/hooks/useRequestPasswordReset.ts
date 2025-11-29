import { requestPasswordReset } from "@/actions"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useRequestPasswordReset = () => {

  const { mutate, isPending } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success("Revisa tu correo para restablecer la contraseña");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Error al solicitar el restablecimiento de contraseña";
      toast.error(message);
    },
  });

  return { mutate, isPending };

}
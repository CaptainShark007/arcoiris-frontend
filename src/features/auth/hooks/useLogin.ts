import { signIn } from "@/actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useNavigate } from "react-router"

export const useLogin = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      toast.success("Sesión iniciada correctamente");
      queryClient.invalidateQueries({ queryKey: ["users"]})
      navigate("/");
    },
    onError: (err) => {
      //console.error("Error en el registro:", err);
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.error(message);
    }
  })

  return {
    mutate,
    isPending
  }

}
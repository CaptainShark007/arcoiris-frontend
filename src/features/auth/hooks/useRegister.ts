import { signUp } from "@/actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useNavigate } from "react-router"

export const useRegister = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Cuenta creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["users"]})
      navigate("/");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Error en el registro";
      toast.error(message);
    }
  })

  return {
    mutate,
    isPending
  }

}
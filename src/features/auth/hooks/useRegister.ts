import { signUp } from "@/actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export const useRegister = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"]})
      navigate("/");
    },
    onError: (err) => {
      console.error("Error en el registro:", err);
    }
  })

  return {
    mutate,
    isPending
  }

}
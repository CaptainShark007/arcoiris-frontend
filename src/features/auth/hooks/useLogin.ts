import { signIn } from "@/actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export const useLogin = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"]})
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
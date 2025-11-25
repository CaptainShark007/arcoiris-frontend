import { signOut } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/");
    },
    onError: (err) => {
      console.error("Error al cerrar sesión:", err);
    },
  });

  return {
    mutate,
    isPending,
  };
};
import { updatePassword } from "@/actions";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router"

export const useUpdatePassword = () => {

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Contraseña restablecida correctamente");
      navigate("/");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Error al restablecer la contraseña";
      toast.error(message);
    },
  });

  return { mutate, isPending };

}
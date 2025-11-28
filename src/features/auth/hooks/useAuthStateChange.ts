import { subscribeToAuthStateChange } from "@/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useAuthStateChange = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribeToAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        navigate("/acceder", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate, queryClient]);
};
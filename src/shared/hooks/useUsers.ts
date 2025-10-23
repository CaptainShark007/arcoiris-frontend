import { getSession } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getSession,
    retry: false,
    refetchOnWindowFocus: true,
  });

  return {
    session: data?.session,
    isLoading
  }

}


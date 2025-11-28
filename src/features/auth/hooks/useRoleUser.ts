import { getUserRole } from "@/actions"
import { useQuery } from "@tanstack/react-query"

export const useRoleUser = (userId: string) => {

  const { data, isLoading } = useQuery({
    queryKey: ['rol-user'],
    queryFn: async () => await getUserRole(userId),
    enabled: !!userId,
  });

  return { data, isLoading };

}
import { useQuery } from '@tanstack/react-query';
import { getPartnerByCode } from '@/actions/partners';
import { useReferral } from '@shared/hooks/useReferral';

export const useCurrentPartner = () => {
  const { referralCode } = useReferral();

  return useQuery({
    queryKey: ['partner', referralCode],
    queryFn: () => {
      if (!referralCode) return null;
      return getPartnerByCode(referralCode);
    },
    enabled: !!referralCode,
    staleTime: 1000 * 60 * 60,
    retry: false
  });
};
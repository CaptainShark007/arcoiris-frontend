import { useEffect, useState } from 'react';

const REFERRAL_KEY = 'arcoiris_partner_code';

export const useReferral = () => {
  // Inicializamos el estado leyendo de localStorage para persistencia inmediata
  const [referralCode, setReferralCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFERRAL_KEY);
    }
    return null;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCodeFromUrl = params.get('ref');

    if (refCodeFromUrl) {
      
      const normalizedCode = refCodeFromUrl.toUpperCase();
      
      localStorage.setItem(REFERRAL_KEY, normalizedCode);
      setReferralCode(normalizedCode);
      
      // Opcional: Limpiar URL
      // const newUrl = window.location.pathname + window.location.hash;
      // window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return { referralCode };
};
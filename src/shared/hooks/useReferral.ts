import { useEffect } from 'react';

const REFERRAL_KEY = 'ecommerce_partner_code';

export const useReferral = () => {
  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');

    if (refCode) {
      console.log('✅ Referido detectado y guardado:', refCode);
      localStorage.setItem(REFERRAL_KEY, refCode);
      
      // Opcional: Si quieres limpiar la URL visualmente sin recargar
      // const newUrl = window.location.pathname + window.location.hash;
      // window.history.replaceState({}, '', newUrl);
    }
  }, []); // Se ejecuta solo una vez al montar el componente que lo llame

  const getReferralCode = (): string | null => {
    return localStorage.getItem(REFERRAL_KEY);
  };

  return { getReferralCode };
};
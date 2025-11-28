import { getBrands } from '@/actions';
import { useEffect, useState } from 'react';

export const useBrands = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return { brands, isLoading };
};

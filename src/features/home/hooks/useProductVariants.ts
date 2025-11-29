import { getProductVariants } from "@/actions";
import { VariantProduct } from "@shared/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useProductVariants = (productId: string) => {
  const [variants, setVariants] = useState<VariantProduct[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductVariants(productId);
        if (mounted) {
          setVariants(data);
          setSelectedVariant(data?.[0]?.id ?? null);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err);
          toast.error(err.message || 'Error cargando variantes', { position: 'bottom-right' });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (productId) load();

    return () => {
      mounted = false;
    };
  }, [productId]);

  return {
    variants,
    selectedVariant,
    setSelectedVariant,
    loading,
    error,
  };
};
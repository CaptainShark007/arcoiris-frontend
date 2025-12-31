import { getRandomProducts, getRecentProducts, getSaleProducts } from "@/actions"
import { useQueries } from "@tanstack/react-query"

export const useHomeProducts = () => {

  const results = useQueries({ 
    queries: [
      {
        queryKey: ['recentProducts'],
        queryFn: getRecentProducts
      },
      {
        queryKey: ['randomProducts'],
        queryFn: getRandomProducts
      },
      {
        queryKey: ['saleProducts'],
        queryFn: getSaleProducts
      },
    ],
  });

  const [ recentProductsResult, randomProductsResult, saleProductsResult ] = results;

  const isLoading = recentProductsResult.isLoading || randomProductsResult.isLoading || saleProductsResult.isLoading;
  const isError = recentProductsResult.isError || randomProductsResult.isError || saleProductsResult.isError;

  return {
    recentProducts: recentProductsResult.data,
    randomProducts: randomProductsResult.data,
    saleProducts: saleProductsResult.data,
    isLoading,
    isError,
  }

};
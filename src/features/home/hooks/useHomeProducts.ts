import { getRandomProducts, getRecentProducts } from "@/actions"
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
    ],
  });

  const [ recentProductsResult, popularProductsResult ] = results; // [resultadoQuery1, resultadoQuery2]

  // combinar los estados de las consultas
  const isLoading = recentProductsResult.isLoading || popularProductsResult.isLoading;
  const isError = recentProductsResult.isError || popularProductsResult.isError;

  return {
    recentProducts: recentProductsResult.data,
    popularProducts: popularProductsResult.data,
    isLoading,
    isError,
  }

};
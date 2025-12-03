/* import { getProducts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

interface Props {
	page?: number;
	limit?: number;
}

export const useProducts = ({ page = 1, limit = 10 }: Props) => {
	const { data, isLoading } = useQuery({
		queryKey: ['products', page, limit],
		queryFn: () => getProducts(page, limit),
		staleTime: 1000 * 60 * 5, // su funcion es que los datos se consideren frescos por 5 minutos
	});

	return {
		products: data?.products,
		isLoading,
		totalProducts: data?.count ?? 0,
	};
}; */
// hooks/useProducts.ts
import { getProducts } from '@/actions';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // Importa keepPreviousData si usas v5, o configura en las opciones

interface Props {
  page?: number;
  limit?: number;
  search?: string; // Nuevo prop opcional
}

export const useProducts = ({ page = 1, limit = 10, search = '' }: Props) => {
  const { data, isLoading, isFetching } = useQuery({
    // CLAVE: Agregamos 'search' al array. 
    // Cuando 'search' cambie, React Query disparará getProducts de nuevo.
    queryKey: ['products', page, limit, search],
    
    queryFn: () => getProducts(page, limit, search),
    
    staleTime: 1000 * 60 * 5, 
    
    // RECOMENDADO: Esto mantiene los datos viejos en pantalla mientras cargan los nuevos
    // Evita el parpadeo de "Loading..." cada vez que escribes una letra o cambias de página
    placeholderData: keepPreviousData, 
  });

  return {
    products: data?.products,
    isLoading,
    isFetching, // Útil si quieres mostrar un spinner pequeño mientras busca sin borrar la tabla
    totalProducts: data?.count ?? 0,
  };
};
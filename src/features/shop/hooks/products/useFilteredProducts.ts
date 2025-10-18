import { getFilteredProducts } from '@/actions';
import { useQuery } from '@tanstack/react-query';

// custom hook para obtener productos filtrados y paginados
export const useFilteredProducts = ({
  page,
  brands,
  itemsPerPage = 8, // nuevo
}: {
  page: number;
  brands?: string[];
  itemsPerPage?: number; // nuevo
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['filteredProducts', page, brands, itemsPerPage], // itemsPerPage nuevo
    queryFn: () => getFilteredProducts({ page, brands, itemsPerPage }), // itemsPerPage nuevo
    retry: false, // no reintentar en caso de error
  });

  return {
    data: data?.data,
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};

/*
ejemplo de uso del nuevo hook

import { useFilteredProducts } from "@/hooks";

const [page, setPage] = useState(1);
const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

const {
  data: products = [],
  isLoading,
  totalProducts
} = useFilteredProducts({
  page,
  brands: selectedBrands
});

// colocar en un lugar adecuado
// mucho mejor si se un componente de loading como el circulo giratorio
if (isLoading || !products) return <div>Loading...</div>;

ejemplo de actualizar el estado de las marcas seleccionadas

interface Props {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

export const ContainerFilter = ({
  selectedBrands,
  setSelectedBrands
}: Props) => {

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  }

  // ...
  
}


*/

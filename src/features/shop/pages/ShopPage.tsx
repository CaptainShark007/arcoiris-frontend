import { useEffect, useState } from 'react';
import { ProductListPage } from '../components';
import { useSearchParams } from 'react-router';
import { useDebounce, useFilteredProducts } from '../hooks';
import useSEO from '@shared/hooks/useSEO';
import { SeoHead } from '@shared/components';

const ShopPage = () => {

  // cambio del titulo al usar el buscador de la tienda
  // ej: const title = gifs ? `${gifs.length} resultados de ${keyword}` : '';
  // ej: useTitle(title);

  useSEO("Tienda", "Explora nuestra tienda - Encuentra los mejores productos en Arcoiris");
  
  const [ searchParams ] = useSearchParams();

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('created_at-desc');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Resetear si cambion los filtros
  useEffect(() => {
    setPage(0);
  }, [selectedBrands, selectedCategories, debouncedSearchTerm, sortOrder]);

  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setSelectedCategories([categoryId]);
      //setPage(0);
    }
  }, [searchParams]);

  const {
    data: products = [],
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page: page + 1,
    brands: selectedBrands,
    categoriesIds: selectedCategories,
    itemsPerPage,
    searchTerm: debouncedSearchTerm, // pasa el valor con retraso
    sortOrder,
  });

  return (
    <>
      <SeoHead 
        title="Tienda" 
        description="Explora nuestra tienda - Encuentra los mejores productos en Arcoiris"
      />
      <ProductListPage
        products={products}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalProducts={totalProducts}
        // props de filtros
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        // props de busqueda y orden
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </>
  );
};

export default ShopPage;

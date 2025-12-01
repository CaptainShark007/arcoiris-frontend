import { useEffect, useState } from 'react';
import { ProductListPage } from '../components';
import { useFilteredProducts } from '../hooks/products/useFilteredProducts';
import { useSearchParams } from 'react-router';

const ShopPage = () => {
  
  const [ searchParams ] = useSearchParams();

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Resetear la página 0 si cambias los filtros de la URL
  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setSelectedCategories([categoryId]);
      setPage(0);
    }
  }, [searchParams]);

  // Resetear la página 0 si cambian los filtros seleccionados
  useEffect(() => {
    setPage(0);
  }, [selectedBrands, selectedCategories]);

  const {
    data: products = [],
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page: page + 1,
    brands: selectedBrands,
    categoriesIds: selectedCategories,
    itemsPerPage 
  });

  return (
    <ProductListPage
      products={products}
      isLoading={isLoading}
      page={page}
      setPage={setPage}
      itemsPerPage={itemsPerPage}
      setItemsPerPage={setItemsPerPage}
      totalProducts={totalProducts}
      selectedBrands={selectedBrands}
      setSelectedBrands={setSelectedBrands}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
    />
  );
};

export default ShopPage;

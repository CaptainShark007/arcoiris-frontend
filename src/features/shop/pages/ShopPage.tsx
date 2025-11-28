import { useEffect, useState } from 'react';
import { ProductListPage } from '../components';
import { useFilteredProducts } from '../hooks/products/useFilteredProducts';
import { useSearchParams } from 'react-router';

const ShopPage = () => {
  
  const [ searchParams ] = useSearchParams();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); 
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setSelectedCategories([categoryId]);
      setPage(1);
    }
  }, [searchParams]);

  const {
    data: products = [],
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page,
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

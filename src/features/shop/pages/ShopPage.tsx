import { useState } from 'react';
import { ProductListPage } from '../components';
//import { useProducts } from '../hooks';
import { useFilteredProducts } from '../hooks/products/useFilteredProducts';

const ShopPage = () => {
  //const { products = [], isLoading } = useProducts();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // nuevo
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: products = [],
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page,
    brands: selectedBrands,
    categoriesIds: selectedCategories, // nuevo
    itemsPerPage // nuevo
  });

  {
    /* <ProductListPage products={products} isLoading={isLoading} /> */
  }
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

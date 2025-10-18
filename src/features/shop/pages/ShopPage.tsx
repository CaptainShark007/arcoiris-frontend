import { ProductListPage } from '../components';
import { useProducts } from '../hooks';

const ShopPage = () => {
  const { products = [], isLoading } = useProducts();

  return (
    <>
      <ProductListPage products={products} isLoading={isLoading} />
    </>
  );
};

export default ShopPage;

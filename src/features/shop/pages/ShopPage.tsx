import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ProductListPage } from '../components';
import { useSearchParams } from 'react-router';
import { useDebounce, useFilteredProducts } from '../hooks';
import { SeoHead } from '@shared/components';

const ShopPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(() => Number(searchParams.get('page')) || 0);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState(() => searchParams.get('sort') || 'created_at-desc');

  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const brands = searchParams.get('brands');
    return brands ? brands.split(',') : [];
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categories = searchParams.get('categories');
    return categories ? categories.split(',') : [];
  });

  const [itemsPerPage, setItemsPerPage] = useState(8);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 1. Sincronizar estado hacia la URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (page > 0) params.set('page', page.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (sortOrder !== 'created_at-desc') params.set('sort', sortOrder);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));

    // replace: true evita llenar el historial del navegador
    setSearchParams(params, { replace: true });
  }, [page, searchTerm, sortOrder, selectedBrands, selectedCategories, setSearchParams]);

  const handleSetSearchTerm = (value: React.SetStateAction<string>) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleSetSortOrder = (value: React.SetStateAction<string>) => {
    setSortOrder(value);
    setPage(0);
  };

  const handleSetSelectedBrands = (value: React.SetStateAction<string[]>) => {
    setSelectedBrands(value);
    setPage(0);
  };

  const handleSetSelectedCategories = (value: React.SetStateAction<string[]>) => {
    setSelectedCategories(value);
    setPage(0);
  };

  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setSelectedCategories([categoryId]);
    }
  }, [searchParams]);

  const pageTitle = useMemo(() => {
    const term = debouncedSearchTerm?.trim();

    if (!term || term.length < 3) {
      if (selectedCategories.length === 1) {
         return "Categoría seleccionada";
      }
      return "Tienda";
    }

    const formattedTerm = term.charAt(0).toUpperCase() + term.slice(1);
    return `Resultados para ${formattedTerm}`;
  }, [debouncedSearchTerm, selectedCategories]);

  const {
    data: products = [],
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page: page + 1,
    brands: selectedBrands,
    categoriesIds: selectedCategories,
    itemsPerPage,
    searchTerm: debouncedSearchTerm,
    sortOrder,
  });

  return (
    <>
      <SeoHead 
        title={pageTitle}
        description={
          debouncedSearchTerm 
            ? `Resultados de búsqueda para ${debouncedSearchTerm}.` 
            : "Explora nuestra tienda - Encuentra los mejores productos en Arcoiris"
        }
      />
      <ProductListPage
        products={products}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalProducts={totalProducts}
        selectedBrands={selectedBrands}
        setSelectedBrands={handleSetSelectedBrands}
        selectedCategories={selectedCategories}
        setSelectedCategories={handleSetSelectedCategories}
        searchTerm={searchTerm}
        setSearchTerm={handleSetSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={handleSetSortOrder}
      />
    </>
  );
};

export default ShopPage;
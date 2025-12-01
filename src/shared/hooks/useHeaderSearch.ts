import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Importamos el hook
import { searchProductsAction } from '@/actions';


export const useHeaderSearch = (onClose: () => void) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // 1. Mantenemos el debounce local para no saturar la API mientras escribes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Usamos TanStack Query para la petición
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'search', debouncedQuery], // El caché depende del texto
    queryFn: () => searchProductsAction(debouncedQuery),
    // Solo se ejecuta si hay al menos 2 caracteres
    enabled: debouncedQuery.length >= 2,
    // Opcional: Mantener datos previos mientras carga los nuevos para evitar parpadeos
    placeholderData: (previousData) => previousData, 
    // Opcional: El tiempo que consideras la búsqueda "fresca"
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Handlers (igual que antes)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery(''); // Limpiamos también el debounced para resetear query
  };

  const handleProductClick = (slug: string) => {
    navigate(`/tienda/${slug}`);
    onClose();
    handleClear();
  };

  const handleViewShop = () => {
    navigate('/tienda');
    onClose();
    handleClear();
  };

  return {
    searchQuery,
    debouncedQuery,
    products, // Ya viene directo de useQuery
    isLoading: isLoading && debouncedQuery.length >= 2, // Ajuste visual
    handleSearchChange,
    handleClear,
    handleProductClick,
    handleViewShop,
  };
};
import React from 'react';
import { useState, useEffect } from 'react';
import { Switch, Tooltip } from '@mui/material';

// 1. Definimos el Producto
interface Product {
  id: string;
  is_active: boolean | null;
  name?: string;
}

// 2. CAMBIO AQUÍ: Definimos el tipo como una FUNCIÓN directa, no una interfaz con 'mutate'
type ToggleMutateFn = (
  variables: { productId: string; isActive: boolean },
  options?: { onError: (error: unknown) => void }
) => void;

// 3. Props del componente
interface OptimisticSwitchProps {
  product: Product;
  // Cambiamos el nombre a 'onToggle' para ser más semánticos y usar la función directa
  onToggle: ToggleMutateFn; 
}

export const OptimisticSwitch = ({ product, onToggle }: OptimisticSwitchProps) => {
  const [isActive, setIsActive] = useState(product.is_active ?? true);

  useEffect(() => {
    setIsActive(product.is_active ?? true);
  }, [product.is_active]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;

    // A. Optimistic UI
    setIsActive(newValue);

    // B. Llamada API
    // CAMBIO AQUÍ: Llamamos a la función directamente. Ya NO usamos .mutate()
    onToggle(
      {
        productId: product.id,
        isActive: newValue,
      },
      {
        onError: (error: unknown) => {
          setIsActive(!newValue); // Revertimos
          console.error(error);
        },
      }
    );
  };

  return (
    <Tooltip title={isActive ? "Desactivar producto" : "Activar producto"}>
      <Switch
        checked={isActive}
        onChange={handleChange}
        size="small"
        color="success"
        sx={(theme) => ({
          '& .MuiSwitch-switchBase': {
            color: isActive ? undefined : theme.palette.error.main,
          },
          '& .MuiSwitch-track': {
            backgroundColor: isActive ? undefined : theme.palette.error.main,
            opacity: isActive ? undefined : 0.5,
          },
          '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
             backgroundColor: isActive ? undefined : theme.palette.error.main,
          }
        })}
      />
    </Tooltip>
  );
};
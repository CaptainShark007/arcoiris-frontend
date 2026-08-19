import { useContext } from 'react';
import { SidebarContext } from './SidebarContext';

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar debe ser usado dentro de SidebarProvider');
  }
  return context;
};

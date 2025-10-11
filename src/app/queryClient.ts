import { QueryClient } from '@tanstack/react-query';

// Instanciar QueryClient una sola vez con configuración optimizada
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // evita refetchs durante 1 min
      gcTime: 10 * 60_000, // libera memoria a los 10 min inactivos (gcTime es la nueva API)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

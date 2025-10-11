import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors para mejor caching
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    // Optimizar para producción
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
  },
  // Optimizar imports en desarrollo
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
  },
});

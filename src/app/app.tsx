import Router from '@app/Router';
// import { store } from '@app/store';
// import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import ErrorFallback from '@shared/components/ErrorFallback';
import LazyFallback from '@shared/components/LazyFallback';
import { theme } from '@shared/constants/theme';
import { ToastProvider } from '@shared/providers/ToastProvider';
import { queryClient } from './queryClient';

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode='light'>
      <CssBaseline enableColorScheme />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LazyFallback />}>
          {/* <Provider store={store}> */}
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </ToastProvider>
          </QueryClientProvider>
          {/* </Provider> */}
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

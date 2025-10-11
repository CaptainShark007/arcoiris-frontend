import { useState, ReactNode, useCallback } from 'react';
import { Snackbar, Alert, AlertColor, Slide } from '@mui/material';
import { ToastContext, ToastContextType } from '../contexts/ToastContext';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback(
    (message: string, severity: AlertColor = 'info') => {
      setToast({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => {
      showToast(message, 'warning');
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => {
      showToast(message, 'info');
    },
    [showToast]
  );

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slots={{ transition: Slide }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant='filled'
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import BarcodeReaderIcon from '@mui/icons-material/BarcodeReader';
import toast from 'react-hot-toast';
import { useBarcodeScanner } from '@features/admin/hooks/pos/useBarcodeScanner';

interface CartScannerProps {
  enabled: boolean;
  onScan: (code: string) => Promise<unknown>;
  scanning?: boolean;
  fallbackInput?: boolean;
}

export const CartScanner = ({
  enabled,
  onScan,
  scanning = false,
  fallbackInput = false,
}: CartScannerProps) => {
  const [lastError, setLastError] = useState<string | null>(null);

  const { fallbackInputRef } = useBarcodeScanner(
    async (code) => {
      setLastError(null);
      try {
        await onScan(code);
        toast.success('Variante agregada al carrito');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo leer el código';
        setLastError(message);
        toast.error(message);
      }
    },
    {
      enabled,
      minLength: 4,
      maxDelayBetweenKeys: 50,
      processingLockDuration: 300,
      fallbackInput,
    }
  );

  return (
    <Box
      role='status'
      aria-live='polite'
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        minHeight: 24,
        color: lastError ? 'error.main' : enabled ? 'success.main' : 'text.disabled',
      }}
    >
      {scanning ? <CircularProgress size={15} /> : <BarcodeReaderIcon fontSize='small' />}
      <Typography variant='caption' sx={{ fontWeight: 600 }}>
        {lastError ?? (enabled ? 'Lector listo' : 'Lector pausado')}
      </Typography>
      {fallbackInput && (
        <input
          ref={fallbackInputRef}
          aria-hidden='true'
          tabIndex={-1}
          style={{ position: 'fixed', left: -10000, top: -10000, width: 1, height: 1, opacity: 0 }}
        />
      )}
    </Box>
  );
};

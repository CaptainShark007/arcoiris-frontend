import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, children, disabled, sx, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        sx={{
          position: 'relative',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          py: 1.5,
          ...sx,
        }}
        {...props}
      >
        {loading && (
          <CircularProgress
            size={20}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: '-10px',
              marginTop: '-10px',
            }}
          />
        )}
        <span style={{ opacity: loading ? 0 : 1 }}>
          {loading && loadingText ? loadingText : children}
        </span>
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1E40AF',
          light: '#3b5dd0',
          dark: '#062897',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#1976d2',
          light: '#93C5FD',
          dark: '#062897',
          contrastText: '#ffffff',
        },
        background: {
          default: '#F9FAFB',
          paper: '#ffffff',
        },
        text: {
          primary: '#111827',
          secondary: '#6b7280',
        },
        divider: '#e0e0e0',
        action: {
          hover: '#f5f5f5',
          selected: '#e3f2fd',
          disabled: 'rgba(0,0,0,0.3)',
        },
        info: {
          main: '#3b5dd0',
          light: '#93C5FD',
          dark: '#1E40AF',
          contrastText: '#ffffff',
        },
        success: {
          main: '#25D366',
          light: '#4caf50',
          dark: '#1EBE57',
          contrastText: '#ffffff',
        },
        grey: {
          50: '#F9FAFB',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#3b5dd0',
          light: '#93C5FD',
          dark: '#1E40AF',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#93C5FD',
          light: '#dbeafe',
          dark: '#1976d2',
          contrastText: '#ffffff',
        },
        background: {
          default: '#111827',
          paper: '#1f2937',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
        },
        divider: '#374151',
        action: {
          hover: '#374151',
          selected: '#4b5563',
          disabled: 'rgba(255,255,255,0.3)',
        },
        info: {
          main: '#3b5dd0',
          light: '#93C5FD',
          dark: '#1E40AF',
          contrastText: '#ffffff',
        },
        warning: {
          main: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
          contrastText: '#000000',
        },
        error: {
          main: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
          contrastText: '#ffffff',
        },
        success: {
          main: '#25D366',
          light: '#4ade80',
          dark: '#1EBE57',
          contrastText: '#ffffff',
        },
        grey: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        '.tiptap:focus, .tiptap *:focus': {
          outline: 'none !important',
          border: 'none !important',
          boxShadow: 'none !important',
        },
        '.tiptap p': {
          margin: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: '#1E40AF',
          color: '#ffffff',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 2px 4px rgba(0, 0, 0, 0.5)'
              : '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          transition: 'background-color 0.3s ease',
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: () => ({
          '& .MuiSwitch-thumb': {
            transition: 'background-color 0.3s ease',
          },
          '& .MuiSwitch-track': {
            transition: 'background-color 0.3s ease',
          },
        }),
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

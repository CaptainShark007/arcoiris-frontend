import React from 'react';
import { Box, Typography, Paper, Stack, useTheme } from '@mui/material';
import {
  Construction as ConstructionIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

interface UnderConstructionProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export default function UnderConstruction({
  title = 'Módulo en Construcción',
  subtitle = 'Esta funcionalidad estará disponible próximamente',
  icon,
  size = 'medium',
}: UnderConstructionProps) {
  const theme = useTheme();

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: '40vh',
          iconSize: 80,
          titleVariant: 'h5' as const,
          subtitleVariant: 'body1' as const,
          padding: 4,
        };
      case 'large':
        return {
          minHeight: '80vh',
          iconSize: 140,
          titleVariant: 'h3' as const,
          subtitleVariant: 'h6' as const,
          padding: 8,
        };
      default:
        return {
          minHeight: '60vh',
          iconSize: 100,
          titleVariant: 'h4' as const,
          subtitleVariant: 'body1' as const,
          padding: 6,
        };
    }
  };

  const config = getSizeConfig();

  const defaultIcon = (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ConstructionIcon
        sx={{
          fontSize: config.iconSize,
          color: 'primary.light',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateY(0)',
            },
            '40%': {
              transform: 'translateY(-10px)',
            },
            '60%': {
              transform: 'translateY(-5px)',
            },
          },
        }}
      />
      <BuildIcon
        sx={{
          fontSize: config.iconSize * 0.4,
          color: 'primary.dark',
          position: 'absolute',
          bottom: -5,
          right: -5,
          animation: 'rotate 3s linear infinite',
          '@keyframes rotate': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: config.minHeight,
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: config.padding,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          border: 2,
          borderColor: 'primary.main',
          borderStyle: 'dashed',
          borderRadius: 3,
          maxWidth: 600,
          width: '100%',
          background: `linear-gradient(135deg, 
            ${theme.palette.background.paper} 0%, 
            ${theme.palette.action.hover} 100%)`,
        }}
      >
        <Stack spacing={3} alignItems='center'>
          {icon || defaultIcon}

          <Box>
            <Typography
              variant={config.titleVariant}
              component='h2'
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant={config.subtitleVariant}
              color='text.secondary'
              sx={{
                maxWidth: 400,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              mt: 2,
            }}
          >
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  opacity: 0.7,
                  animation: `pulse ${1.5 + index * 0.2}s ease-in-out infinite`,
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(0.8)',
                      opacity: 0.5,
                    },
                    '50%': {
                      transform: 'scale(1.2)',
                      opacity: 1,
                    },
                    '100%': {
                      transform: 'scale(0.8)',
                      opacity: 0.5,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

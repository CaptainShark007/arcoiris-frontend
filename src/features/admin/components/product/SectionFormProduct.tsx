import { ReactNode } from 'react';
import { Typography, Paper, Box } from '@mui/material';

interface SectionProps {
  className?: string;
  titleSection?: string;
  children: ReactNode;
}

export const SectionFormProduct = ({
  titleSection,
  children,
}: SectionProps) => {
  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 1.5, md: 2 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.5 },
        bgcolor: '#f9fafb',
        height: 'fit-content',
        boxShadow: 'none',
        border: '1px solid #E5E7EB',
        borderRadius: { xs: '6px', sm: '8px' },
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {titleSection && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {titleSection}:
        </Typography>
      )}
      <Box sx={{ 
        width: '100%', 
        maxWidth: '100%',
        overflow: 'hidden',
      }}>
        {children}
      </Box>
    </Paper>
  );
};
import React from 'react';
import { Box, Container } from '@mui/material';
import { CheckoutStepper } from '../features/checkout/components/CheckoutStepper';

interface CheckoutLayoutProps {
  activeStep: number;
  completedSteps: Set<number>;
  onStepClick?: (step: number) => void;
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const CheckoutLayout = ({
  activeStep,
  completedSteps,
  onStepClick,
  children,
  sidebar
}: CheckoutLayoutProps) => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Grid principal */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          alignItems: 'start',
          //backgroundColor: 'red',
          padding: 1
        }}
      >
        {/* COLUMNA IZQUIERDA: Stepper + Contenido */}
        <Box sx={{
          //backgroundColor: 'red'
        }}>
          {/* Stepper */}
          <CheckoutStepper 
            activeStep={activeStep} 
            completedSteps={completedSteps}
            onStepClick={onStepClick}
          />
          
          {/* Contenido del paso actual */}
          {children}
        </Box>

        {/* COLUMNA DERECHA: Sidebar sticky */}
        <Box
          sx={{
            position: 'sticky',
            top: 20,
            display: { xs: 'none', md: 'block' }
          }}
        >
          {sidebar}
        </Box>
      </Box>
    </Container>
  );
};
import { Stepper, Step, StepLabel } from '@mui/material';
import { CHECKOUT_STEPS } from '@shared/types';

interface CheckoutStepperProps {
  activeStep: number;
  completedSteps: Set<number>;
  onStepClick?: (step: number) => void;
}

export const CheckoutStepper = ({ 
  activeStep, 
  completedSteps,
  onStepClick 
}: CheckoutStepperProps) => {
  return (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel
      sx={{ 
        mb: 3,
        //backgroundColor: 'red',
        //width: '100%'
      }}
    >
      {CHECKOUT_STEPS.map((step, index) => (
        <Step 
          key={step.id}
          completed={completedSteps.has(index)}
          onClick={() => onStepClick?.(index)}
          sx={{ cursor: onStepClick ? 'pointer' : 'default' }}
        >
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
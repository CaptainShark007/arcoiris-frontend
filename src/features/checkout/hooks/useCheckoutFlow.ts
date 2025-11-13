import { useState, useCallback } from 'react';
import { CHECKOUT_STEPS } from '../types/checkoutSteps';

export const useCheckoutFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleNext = useCallback(() => {
    setCompletedSteps(prev => new Set(prev).add(activeStep));
    setActiveStep(prev => Math.min(prev + 1, CHECKOUT_STEPS.length - 1));
  }, [activeStep]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleGoToStep = useCallback((step: number) => {
    // Solo permite ir a pasos completados o el siguiente
    if (step <= activeStep || completedSteps.has(step - 1)) {
      setActiveStep(step);
    }
  }, [activeStep, completedSteps]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setCompletedSteps(new Set());
  }, []);

  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  return {
    activeStep,
    completedSteps,
    currentStepConfig: CHECKOUT_STEPS[activeStep],
    totalSteps: CHECKOUT_STEPS.length,
    handleNext,
    handleBack,
    handleGoToStep,
    handleReset,
    isStepCompleted,
    isFirstStep: activeStep === 0,
    isLastStep: activeStep === CHECKOUT_STEPS.length - 1
  };
};
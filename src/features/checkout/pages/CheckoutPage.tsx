import { CheckoutLayout } from '@/layout/CheckoutLayout';
import { useCheckoutFlow } from '@/features/checkout/hooks/useCheckoutFlow';
import { CartStep } from '@/features/checkout/components/CartStep';
import { ShippingStep } from '@/features/checkout/components/ShippingStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { ConfirmationStep } from '@/features/checkout/components/ConfirmationStep';
import { CartSummary } from '@shared/components';
import { useRef } from 'react';

const CheckoutPage = () => {
  const {
    activeStep,
    completedSteps,
    handleNext,
    handleBack,
    handleGoToStep,
    handleReset
  } = useCheckoutFlow();

  // Refs para funciones de cada step
  const validateShippingRef = useRef<(() => boolean) | null>(null);
  const confirmOrderRef = useRef<(() => void) | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Maneja el avance desde el CartSummary
  const handleNextFromSummary = () => {
    // Si estamos en el paso de Shipping (paso 1), validar antes de avanzar
    if (activeStep === 1 && validateShippingRef.current) {
      const isValid = validateShippingRef.current();
      if (isValid) {
        handleNext();
      }
    } else {
      handleNext();
    }
  };

  // Renderiza el paso actual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <CartStep onNext={handleNext} />;
      case 1:
        return (
          <ShippingStep 
            onNext={handleNext} 
            onBack={handleBack}
            onValidateAndSaveRef={validateShippingRef}
          />
        );
      case 2:
        return (
          <PaymentStep 
            onNext={handleNext} 
            onBack={handleBack}
            onConfirmOrderRef={confirmOrderRef}
            isProcessingRef={isProcessingRef}
          />
        );
      case 3:
        return <ConfirmationStep onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <CheckoutLayout
      activeStep={activeStep}
      completedSteps={completedSteps}
      onStepClick={handleGoToStep}
      sidebar={
        <CartSummary 
          activeStep={activeStep}
          onNext={handleNextFromSummary}
          onBack={handleBack}
          onReset={handleReset}
          onConfirmOrder={() => confirmOrderRef.current?.()}
          isProcessing={isProcessingRef.current}
        />
      }
    >
      {renderStepContent()}
    </CheckoutLayout>
  );
};

export default CheckoutPage;
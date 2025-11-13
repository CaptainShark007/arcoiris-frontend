import { CheckoutLayout } from '@/layout/CheckoutLayout';
import { useCheckoutFlow } from '@/features/checkout/hooks/useCheckoutFlow';
import { CartStep } from '@/features/checkout/components/CartStep';
import { ShippingStep } from '@/features/checkout/components/ShippingStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { ConfirmationStep } from '@/features/checkout/components/ConfirmationStep';
import { CartSummary } from '@shared/components';

const CheckoutPage = () => {
  const {
    activeStep,
    completedSteps,
    handleNext,
    handleBack,
    handleGoToStep,
    handleReset
  } = useCheckoutFlow();

  // Renderiza el paso actual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <CartStep onNext={handleNext} />;
      case 1:
        return <ShippingStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PaymentStep onNext={handleNext} onBack={handleBack} />;
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
          onNext={handleNext}
          onBack={handleBack}
          onReset={handleReset}
        />
      }
    >
      {renderStepContent()}
    </CheckoutLayout>
  );
};

export default CheckoutPage;
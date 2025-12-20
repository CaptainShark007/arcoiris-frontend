import { CheckoutLayout } from '@/layout/CheckoutLayout';
import { useCheckoutFlow } from '@/features/checkout/hooks/useCheckoutFlow';
import { CartStep } from '@/features/checkout/components/CartStep';
import { ShippingStep } from '@/features/checkout/components/ShippingStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { ConfirmationStep } from '@/features/checkout/components/ConfirmationStep';
import { CartSummary, SeoHead } from '@shared/components';
import { useMemo, useRef } from 'react';

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

  // Lógica para cambiar el título según el paso
  const seoData = useMemo(() => {
    switch (activeStep) {
      case 0:
        return { 
          title: "Carrito de compras", 
          desc: "Revisa tus productos antes de finalizar la compra." 
        };
      case 1:
        return { 
          title: "Datos de envío", 
          desc: "Ingresa la dirección donde recibiras tu pedido." 
        };
      case 2:
        return { 
          title: "Pago", 
          desc: "Selecciona tu método de pago seguro." 
        };
      case 3:
        return { 
          title: "¡Pedido Confirmado!", 
          desc: "Gracias por tu compra en Arcoiris Shop." 
        };
      default:
        return { 
          title: "Checkout", 
          desc: "Finaliza tu compra." 
        };
    }
  }, [activeStep]);

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
            onGoToStep={handleGoToStep}
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
    <>
      <SeoHead 
        title={seoData.title} 
        description={seoData.desc}
        // Opcional: Evitar que Google indexe pasos intermedios de checkout
        // (aunque si es SPA es la misma URL, no afecta tanto)
      />
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
    </>
  );
};

export default CheckoutPage;
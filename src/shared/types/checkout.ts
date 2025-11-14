export interface CheckoutStep {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
  { 
    id: 'cart',
    label: 'Revisar orden',
    description: 'Verifica los productos en tu carrito',
    icon: 'ShoppingCart'
  },
  { 
    id: 'shipping',
    label: 'Entrega',
    description: 'Dirección y método de envío',
    icon: 'LocalShipping'
  },
  { 
    id: 'payment',
    label: 'Pago',
    description: 'Información de pago',
    icon: 'CreditCard'
  },
  { 
    id: 'confirmation',
    label: 'Confirmación',
    description: 'Resumen y confirmación final',
    icon: 'CheckCircle'
  }
];
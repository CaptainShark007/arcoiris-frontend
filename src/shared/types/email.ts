export interface DatosOrden {
  id: string | number;
  email: string;
  nombreCliente: string;
  total: number;
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  // Datos adicionales de envío
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  shippingMethod?: 'acordar' | 'retiro';
  customerEmail?: string;
  customerPhone?: string;
}
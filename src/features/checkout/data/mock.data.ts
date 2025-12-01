  import imgDefault from '@/assets/images/img-default.png';

  // DATOS SIMULADOS PARA PRUEBAS DE DISEÑO
  export const mockData = {
    id: 12345,
    orderId: 'ORD-2025-001234',
    customer: {
      full_name: 'Juan García',
      email: 'juan.garcia@example.com',
      phone: '+34 600 123 456',
    },
    totalAmount: 1599.99,
    orderItems: [
      {
        productName: 'Esmalte Sintetico Cintoplom',
        productImage: imgDefault,
        price: 999.99,
        storage: '1 Litro',
        color_name: 'Titanio Negro',
        finish: 'Mate',
      },
      {
        productName: 'Esmalte Sintetico Cintoplom',
        productImage: imgDefault,
        price: 249.99,
        storage: '4 Litros',
        color_name: 'Blanco',
        finish: 'Brillante',
      },
      {
        productName: 'Esmalte Sintetico Cintoplom',
        productImage: imgDefault,
        price: 350.01,
        storage: '10 Litros',
        color_name: 'Azul',
        finish: 'Satinado',
      },
      {
        productName: 'Canilla PVC',
        productImage: imgDefault,
        price: 350.01,
        storage: '1/2 pulg',
        color_name: '',
        finish: '',
      },
      {
        productName: 'MagSafe Case',
        productImage: imgDefault,
        price: 350.01,
        storage: '',
        color_name: 'Azul',
        finish: 'Mate',
      },
      {
        productName: 'MagSafe Case',
        productImage: imgDefault,
        price: 350.01,
        storage: '',
        color_name: 'Azul',
        finish: 'Mate',
      },
    ],
    address: {
      addressLine1: 'Calle Principal 123',
      addressLine2: 'Apartamento 4B',
      city: 'Madrid',
      state: 'Madrid',
      postalCode: '28001',
      country: 'España',
    },
  };
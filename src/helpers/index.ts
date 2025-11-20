export const formatPrice = (price?: number | null): string => {
  const safePrice = Number(price ?? 0);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safePrice);
};

// Función para formatear la fecha a formato 3 de enero de 2022
export const formatDateLong = (date: string): string => {
	const dateObject = new Date(date);

	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
	switch (status) {
		case 'pending':
			return 'Pendiente';
		case 'paid':
			return 'Pagado';
		case 'shipped':
			return 'Enviado';
		case 'delivered':
			return 'Entregado';
		default:
			return status;
	}
};
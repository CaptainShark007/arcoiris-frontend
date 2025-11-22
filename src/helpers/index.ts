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

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: '2-digit',
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

// Función para generar el slug de un producto
export const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
};

// Funcion para extraer el path relativo al bucket de una URL
export const extractFilePath = (url: string) => {
	
	const parts = url.split('/storage/v1/object/public/product-images/');

	// ejemplo parts: ['storage/v1/object/public/product-images/', '0225462168945612664-latex-interior-texolatex.jpg']

	if (parts.length !== 2) {
		throw new Error(`URL de imagen no válida: ${url}`);
	}

	return parts[1];

}
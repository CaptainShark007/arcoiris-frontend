export const formatPrice = (price?: number | null): string => {
  const safePrice = Number(price ?? 0);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safePrice);
};

export const calculateDiscount = (price: number, originalPrice?: number | null) => {
  if (!originalPrice || originalPrice <= price) return 0;
  // Formula: ((Precio Original - Precio Actual) / Precio Original) * 100
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

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

// Función para comprimir imagen
export const compressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
  return new Promise((resolve) => { // , reject
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reducir tamaño si es muy grande
        if (width > 2000 || height > 2000) {
          const ratio = Math.min(2000 / width, 2000 / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Comprimir hasta llegar al tamaño máximo
        let quality = 0.9;
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
              quality -= 0.1;
              canvas.toBlob(
                (retryBlob) => {
                  resolve(new File([retryBlob!], file.name, { type: 'image/jpeg' }));
                },
                'image/jpeg',
                quality
              );
            } else {
              resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
};

// Comprimir imagen
export const compressImageCategory = async (file: File, maxSizeMB: number = 1.5): Promise<File> => {
  return new Promise((resolve) => { // reject
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reducir tamaño si es muy grande
        if (width > 1500 || height > 1500) {
          const ratio = Math.min(1500 / width, 1500 / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Comprimir hasta llegar al tamaño máximo
        let quality = 0.9;
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
              quality -= 0.1;
              canvas.toBlob(
                (retryBlob) => {
                  resolve(new File([retryBlob!], file.name, { type: 'image/jpeg' }));
                },
                'image/jpeg',
                quality
              );
            } else {
              resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
};
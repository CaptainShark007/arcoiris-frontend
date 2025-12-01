import { compressImage, extractFilePath } from '@/helpers';
import { supabase } from '@/supabase/client';
import { CreateProductRPCResult, ProductInput } from '@shared/types';

// Nuevo metodo para listar productos con variantes paginados y con filtros varios - video
export const getFilteredProducts = async ({
  page = 1,
  brands = [],
  categoriesIds = [],
  itemsPerPage = 8,
}: {
  page: number;
  brands?: string[];
  categoriesIds?: string[];
  itemsPerPage?: number;
}) => {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // consulta base
  // mostrar solo los productos activos
  let query = supabase
    .from('products')
    .select('*, variants (*), categories(id, name, slug)', { count: 'exact' })
    .eq('is_active', true) // solo productos activos
    .eq('variants.is_active', true) // solo variantes activas (y productos que tengan al menos una variante activa)
    .order('created_at', { ascending: false })
    .range(from, to);

  // validacion para los filtros
  if (brands.length > 0) {
    query = query.in('brand', brands);
  }

  if (categoriesIds.length > 0) {
    query = query.in('category_id', categoriesIds);
  }

  // resolver la promesa
  const { data, error, count } = await query;

  if (error) {
    throw new Error('Error fetching filtered products');
  }

  const products = data?.map((p) => {
    // Obtener precios de las variantes
    const prices =
      p.variants
        ?.map((v: any) => v.price)
        .filter((price: number) => price > 0) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      ...p,
      image: p.images?.[0] ?? '/assets/images/img-default.png',
      price: minPrice,
      maxPrice: maxPrice,
      hasMultiplePrices: minPrice !== maxPrice,
    };
  });

  return { data: products, count };
};

// metodo para obtener todas las marcas unicas de la tabla products
export const getBrands = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('brand, variants!inner(is_active)') // inner join para asegurar variantes activas
    .eq('is_active', true)
    .eq('variants.is_active', true);

  if (error) {
    console.error(error);
    throw new Error('Error fetching brands');
  }

  // obtener marcas unicas 
  // @ts-ignore: data puede traer variants, pero solo nos importa brand
  const uniqueBrands = Array.from(new Set(data?.map((p: any) => p.brand)));

  return uniqueBrands;
};

// metodo para obtener los productos recientes
export const getRecentProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .eq('is_active', true)
    .eq('variants.is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    throw new Error('Error fetching recent products');
  }

  // Mapear productos con precio mínimo - adaptado
  const products = data?.map((p) => {
    const prices =
      p.variants
        ?.map((v: any) => v.price)
        .filter((price: number) => price > 0) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      ...p,
      image: p.images?.[0] ?? '/assets/images/img-default.png',
      price: minPrice,
    };
  });

  return products;
};

// metodo para obtener productos aleatorios
export const getRandomProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .eq('is_active', true)
    .eq('variants.is_active', true)
    .limit(20);

  if (error) {
    throw new Error('Error fetching recent products');
  }

  // Mapear productos con precio mínimo
  const productsWithPrice = data?.map((p) => {
    const prices =
      p.variants
        ?.map((v: any) => v.price)
        .filter((price: number) => price > 0) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      ...p,
      image: p.images?.[0] ?? '/assets/images/img-default.png',
      price: minPrice,
    };
  });

  // seleccionar 4 productos al azar
  const randomProducts = productsWithPrice
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  return randomProducts;
};

// metodo para buscar el producto por su slug
export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('variants.is_active', true)
    .single(); // seleccionar un solo registro

  if (error) {
    throw new Error('Error fetching product by slug');
  }

  return data;
};

// **************************************************************************************************
// *************************************** ADMINISTRADOR ********************************************
// **************************************************************************************************

// metodo para buscar el producto por su slug solo para el admin
export const getProductBySlugAdmin = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .eq('slug', slug)
    .eq('variants.is_active', true)
    .single(); // seleccionar un solo registro

  if (error) {
    throw new Error('Error fetching product by slug');
  }

  return data;
};

// metodo para obtener las variantes de un producto
// ver donde se usa
export const getProductVariants = async (productId: string) => {
  const { data, error } = await supabase
    .from('variants')
    .select('id, color, color_name, stock, price, storage, finish')
    .eq('is_active', true)
    .eq('product_id', productId);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// metodo para obtener todos los productos con sus variantes paginados
// usado en el panel de administrador - tabla de productos
export const getProducts = async (page: number) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const {
    data: products,
    error,
    count,
  } = await supabase
    .from('products')
    .select('*, variants(*)', { count: 'exact' })
    .eq('variants.is_active', true) // solo variantes activas
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return { products, count };
};

// metodo para actualizar la categoria de un producto
export const updateProductCategory = async (
  productId: string,
  categoryId: string | null
) => {
  const { data, error } = await supabase
    .from('products')
    .update({ category_id: categoryId })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    throw new Error(
      'Error al actualizar la categoria del producto. Vuelve a intentarlo.'
    );
  }

  return data;
};

// **************************************************************************************************
// *************************************** CREAR PRODUCTO ********************************************
// *************************************** NUEVA FORMA *******************************************
// USANDO PROCEDIMIENTO ALMACENADO Y VALIDACIONES

// Validación
const validateProductInput = async (input: ProductInput): Promise<string[]> => {
  const errors: string[] = [];

  if (!input.name?.trim())
    errors.push('El nombre del producto es obligatorio.');
  if (!input.slug?.trim()) errors.push('El slug del producto es obligatorio.');
  if (!input.brand?.trim())
    errors.push('La marca del producto es obligatoria.');
  if (!input.images?.length)
    errors.push('Al menos una imagen del producto es obligatoria.');
  if (input.images?.length > 3) errors.push('Máximo 3 imágenes por producto.');
  if (!input.variants?.length)
    errors.push('El producto debe tener al menos una variante.');

  input.variants?.forEach((v, i) => {
    if (!v.price || v.price <= 0)
      errors.push(`El precio de la variante ${i + 1} debe ser mayor a 0.`);
    if (!v.stock || v.stock < 0)
      errors.push(`El stock de la variante ${i + 1} no puede ser negativo.`);
  });

  // Validar y comprimir imagenes
  for (let i = 0; i < input.images.length; i++) {
    const img = input.images[i];

    if (
      !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(img.type)
    ) {
      errors.push(`La imagen ${i + 1} debe ser JPEG, JPG, PNG o WEBP.`);
      continue;
    }

    // si la imagen es mayor a 1.5MB
    if (img.size > 1.5 * 1024 * 1024) {
      // Comprimir automáticamente
      try {
        const compressed = await compressImage(img, 1.5);
        input.images[i] = compressed;
      } catch (error) {
        console.error(error);
        errors.push(`No se pudo comprimir la imagen ${i + 1}.`);
      }
    }
  }

  return errors;
};

export const createProduct = async (productInput: ProductInput) => {
  try {
    // 1. Validar entrada
    const validationErrors = await validateProductInput(productInput);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(' '));
    }

    // 2. Ejecutar el procedimiento almacenado (sin imagenes aun)
    const procedureResult = await (supabase.rpc as any)(
      'create_product_with_variants',
      {
        p_name: productInput.name.trim(),
        p_brand: productInput.brand.trim(),
        p_slug: productInput.slug.trim(),
        p_features: productInput.features || [],
        p_description: productInput.description
          ? JSON.parse(JSON.stringify(productInput.description))
          : {},
        p_variants: productInput.variants.map((v) => ({
          stock: v.stock,
          price: v.price,
          storage: v.storage || null,
          color: v.color || null,
          color_name: v.color_name || null,
          finish: v.finish || null,
        })),
      }
    );

    if (procedureResult.error) throw new Error(procedureResult.error.message);

    const result = (procedureResult.data as any)?.[0] as CreateProductRPCResult;
    if (!result?.success || !result?.product_id) {
      throw new Error(
        result?.message || 'Error desconocido al crear el producto.'
      );
    }

    const productId = result.product_id;

    // 3. Subir las imagenes al storage
    const uploadedImages = await Promise.allSettled(
      productInput.images.map(async (image) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${image.name}`;
        const filePath = `${productId}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
      })
    );

    // Filtrar solo las imagenes subidas correctamente
    const successfulImages = uploadedImages
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<string>).value);

    if (successfulImages.length === 0) {
      await supabase.from('products').delete().eq('id', productId);
      throw new Error('No se pudieron subir las imagenes del producto.');
    }

    // 4. Actualizar producto con imagenes
    const { error: updateError } = await supabase
      .from('products')
      .update({ images: successfulImages })
      .eq('id', productId);

    if (updateError) {
      await supabase.from('products').delete().eq('id', productId);
      throw new Error(updateError.message);
    }

    // 5. Obtener y retornar el producto creado
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError) throw new Error('Error al obtener el producto creado');

    return product;
  } catch (error) {
    console.error(error);
    throw new Error('Error al crear el producto. Vuelve a intentarlo.');
  }
};

// ***********************************************************************************************
// *********************************** ACTUALIZAR PRODUCTO ***************************************
// *************************************** NUEVA FORMA *******************************************
export const deleteProduct = async (productId: string) => {
  try {
    // 1. Obtener imágenes ANTES de eliminar en BD
    const { data: product, error: imgError } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    if (imgError) throw imgError;

    // 2. Borrar en BD - transacción atómica
    const { error: dbError } = await (supabase.rpc as any)(
      'delete_product_cascade',
      {
        p_product_id: productId,
      }
    );

    if (dbError) throw dbError;

    // 3. Eliminar archivos del Storage
    if (product?.images?.length > 0) {
      const folder = productId;

      const paths = product.images.map((url) => {
        const fileName = url.split('/').pop();
        return `${folder}/${fileName}`;
      });

      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove(paths);

      if (storageError) throw storageError;
    }

    return true;
  } catch (error) {
    console.error(error);
    throw new Error('No se pudo eliminar el producto.');
  }
};

// ***********************************************************************************************
// *********************************** ACTUALIZAR PRODUCTO ***************************************
// *************************************** NUEVA FORMA *******************************************

// USANDO PROCEDIMIENTO ALMACENADO Y VALIDACIONES
// ==================== VALIDACIÓN ====================
export const validateProductUpdateInput = async (
  input: ProductInput,
  productId: string
): Promise<string[]> => {
  const errors: string[] = [];

  if (!input.name?.trim())
    errors.push('El nombre del producto es obligatorio.');
  if (!input.slug?.trim()) errors.push('El slug del producto es obligatorio.');
  if (!input.brand?.trim())
    errors.push('La marca del producto es obligatoria.');
  if (!input.images?.length)
    errors.push('Al menos una imagen del producto es obligatoria.');
  if (input.images?.length > 3) errors.push('Máximo 3 imágenes por producto.');
  if (!input.variants?.length)
    errors.push('El producto debe tener al menos una variante.');

  // Validar slug único (excluyendo este producto)
  const { data: existingSlug, error: slugError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', input.slug.trim())
    .single();

  if (slugError && slugError.code !== 'PGRST116') {
    console.error('Error al validar slug:', slugError);
    errors.push('Error al validar el slug del producto.');
  }

  if (existingSlug && existingSlug.id !== productId) {
    errors.push('El slug ya está siendo utilizado por otro producto.');
  }

  // Validar y comprimir imágenes
  const validatedImages: (File | string)[] = [];

  for (let i = 0; i < input.images.length; i++) {
    const img = input.images[i];

    if (img instanceof File) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          img.type
        )
      ) {
        errors.push(`La imagen ${i + 1} debe ser JPEG, JPG, PNG o WEBP.`);
        continue;
      }

      if (img.size > 1.5 * 1024 * 1024) {
        try {
          const compressed = await compressImage(img, 1.5);
          validatedImages.push(compressed);
        } catch (err) {
          console.error(err);
          errors.push(`No se pudo comprimir la imagen ${i + 1}.`);
        }
      } else {
        validatedImages.push(img);
      }
    } else if (typeof img === 'string') {
      validatedImages.push(img);
    } else {
      errors.push(`Tipo de imagen no válido en posición ${i + 1}.`);
    }
  }

  // El tipo de input.images puede ser estrictamente File[] en la definición,
  // pero aquí validamos y retornamos tanto File como URLs (string).
  // Para evitar el error de asignación, hacemos un cast seguro en tiempo de compilación.
  (input as any).images = validatedImages;

  return errors;
};

// ==================== FUNCIÓN PRINCIPAL ====================
export const updateProduct = async (
  productId: string,
  productInput: ProductInput
) => {
  try {
    // 1. Validar entrada
    const validationErrors = await validateProductUpdateInput(
      productInput,
      productId
    );
    if (validationErrors.length > 0)
      throw new Error(validationErrors.join(' '));

    // 2. Obtener imágenes actuales
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    if (fetchError) throw new Error('Producto no encontrado.');

    const existingImages = currentProduct?.images || [];

    // 3. Separar imágenes nuevas (File) de URLs existentes
    const newFiles = productInput.images.filter(
      (img) => img instanceof File
    ) as File[];
    const existingUrls = productInput.images.filter(
      (img) => typeof img === 'string'
    ) as string[];

    // 4. Subir solo las imágenes nuevas
    const uploadedNewImagesResponses = await Promise.allSettled(
      newFiles.map(async (file) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const filePath = `${productId}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
      })
    );

    const newImageUrls = uploadedNewImagesResponses
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<string>).value);

    // 5. Construir lista final de imágenes que se conservarán
    const finalImages = [...existingUrls, ...newImageUrls];

    // 6. Determinar qué imágenes eliminar
    const imagesToDelete = existingImages.filter(
      (img) => !finalImages.includes(img)
    );

    const filesToDelete = imagesToDelete.map(extractFilePath);

    // 7. Eliminar imágenes obsoletas del storage
    if (filesToDelete.length > 0) {
      await supabase.storage.from('product-images').remove(filesToDelete);
    }

    // 8. Llamar al stored procedure
    const procedureResult = await (supabase.rpc as any)(
      'update_product_with_variants',
      {
        p_product_id: productId,
        p_name: productInput.name.trim(),
        p_brand: productInput.brand.trim(),
        p_slug: productInput.slug.trim(),
        p_features: productInput.features || [],
        p_description: productInput.description
          ? JSON.parse(JSON.stringify(productInput.description))
          : {},
        p_images: finalImages,
        p_variants: productInput.variants.map((v) => ({
          id: v.id || null,
          stock: v.stock,
          price: v.price,
          storage: v.storage || null,
          color: v.color || null,
          color_name: v.color_name || null,
          finish: v.finish || null,
        })),
      }
    );

    if (procedureResult.error) throw new Error(procedureResult.error.message);

    const result = procedureResult.data?.[0];
    if (!result?.success)
      throw new Error(result?.message || 'Error al actualizar el producto.');

    // 9. Retornar producto actualizado
    const { data: updatedProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    return updatedProduct;
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error al actualizar el producto.'
    );
  }
};

// funcion para activar o desactivar un producto
export const toggleProductStatus = async (
  productId: string,
  isActive: boolean
) => {
  const { data, error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    throw new Error(
      'Error al actualizar el estado del producto. Vuelve a intentarlo.'
    );
  }

  return data;
};

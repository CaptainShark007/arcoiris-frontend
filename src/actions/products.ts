import { extractFilePath } from '@/helpers';
import { supabase } from '@/supabase/client';
import { ProductInput } from '@shared/types';

// Nuevo metodo para listar productos con variantes paginados y con filtros varios - video
export const getFilteredProducts = async ({
  page = 1,
  brands = [],
  categoriesIds = [], // cambiar a ids - nuevo
  itemsPerPage = 8, // nuevo
}: {
  page: number;
  brands?: string[];
  categoriesIds?: string[]; // uuids - nuevo
  itemsPerPage?: number; // nuevo
}) => {
  // logica de paginacion
  //const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // consulta base
  let query = supabase
    .from('products')
    .select('*, variants (*), categories(id, name, slug)', { count: 'exact' }) // nuevo: obtener categorias relacionadas
    .order('created_at', { ascending: false })
    .range(from, to);

  // validacion para los filtros
  if (brands.length > 0) {
    query = query.in('brand', brands); // columna, valores
  }

  if (categoriesIds.length > 0) {
    query = query.in('category_id', categoriesIds);
  }

  // resolver la promesa
  const { data, error, count } = await query;

  if (error) {
    console.log('Error fetching filtered products:', error.message);
    throw new Error('Error fetching filtered products');
  }

  const products = data?.map((p) => {
    // Obtener precios de las variantes
    const prices = p.variants?.map((v: any) => v.price).filter((price: number) => price > 0) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    return {
      ...p,
      image: p.images?.[0] ?? "/assets/images/img-default.png",
      price: minPrice, // asigna el precio mínimo de todas las variantes
      maxPrice: maxPrice,
      hasMultiplePrices: minPrice !== maxPrice,
    };
  });

  return { data: products, count };
};

// metodo para obtener todas las marcas unicas de la tabla products
export const getBrands = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('products').select('brand');

  if (error) {
    console.log('Error fetching brands:', error.message);
    throw new Error('Error fetching brands');
  }

  // obtener marcas unicas
  const uniqueBrands = Array.from(new Set(data?.map((p) => p.brand)));

  return uniqueBrands;
};

// metodo para obtener los productos recientes
export const getRecentProducts = async () => {

  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.log('Error fetching recent products:', error.message);
    throw new Error('Error fetching recent products');
  }

  // Mapear productos con precio mínimo - adaptado
  const products = data?.map((p) => {
    const prices = p.variants?.map((v: any) => v.price).filter((price: number) => price > 0) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    
    return {
      ...p,
      image: p.images?.[0] ?? "/assets/images/img-default.png",
      price: minPrice,
    };
  });

  return products;
}

// metodo para obtener productos aleatorios
export const getRandomProducts = async () => {

  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .limit(20);

  if (error) {
    console.log('Error fetching recent products:', error.message);
    throw new Error('Error fetching recent products');
  }

  // Mapear productos con precio mínimo
  const productsWithPrice = data?.map((p) => {
    const prices = p.variants?.map((v: any) => v.price).filter((price: number) => price > 0) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    
    return {
      ...p,
      image: p.images?.[0] ?? "/assets/images/img-default.png",
      price: minPrice,
    };
  });

  // seleccionar 4 productos al azar
  const randomProducts = productsWithPrice.sort(() => 0.5 - Math.random()).slice(0, 8);

  return randomProducts;
}

// metodo para obtener los productos destacados
// metodo para obtener los productos por categoria
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.log('Error fetching categories:', error.message);
    throw new Error('Error fetching categories');
  }

  return data;
};

// metodo para buscar el producto por su slug
export const getProductBySlug = async (slug: string) => {

  const { data, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .eq('slug', slug)
    .single(); // seleccionar un solo registro

    if (error) {
      console.log('Error fetching product by slug:', error.message);
      throw new Error('Error fetching product by slug');
    }

  return data;

}

// metodo para obtener las variantes de un producto
export const getProductVariants = async (productId: string) => {
  const { data, error } = await supabase
    .from('variants')
    .select('id, color, color_name, stock, price, storage, finish')
    .eq('product_id', productId);
    // ⬅️ QUITAMOS .gt('stock', 0)

  if (error) {
    console.log('Error al obtener variantes de producto:', error.message);
    throw new Error(error.message);
  }

  return data || [];
}

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
		.order('created_at', { ascending: false })
		.range(from, to);

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	return { products, count };
};

// ADMINISTRADOR
// CRUD de productos (crear, actualizar, eliminar)

// Crear producto
// VER LA FORMA DE HACERLO TRANSACCIONAL PARA QUE SI FALLA UNA PARTE NO QUEDE INCOMPLETO
// DE MOMENTO SOLO MANEJAMOS ERRORES SIMPLES CON TRY CATCH
export const createProduct = async (productInput: ProductInput) => {

  try {
    
    // 1 Crear el producto para obtener su id
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productInput.name,
        brand: productInput.brand,
        slug: productInput.slug,
        features: productInput.features,
        description: productInput.description,
        images: [], // inicialmente vacio
      }).select().single();

      if (productError) {
        throw new Error(productError.message);
      }

      // 2. Subir las imagenes al storage dentro de una carpeta
      // que se creara a partir del producto
      const folderName = product.id;

      const uploadedImages = await Promise.all(
        productInput.images.map(async (image) => {
          const { data, error } = await supabase
            .storage
            .from('product-images')
            .upload(`${folderName}/${product.id}-${image.name}`, image);

          if (error) throw new Error(error.message);

          // obtener la url publica de la imagen subida
          const imageUrl = `${supabase.storage.from('product-images').getPublicUrl(data.path).data.publicUrl}`;

          return imageUrl;
        })
      );

      // 3. Actualizar el producto con las imagenes subidas
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: uploadedImages })
        .eq('id', product.id);

      if (updateError) throw new Error(updateError.message);

      // 4. Crear las variantes del producto
      const variants = productInput.variants.map(variant => ({
        product_id: product.id,
        stock: variant.stock,
        price: variant.price,
        storage: variant.storage,
        color: variant.color,
        color_name: variant.color_name,
        finish: variant.finish || null,
      }));

      const { error: variantsError } = await supabase
        .from('variants')
        .insert(variants);

      if (variantsError) throw new Error(variantsError.message);

    return product;

  } catch (error) {
    console.log(error);
    throw new Error('Error al crear el producto. vuelve a intentarlo.');
  }

}

// Eliminar producto
// VER LA FORMA DE HACERLO TRANSACCIONAL PARA QUE SI FALLA UNA PARTE NO QUEDE INCOMPLETO
// DE MOMENTO SOLO MANEJAMOS ERRORES SIMPLES CON TRY CATCH
export const deleteProduct = async (productId: string) => {

  try {
    
    // 1. Eliminar las variantes asociadas al producto
    const { error: variantsError } = await supabase
      .from('variants')
      .delete()
      .eq('product_id', productId);

      if (variantsError) throw new Error(variantsError.message);

    // 2. Obtener las imagenes del producto para eliminarlas del storage
    const { data: productImages, error: productImagesError } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    if (productImagesError) throw new Error(productImagesError.message);

    // 3. Eliminar el producto
    const { error: productDeleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (productDeleteError) throw new Error(productDeleteError.message);

    // 4. Eliminar las imagenes del storage
    if (productImages.images.length > 0) {

      const folnerName = productId;

      const paths = productImages.images.map(image => {
        const fileName = image.split('/').pop(); // obtener el nombre del archivo
        return `${folnerName}/${fileName}`;
      });

      const { error: storageError } = await supabase
        .storage
        .from('product-images')
        .remove(paths);

      if (storageError) throw new Error(storageError.message);

      return true;
      
    }
    

  } catch (error) {
    console.log(error);
    throw new Error('Error al eliminar el producto. vuelve a intentarlo.');
  }  

}

// Actualizar producto
// VER LA FORMA DE HACERLO TRANSACCIONAL PARA QUE SI FALLA UNA PARTE NO QUEDE INCOMPLETO
// DE MOMENTO SOLO MANEJAMOS ERRORES SIMPLES CON TRY CATCH
export const updateProduct = async (productId: string, productInput: ProductInput) => {

  try {
    
    // 1. Obtener las images actuales del producto
    const { data: currentProduct, error: currentProductError } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    if (currentProductError) throw new Error(currentProductError.message);

    const existingImages = currentProduct.images || [];

    // 2. Actualizar la informacion inidividual del producto
    const { data: updatedProduct, error: productError } = await supabase
      .from('products')
      .update({
        name: productInput.name,
        brand: productInput.brand,
        slug: productInput.slug,
        features: productInput.features,
        description: productInput.description,
      })
      .eq('id', productId)
      .select()
      .single();

    if (productError) throw new Error(productError.message);

    // 3. Manejo de imagenes (SUBIR NUEVAS Y ELIMINAR ANTIGUAS SI ES NECESARIO)
    const folderName = productId;

    const validImages = productInput.images.filter(image => image);

    // 3.1 identificar las imagenes que han sido eliminadas
    // const imagesToDelete = existingImages.filter(image => !validImages.includes(image));
    // validImages puede contener File | string, existingImages son strings (URLs),
    // por lo que usamos .some y typeof para comparar solo las entradas string.
    const imagesToDelete = existingImages.filter(image =>
      !validImages.some(v => typeof v === 'string' && v === image)
    );

    // 3.2 obtener los paths de los archivos a eliminar
    const filesToDelete = imagesToDelete.map(extractFilePath);

    // 3.3 eliminar las imagenes del storage
    if (filesToDelete.length > 0) {

      const { error: deleteImagesError } = await supabase
        .storage
        .from('product-images')
        .remove(filesToDelete);

      if (deleteImagesError) throw new Error(deleteImagesError.message);

    } else {
      console.log(`Imagenes eliminadas: ${filesToDelete.join(', ')}`);
    }

    // 3.4 subir las nuevas imagenes al storage y construir el array final de imagenes actualizadas
    const uploadedImages = await Promise.all(
      validImages.map(async (image) => {

        if (image instanceof File) {
          // si la imagen no es una URL (es un archivo), entonces subirla al storage
          const { data, error } = await supabase
            .storage
            .from('product-images')
            .upload(`${folderName}/${productId}-${image.name}`, image);

          if (error) throw new Error(error.message);

          const imageUrl = await supabase
            .storage
            .from('product-images')
            .getPublicUrl(data.path).data.publicUrl;

          return imageUrl;

        } else if (typeof image === 'string') {
          return image; // si es una URL existente, mantenerla
        } else {
          throw new Error('Tipo de imagen no válido');
        }

      })
    );

    // 4. Actualizar el producto con las imagenes actualizadas
    const { error: updateImagesError } = await supabase
      .from('products')
      .update({ images: uploadedImages })
      .eq('id', productId);

    if (updateImagesError) throw new Error(updateImagesError.message);

    // 5. Actualizar las variantes del producto
    const existingVariants = productInput.variants.filter(v => v.id);
    const newVariants = productInput.variants.filter(v => !v.id);

    // 5.1 modificar las variantes existentes
    if (existingVariants.length > 0) {
      
      const { error: updatedVariantsError } = await supabase
        .from('variants')
        .upsert(
          existingVariants.map(variant => ({
            id: variant.id,
            product_id: productId,
            stock: variant.stock,
            price: variant.price,
            storage: variant.storage,
            color: variant.color,
            color_name: variant.color_name,
            finish: variant.finish || null,
          })), {
            onConflict: 'id',
          }
        );

      if (updatedVariantsError) throw new Error(updatedVariantsError.message);

    }

    // 5.2 crear y agregar las nuevas variantes
    let newVariantIds: string[] = [];

    if (newVariants.length > 0) {

      const { data, error: insertVariantsError } = await supabase
        .from('variants')
        .insert(
          newVariants.map(variant => ({
            product_id: productId,
            stock: variant.stock,
            price: variant.price,
            storage: variant.storage,
            color: variant.color,
            color_name: variant.color_name,
            finish: variant.finish || null,
          }))
        ).select();

      if (insertVariantsError) throw new Error(insertVariantsError.message);

      newVariantIds = data.map(v => v.id);

    }

    // 5.3 combinar los ids de las variantes existentes y nuevas
    const currentVariantIds = [
      ...existingVariants.map(v => v.id),
      ...newVariantIds || [],
    ];

    // 5.4 eliminar las variantes que no estan en la lista de IDs
    const { error: deleteVariantsError } = await supabase
      .from('variants')
      .delete()
      .eq('product_id', productId)
      .not('id', 'in', `(${currentVariantIds ? currentVariantIds.join(',') : 0})`);

    if (deleteVariantsError) throw new Error(deleteVariantsError.message);

    return updatedProduct;

  } catch (error) {
    console.log(error);
    throw new Error('Error al actualizar el producto. vuelve a intentarlo.');
  }

};
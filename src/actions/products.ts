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
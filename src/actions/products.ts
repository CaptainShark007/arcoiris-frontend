import { supabase } from '@/supabase/client';

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
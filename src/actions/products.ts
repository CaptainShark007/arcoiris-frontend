import { supabase } from '@/supabase/client';

// ejemplo usado en el video
/* export const getProducts = async () => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, variants (*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error fetching products:', error.message);
    throw new Error('Error fetching products');
  }

  return products;
};
 */

// ejemplo usado en el video pero adaptado al formato actual de nuestro proyecto
/* export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      brand,
      slug,
      images,
      description,
      features,
      created_at,
      variants (
        id,
        product_id,
        price,
        stock,
        color,
        color_name,
        storage
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error fetching products:', error.message);
    throw new Error('Error fetching products');
  }

  // transformar para usar el mismo formato que el mock
  const products = data?.map((p) => ({
    ...p,
    price: p.variants?.[0]?.price ?? 0, // primer precio disponible
    image: p.images?.[0] ?? "/assets/images/img-default.png", // imagen por defecto
  }));

  return products;
}; */

// Nuevo metodo para listar productos con variantes paginados y con filtros varios - video
export const getFilteredProducts = async ({
  page = 1,
  brands = [],
  itemsPerPage = 8, // nuevo
}: {
  page: number;
  brands?: string[];
  itemsPerPage?: number; // nuevo
}) => {
  // logica de paginacion
  //const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // consulta base
  let query = supabase
    .from('products')
    .select('*, variants (*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  // validacion para los filtros
  if (brands.length > 0) {
    query = query.in('brand', brands); // columna, valores
  }

  // resolver la promesa
  const { data, error, count } = await query;

  if (error) {
    console.log('Error fetching filtered products:', error.message);
    throw new Error('Error fetching filtered products');
  }

  // NO hacer consultas innesesarias al storage para obtener las URLs de las imagenes
  /* const products = data?.map((p) => ({
    ...p,
    image: p.images?.[0]
      ? supabase.storage.from('product-images').getPublicUrl(p.images[0]).data.publicUrl
      : "/assets/images/img-default.png",
  })); */

  // obtiene la url publica de las imagenes directamente de la tabla products
  /* const products = data?.map((p) => ({
    ...p,
    image: p.images?.[0] ?? '/assets/images/img-default.png', // en caso de que no tenga imagen asignar una por defecto
  })); */

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
// metodo para obtener los productos destacados
// metodo para obtener los productos por categoria

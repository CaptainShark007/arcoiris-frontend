/* import { supabase } from '@/supabase/client';

export const getProducts = async () => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error fetching products:', error.message);
    throw new Error('Error fetching products');
  }

  return products;
};
 */

import { supabase } from '@/supabase/client';

export const getProducts = async () => {
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
};

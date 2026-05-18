import { supabase } from '../supabase/client';

export interface InventoryFilters {
  page: number;
  limit: number;
  search?: string;
  sortBy?: 'newest' | 'stock_asc' | 'stock_desc';
}

export const getInventoryVariants = async ({
  page,
  limit,
  search,
  sortBy = 'newest',
}: InventoryFilters) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('variants')
    .select(`
      id,
      stock,
      price,
      original_price,
      storage,
      color,
      color_name,
      finish,
      is_active,
      product:products!inner(
        id,
        name,
        images
      )
    `, { count: 'exact' });

  if (search) {
    query = query.ilike('product.name', `%${search}%`);
  }

  switch (sortBy) {
    case 'stock_asc':  
      query = query.order('stock', { ascending: true }); 
      break;
    case 'stock_desc': 
      query = query.order('stock', { ascending: false }); 
      break;
    case 'newest':
    default:          
      // Ensure we sort by something stable, maybe generated id or created_at if exists
      query = query.order('id', { ascending: false });  
      break;
  }

  const { data, error, count } = await query.range(from, to);
  
  if (error) {
    throw new Error(error.message);
  }

  const variants = data?.map((v: any) => {
    // Array.isArray(v.product.images)
    const images = v.product?.images;
    const thumbnail = Array.isArray(images) && images.length > 0 ? images[0] : null;

    return {
      ...v,
      product_name: v.product?.name,
      thumbnail
    };
  }) || [];

  return { variants, count };
};

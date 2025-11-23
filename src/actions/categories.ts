import { supabase } from '@/supabase/client';
import { CategoryInput } from '@shared/types';

// Obtner todas las categorías (administrador)
export const getAllCategories = async () => {

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.log('Error al obtener categorías:', error.message);
    throw new Error('Error al obtener categorías');
  }

  return data;

}

// Obtener categorías activas (para clientes)
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

// Crear una nueva categoría
export const createCategory = async (categoryInput: CategoryInput) => {

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: categoryInput.name,
      slug: categoryInput.slug,
      description: categoryInput.description || null,
      image: categoryInput.image || null,
      icon: categoryInput.icon || null,
      display_order: categoryInput.display_order || 0,
      is_active: categoryInput.is_active !== false,
    })
    .select()
    .single();

  if (error) {
    console.log('Error al crear categoría:', error.message);
    throw new Error('Error al crear categoría');
  }

  return data;

}

// Actualizar una categoría existente
export const updateCategory = async (id: string, categoryInput: Partial<CategoryInput>) => {

  const { data, error } = await supabase
    .from('categories')
    .update(categoryInput)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.log('Error al actualizar categoría:', error.message);
    throw new Error('Error al actualizar categoría');
  }

  return data;

}

// Eliminar una categoría (con validacion de productos asociados)
export const deleteCategory = async (id: string) => {

  // Verificar si hay productos asociados a esta categoría
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) {
    console.log('Error al verificar productos asociados:', countError.message);
    throw new Error('Error al verificar productos asociados');
  }

  if (count && count > 0) {
    throw new Error(`No se puede eliminar. Existen ${count} producto(s) en esta categoría.`);
  }

  // Si no hay productos, eliminar
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('Error al eliminar categoría:', error.message);
    throw new Error('Error al eliminar categoría');
  }

  return true;

}

// Generar slug automaticamente
export const generateCategorySlug = (name: string) : string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/[^\w-]/g, '') // Elimina caracteres no alfanuméricos excepto guiones
    .replace(/-+/g, '-'); // Reemplaza múltiples guiones por uno solo
}
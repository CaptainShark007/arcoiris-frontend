import { extractFilePath } from '@/helpers';
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

// Crear categoría con imagen
export const createCategory = async (
  categoryInput: CategoryInput & { image?: File }
) => {
  try {
    let imageUrl: string | null = null;

    // Si hay imagen, subirla a storage
    if (categoryInput.image && typeof categoryInput.image !== 'string') {
      const imageFile = categoryInput.image as any;
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${imageFile.name}`;
      const folderPath = `categories/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(folderPath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Error subiendo imagen: ${uploadError.message}`);
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(data.path);

      imageUrl = publicUrlData.publicUrl;
    }

    // Crear categoría en BD con la URL de la imagen
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryInput.name,
        slug: categoryInput.slug,
        description: categoryInput.description || null,
        image: imageUrl, // Guardar solo la URL, no el File
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
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Actualizar categoría con imagen
export const updateCategory = async (
  id: string,
  categoryInput: Partial<CategoryInput & { image?: File }>
) => {
  try {
    let updateData: any = {};

    // Copiar los campos de texto
    if (categoryInput.name) updateData.name = categoryInput.name;
    if (categoryInput.slug) updateData.slug = categoryInput.slug;
    if (categoryInput.description !== undefined)
      updateData.description = categoryInput.description;

    // Obtener la categoría anterior para saber qué imagen borrar
    const { data: oldCategory, error: fetchError } = await supabase
      .from('categories')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching old category:', fetchError);
    }

    // Si hay imagen nueva, subirla
    if (categoryInput.image && typeof categoryInput.image !== 'string') {
      // Primero, borrar la imagen anterior si existe
      if (oldCategory?.image) {
        try {
          const oldImagePath = extractFilePath(oldCategory.image);
          await supabase.storage
            .from('product-images')
            .remove([oldImagePath]);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // No lanzar error aquí, continuar con la actualización
        }
      }

      // Subir la nueva imagen
      const imageFile = categoryInput.image as any;
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${imageFile.name}`;
      const folderPath = `categories/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(folderPath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Error subiendo imagen: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(data.path);

      updateData.image = publicUrlData.publicUrl;
    } else if (categoryInput.image === null) {
      // Si explícitamente se pasa null, borrar la imagen
      if (oldCategory?.image) {
        try {
          const oldImagePath = extractFilePath(oldCategory.image);
          await supabase.storage
            .from('product-images')
            .remove([oldImagePath]);
        } catch (deleteError) {
          console.error('Error deleting image:', deleteError);
        }
      }
      updateData.image = null;
    }

    // Actualizar la categoría
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error al actualizar categoría:', error.message);
      throw new Error('Error al actualizar categoría');
    }

    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Eliminar una categoría (con validacion de productos asociados)

// Eliminar categoría con validación de productos e imagen
export const deleteCategory = async (id: string, imageUrl?: string | null) => {
  try {
    // 1. Verificar si hay productos en esta categoría
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) {
      console.log('Error checking products:', countError.message);
      throw new Error('Error al verificar productos');
    }

    if (count && count > 0) {
      throw new Error(
        `No se puede eliminar. Existen ${count} producto(s) en esta categoría.`
      );
    }

    // 2. Si hay imagen, eliminarla del storage
    if (imageUrl) {
      try {
        // Extraer el path relativo de la URL
        const urlParts = imageUrl.split('/storage/v1/object/public/product-images/');
        if (urlParts.length === 2) {
          const filePath = urlParts[1];
          
          await supabase.storage
            .from('product-images')
            .remove([filePath]);
        }
      } catch (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continuar con la eliminación aunque falle la imagen
      }
    }

    // 3. Eliminar la categoría de la BD
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting category:', error.message);
      throw new Error('Error al eliminar la categoría');
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const countProductsByCategory = async (categoryId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  if (error) {
    console.log('Error counting products:', error.message);
    throw new Error('Error al contar productos');
  }

  return count || 0;
};

// Generar slug automaticamente
export const generateCategorySlug = (name: string) : string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/[^\w-]/g, '') // Elimina caracteres no alfanuméricos excepto guiones
    .replace(/-+/g, '-'); // Reemplaza múltiples guiones por uno solo
}
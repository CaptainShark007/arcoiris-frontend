import { supabase } from '@/supabase/client';
import { Partner, PartnerInput } from '@shared/types';

// ============================================================================
// LISTAR SOCIOS (Paginado y Filtrado)
// ============================================================================
export const getPartners = async ({
  page = 1,
  limit = 10,
  searchTerm = '',
  status = 'all' // 'all' | 'active' | 'inactive'
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: 'all' | 'active' | 'inactive';
}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('partners')
    .select('*', { count: 'exact' });

  // Filtro por término de búsqueda (nombre o código)
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`);
  }

  // Filtro por estado
  if (status !== 'all') {
    query = query.eq('is_active', status === 'active');
  }

  // Ordenamiento y Paginación
  query = query
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching partners:', error);
    throw new Error('Error al obtener la lista de socios.');
  }

  return { 
    partners: data as Partner[], 
    count 
  };
};

// ============================================================================
// OBTENER SOCIO POR ID
// ============================================================================
export const getPartnerById = async (id: string) => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching partner:', error);
    throw new Error('Error al obtener los detalles del socio.');
  }

  return data as Partner;
};

// ============================================================================
// CREAR SOCIO
// ============================================================================
export const createPartner = async (name: string, code: string) => {
  try {
    // 1. Validaciones básicas
    if (!name.trim()) throw new Error('El nombre es obligatorio.');
    if (!code.trim()) throw new Error('El código es obligatorio.');

    // 2. Limpieza de datos (Código en mayúsculas, sin espacios)
    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');
    const cleanName = name.trim();

    // 3. Insertar en BD
    const { data, error } = await supabase
      .from('partners')
      .insert([{ 
        name: cleanName, 
        code: cleanCode,
        is_active: true // Por defecto activo
      }])
      .select()
      .single();

    if (error) {
      // Manejo de error de duplicados (código único)
      if (error.code === '23505') {
        throw new Error(`El código "${cleanCode}" ya está en uso por otro socio.`);
      }
      throw error;
    }

    return { success: true, partner: data };

  } catch (error: any) {
    console.error('Error creating partner:', error);
    // Relanzamos el error limpio para que lo muestre la UI
    throw new Error(error.message || 'Error al crear el socio.');
  }
};

// ============================================================================
// ACTUALIZAR SOCIO
// ============================================================================
export const updatePartner = async (id: string, updates: Partial<PartnerInput>) => {
  try {
    // Si se actualiza el código, limpiarlo igual que al crear
    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase().replace(/\s+/g, '');
    }
    
    if (updates.name) {
      updates.name = updates.name.trim();
    }

    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error(`El código "${updates.code}" ya está en uso.`);
      }
      throw error;
    }

    return { success: true, partner: data };

  } catch (error: any) {
    console.error('Error updating partner:', error);
    throw new Error(error.message || 'Error al actualizar el socio.');
  }
};

// ============================================================================
// ELIMINAR SOCIO
// ============================================================================
export const deletePartner = async (id: string) => {
  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    // Es posible que falle si tiene FKs (órdenes asociadas), 
    // aunque definimos ON DELETE SET NULL, por seguridad manejamos el error.
    throw new Error('Error al eliminar el socio.');
  }
};

// ============================================================================
// TOGGLE ESTADO (Activar/Desactivar)
// ============================================================================
export const togglePartnerStatus = async (id: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('partners')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('Error al cambiar el estado del socio.');
  }

  return data;
};
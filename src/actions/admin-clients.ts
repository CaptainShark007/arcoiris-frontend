import { supabase } from '@/supabase/client';
import { AdminClient, AdminClientInput } from '@shared/types/admin-client';

// Obtener todos los clientes admin (con opción de buscar por texto)
export const getAdminClients = async (
  search: string = '',
  onlyActive: boolean = false
): Promise<AdminClient[]> => {
  let query = supabase
    .from('admin_clients')
    .select('id, created_at, full_name, phone, email, is_active')
    .order('full_name', { ascending: true });

  if (onlyActive) {
    query = query.eq('is_active', true);
  }

  if (search.trim().length >= 2) {
    const term = search.trim();
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
};

// Obtener un cliente admin por ID
export const getAdminClientById = async (id: string): Promise<AdminClient> => {
  const { data, error } = await supabase
    .from('admin_clients')
    .select('id, created_at, full_name, phone, email, is_active')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Crear un cliente admin
export const createAdminClient = async (input: AdminClientInput): Promise<AdminClient> => {
  const { data, error } = await supabase
    .from('admin_clients')
    .insert({
      full_name: input.full_name,
      phone: input.phone,
      email: input.email || null,
      is_active: input.is_active ?? true,
    })
    .select('id, created_at, full_name, phone, email, is_active')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Actualizar un cliente admin
export const updateAdminClient = async (
  id: string,
  input: Partial<AdminClientInput>
): Promise<AdminClient> => {
  const updateData: Record<string, unknown> = {};
  if (input.full_name !== undefined) updateData.full_name = input.full_name;
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.email !== undefined) updateData.email = input.email || null;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;

  const { data, error } = await supabase
    .from('admin_clients')
    .update(updateData)
    .eq('id', id)
    .select('id, created_at, full_name, phone, email, is_active')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Eliminar un cliente admin (hard delete)
export const deleteAdminClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_clients')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

// Buscar clientes para el selector del POS (rápido, solo activos)
export const searchAdminClientsForPos = async (
  search: string
): Promise<AdminClient[]> => {
  if (search.trim().length < 2) return [];

  const term = search.trim();
  const { data, error } = await supabase
    .from('admin_clients')
    .select('id, created_at, full_name, phone, email, is_active')
    .eq('is_active', true)
    .or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
    .order('full_name', { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);
  return data || [];
};

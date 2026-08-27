import { supabase } from '@/supabase/client';
import {
  BudgetDetail,
  BudgetItem,
  BudgetListItem,
  BudgetStatus,
  CreateBudgetInput,
  CreateBudgetResponse,
  ConvertBudgetResponse,
} from '@shared/types';

// El cliente tipado aun no conoce las tablas budgets/budget_items ni la funcion
// convert_budget_to_order (se agregan via migracion). Se usa `any` solo para las
// llamadas a tablas/RPC nuevas; en runtime funcionan una vez aplicada la migracion.
const db = supabase as any;

// Crear un presupuesto (no descuenta stock)
export const createBudget = async (
  input: CreateBudgetInput
): Promise<CreateBudgetResponse> => {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
      return {
        success: false,
        error: 'No autenticado',
        message: 'Debes iniciar sesión para crear un presupuesto',
      };
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + input.validityDays);
    const validUntilStr = validUntil.toISOString().slice(0, 10);

    const subtotal = input.items.reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    );

    const { data: budget, error: budgetError } = await db
      .from('budgets')
      .insert({
        admin_client_id: input.adminClientId || null,
        user_id: userData.user.id,
        status: 'draft',
        notes: input.notes || null,
        validity_days: input.validityDays,
        valid_until: validUntilStr,
        subtotal,
        total_amount: input.totalAmount,
      })
      .select('id')
      .single();

    if (budgetError) {
      return {
        success: false,
        error: budgetError.message,
        message: 'Error al crear el presupuesto',
      };
    }

    const budgetId = budget.id;

    if (input.items.length > 0) {
      const items = input.items.map((it) => ({
        budget_id: budgetId,
        variant_id: it.variantId,
        quantity: it.quantity,
        price: it.price,
        product_snapshot: it.productSnapshot,
      }));

      const { error: itemsError } = await db.from('budget_items').insert(items);

      if (itemsError) {
        return {
          success: false,
          error: itemsError.message,
          message: 'Error al registrar los items del presupuesto',
        };
      }
    }

    return {
      success: true,
      budgetId,
      message: 'Presupuesto creado correctamente',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error interno al crear el presupuesto',
    };
  }
};

// Listar presupuestos (panel) con filtro de estado y paginacion
export const getBudgets = async (
  page: number = 1,
  limit: number = 10,
  status: BudgetStatus | 'all' = 'all'
): Promise<{ data: BudgetListItem[]; count: number }> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = db
    .from('budgets')
    .select(
      'id, created_at, status, total_amount, validity_days, valid_until, admin_client_id, admin_clients(full_name, email, phone)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const dataMapped: BudgetListItem[] = (data || []).map((b: any) => ({
    id: b.id,
    created_at: b.created_at,
    status: b.status,
    total_amount: b.total_amount,
    validity_days: b.validity_days,
    valid_until: b.valid_until ?? null,
    admin_client_id: b.admin_client_id ?? null,
    admin_clients: b.admin_clients
      ? {
          full_name: b.admin_clients.full_name,
          email: b.admin_clients.email ?? null,
          phone: b.admin_clients.phone,
        }
      : null,
  }));

  return { data: dataMapped, count: count || 0 };
};

// Obtener el detalle de un presupuesto por ID
export const getBudgetById = async (id: number): Promise<BudgetDetail> => {
  const { data: budget, error } = await db
    .from('budgets')
    .select('*, admin_clients(full_name, email, phone), budget_items(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  const client = budget.admin_clients
    ? {
        full_name: budget.admin_clients.full_name,
        email: budget.admin_clients.email ?? null,
        phone: budget.admin_clients.phone,
      }
    : null;

  const items: BudgetItem[] = (budget.budget_items || []).map((it: any) => ({
    id: it.id,
    variantId: it.variant_id,
    productName: it.product_snapshot?.name ?? '',
    image: it.product_snapshot?.image ?? '',
    color_name: it.product_snapshot?.color ?? null,
    storage: it.product_snapshot?.storage ?? null,
    finish: it.product_snapshot?.finish ?? null,
    color: it.product_snapshot?.color ?? null,
    price: it.price,
    quantity: it.quantity,
  }));

  return {
    id: budget.id,
    created_at: budget.created_at,
    status: budget.status,
    notes: budget.notes ?? null,
    validity_days: budget.validity_days,
    valid_until: budget.valid_until ?? null,
    subtotal: budget.subtotal,
    total_amount: budget.total_amount,
    admin_client_id: budget.admin_client_id,
    converted_order_id: budget.converted_order_id ?? null,
    client,
    items,
  };
};

// Cambiar el estado de un presupuesto
export const updateBudgetStatus = async ({
  id,
  status,
}: {
  id: number;
  status: BudgetStatus;
}) => {
  const { error } = await db.from('budgets').update({ status }).eq('id', id);

  if (error) throw new Error(error.message);
};

// Convertir un presupuesto en una orden de venta (descuenta stock)
export const convertBudgetToOrder = async (
  budgetId: number
): Promise<ConvertBudgetResponse> => {
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData.user) {
    throw new Error('No autenticado');
  }

  const { data, error } = await db.rpc('convert_budget_to_order', {
    p_budget_id: budgetId,
    p_user_id: userData.user.id,
  });

  if (error) throw new Error(error.message);

  if (!data?.success) {
    throw new Error(data?.error || 'No se pudo convertir el presupuesto');
  }

  return { success: true, orderId: data.orderId };
};

// ============================================================
// Tipos del dominio de presupuestos (budgets)
// ============================================================

export type BudgetStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'converted';

// Opcion de variante disponible para elegir dentro del carrito
export interface BudgetVariantOption {
  id: string;
  price: number;
  stock: number;
  color_name: string | null;
  storage: string | null;
  finish: string | null;
  color: string | null;
}

// Linea del presupuesto en el carrito.
// variantId es null mientras la variante no fue elegida (linea pendiente).
export interface BudgetCartLine {
  key: string;
  productId: string;
  productName: string;
  image: string;
  variants: BudgetVariantOption[];
  variantId: string | null;
  color_name: string | null;
  storage: string | null;
  finish: string | null;
  color: string | null;
  price: number;
  quantity: number;
}

// Item persistido en budget_items
export interface BudgetItem {
  id: string;
  variantId: string;
  productName: string;
  image: string;
  color_name: string | null;
  storage: string | null;
  finish: string | null;
  color: string | null;
  price: number;
  quantity: number;
}

// Presupuesto en la lista (panel)
export interface BudgetListItem {
  id: number;
  created_at: string;
  status: BudgetStatus;
  total_amount: number;
  validity_days: number;
  valid_until: string | null;
  admin_client_id: string | null;
  admin_clients: {
    full_name: string;
    email: string | null;
    phone: string;
  } | null;
}

// Detalle completo de un presupuesto
export interface BudgetDetail {
  id: number;
  created_at: string;
  status: BudgetStatus;
  notes: string | null;
  validity_days: number;
  valid_until: string | null;
  subtotal: number;
  total_amount: number;
  admin_client_id: string | null;
  converted_order_id: number | null;
  client: {
    full_name: string;
    email: string | null;
    phone: string;
  } | null;
  items: BudgetItem[];
}

// Entrada para crear un presupuesto
export interface CreateBudgetItemInput {
  variantId: string;
  quantity: number;
  price: number;
  productSnapshot: {
    name: string;
    image: string;
    color: string | null;
    storage: string | null;
    finish: string | null;
  };
}

export interface CreateBudgetInput {
  adminClientId: string | null;
  notes: string;
  validityDays: number;
  items: CreateBudgetItemInput[];
  totalAmount: number;
}

export interface CreateBudgetResponse {
  success: boolean;
  budgetId?: number;
  error?: string;
  message?: string;
}

export interface ConvertBudgetResponse {
  success: boolean;
  orderId?: number;
  error?: string;
}

export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  expired: 'Vencido',
  converted: 'Convertido',
};

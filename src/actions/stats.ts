import { supabase } from '@/supabase/client';

type RpcError = { message: string } | null;

type RpcResponse<T> = {
  data: T;
  error: RpcError;
};

const runRpc = async <T>(fn: string, params?: Record<string, unknown>) => {
  const { data, error } = (await (supabase.rpc as any)(fn, params)) as RpcResponse<T>;

  if (error) throw new Error(error.message);

  return data;
};

type DashboardStatsRow = {
  total_orders: number | null;
  total_products: number | null;
  total_categories: number | null;
  total_sales: number | null;
};

type DashboardSalesRow = {
  day: string;
  total_sales: number | null;
  total_orders: number | null;
};

type DashboardSalesByChannelRow = {
  channel: 'direct' | 'partner' | string;
  total_sales: number | null;
  total_orders: number | null;
};

type DashboardOrdersByStatusRow = {
  status: string | null;
  total_orders: number | null;
};

type DashboardTopProductRow = {
  product_name: string | null;
  total_quantity: number | null;
  total_sales: number | null;
};

type DashboardRecentOrderRow = {
  id: number | null;
  created_at: string | null;
  status: string | null;
  total_amount: number | null;
  sale_channel: string | null;
  origin_name: string | null;
  origin_email: string | null;
  origin_phone: string | null;
};

export type DashboardStats = {
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalSales: number;
};

export type DashboardSalesPoint = {
  day: string;
  totalSales: number;
  totalOrders: number;
};

export type DashboardSalesChannelPoint = {
  channel: 'direct' | 'partner';
  totalSales: number;
  totalOrders: number;
};

export type DashboardOrderStatus = {
  status: string;
  totalOrders: number;
};

export type DashboardTopProduct = {
  productName: string;
  totalQuantity: number;
  totalSales: number;
};

export type DashboardRecentOrder = {
  id: number;
  createdAt: string;
  status: string | null;
  totalAmount: number;
  saleChannel: string | null;
  originName: string | null;
  originEmail: string | null;
  originPhone: string | null;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const data = await runRpc<DashboardStatsRow[] | DashboardStatsRow | null>(
    'get_dashboard_stats'
  );
  const stats = Array.isArray(data) ? data[0] : data;

  return {
    totalOrders: stats?.total_orders || 0,
    totalProducts: stats?.total_products || 0,
    totalCategories: stats?.total_categories || 0,
    totalSales: stats?.total_sales || 0,
  };
};

export const getDashboardSalesSeries = async (days: number): Promise<DashboardSalesPoint[]> => {
  const data = await runRpc<DashboardSalesRow[] | null>(
    'get_dashboard_sales_series_range',
    { days }
  );
  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    day: row.day,
    totalSales: row.total_sales || 0,
    totalOrders: row.total_orders || 0,
  }));
};

export const getDashboardSalesByChannel = async (
  days: number
): Promise<DashboardSalesChannelPoint[]> => {
  const data = await runRpc<DashboardSalesByChannelRow[] | null>(
    'get_dashboard_sales_by_channel',
    { days }
  );
  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    channel: row.channel as DashboardSalesChannelPoint['channel'],
    totalSales: row.total_sales || 0,
    totalOrders: row.total_orders || 0,
  }));
};

export const getDashboardOrdersByStatus = async (
  days: number
): Promise<DashboardOrderStatus[]> => {
  const data = await runRpc<DashboardOrdersByStatusRow[] | null>(
    'get_dashboard_orders_by_status',
    { days }
  );
  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    status: row.status || 'Pendiente',
    totalOrders: Number(row.total_orders || 0),
  }));
};

export const getDashboardTopProducts = async (
  days: number,
  limitCount: number = 5
): Promise<DashboardTopProduct[]> => {
  const data = await runRpc<DashboardTopProductRow[] | null>(
    'get_dashboard_top_products',
    {
      days,
      limit_count: limitCount,
    }
  );
  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    productName: row.product_name || 'Sin nombre',
    totalQuantity: Number(row.total_quantity || 0),
    totalSales: Number(row.total_sales || 0),
  }));
};

export const getDashboardRecentOrders = async (
  days: number,
  limitCount: number = 8
): Promise<DashboardRecentOrder[]> => {
  const data = await runRpc<DashboardRecentOrderRow[] | null>(
    'get_dashboard_recent_orders',
    {
      days,
      limit_count: limitCount,
    }
  );
  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    id: Number(row.id || 0),
    createdAt: row.created_at || '',
    status: row.status ?? null,
    totalAmount: Number(row.total_amount || 0),
    saleChannel: row.sale_channel ?? null,
    originName: row.origin_name ?? null,
    originEmail: row.origin_email ?? null,
    originPhone: row.origin_phone ?? null,
  }));
};

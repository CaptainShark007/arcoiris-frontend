import { supabase } from '@/supabase/client';

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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc('get_dashboard_stats');

  if (error) throw new Error(error.message);

  const stats = Array.isArray(data) ? data[0] : data;

  return {
    totalOrders: stats?.total_orders || 0,
    totalProducts: stats?.total_products || 0,
    totalCategories: stats?.total_categories || 0,
    totalSales: stats?.total_sales || 0,
  };
};

export const getDashboardSalesSeries = async (days: number): Promise<DashboardSalesPoint[]> => {
  const { data, error } = await supabase.rpc('get_dashboard_sales_series_range', { days });

  if (error) throw new Error(error.message);

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
  const { data, error } = await supabase.rpc('get_dashboard_sales_by_channel', { days });

  if (error) throw new Error(error.message);

  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    channel: row.channel,
    totalSales: row.total_sales || 0,
    totalOrders: row.total_orders || 0,
  }));
};

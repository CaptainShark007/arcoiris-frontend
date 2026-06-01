create or replace function public.get_dashboard_stats()
returns table (
  total_orders bigint,
  total_products bigint,
  total_categories bigint,
  total_sales numeric
)
language sql
as $$
  select
    (select count(*) from public.orders) as total_orders,
    (select count(*) from public.products where is_deleted = false) as total_products,
    (select count(*) from public.categories) as total_categories,
    (select coalesce(sum(total_amount), 0) from public.orders) as total_sales;
$$;

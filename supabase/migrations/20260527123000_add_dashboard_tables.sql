create or replace function public.get_dashboard_orders_by_status(days integer)
returns table (
  status text,
  total_orders bigint
)
language sql
as $$
  select
    o.status,
    count(*) as total_orders
  from public.orders o
  where o.created_at::date >= current_date - (greatest(days, 1) - 1) * interval '1 day'
  group by o.status
  order by total_orders desc;
$$;

create or replace function public.get_dashboard_top_products(days integer, limit_count integer default 5)
returns table (
  product_name text,
  total_quantity bigint,
  total_sales numeric
)
language sql
as $$
  select
    coalesce(oi.product_snapshot->>'name', 'Sin nombre') as product_name,
    sum(oi.quantity)::bigint as total_quantity,
    coalesce(sum(oi.quantity * oi.price), 0) as total_sales
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where o.created_at::date >= current_date - (greatest(days, 1) - 1) * interval '1 day'
  group by product_name
  order by total_quantity desc
  limit limit_count;
$$;

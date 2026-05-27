create or replace function public.get_dashboard_recent_orders(days integer, limit_count integer default 8)
returns table (
  id bigint,
  created_at timestamptz,
  status text,
  total_amount numeric,
  sale_channel text,
  customer_name text
)
language sql
as $$
  select
    o.id,
    o.created_at,
    o.status,
    o.total_amount,
    o.sale_channel,
    c.full_name as customer_name
  from public.orders o
  left join public.customers c on c.id = o.customer_id
  where o.created_at::date >= current_date - (greatest(days, 1) - 1) * interval '1 day'
  order by o.created_at desc
  limit limit_count;
$$;

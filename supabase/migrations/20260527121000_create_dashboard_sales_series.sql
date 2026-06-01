create or replace function public.get_dashboard_sales_series()
returns table (
  day date,
  total_sales numeric,
  total_orders bigint
)
language sql
as $$
  select
    d::date as day,
    coalesce(sum(o.total_amount), 0) as total_sales,
    count(o.id) as total_orders
  from generate_series(current_date - interval '6 day', current_date, interval '1 day') d
  left join public.orders o on o.created_at::date = d::date
  group by d
  order by d;
$$;

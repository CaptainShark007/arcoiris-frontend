create or replace function public.get_dashboard_sales_series_range(days integer)
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
  from generate_series(
    current_date - (greatest(days, 1) - 1) * interval '1 day',
    current_date,
    interval '1 day'
  ) d
  left join public.orders o on o.created_at::date = d::date
  group by d
  order by d;
$$;

create or replace function public.get_dashboard_sales_by_channel(days integer)
returns table (
  channel text,
  total_sales numeric,
  total_orders bigint
)
language sql
as $$
  select
    case when o.partner_id is null then 'direct' else 'partner' end as channel,
    coalesce(sum(o.total_amount), 0) as total_sales,
    count(o.id) as total_orders
  from public.orders o
  where o.created_at::date >= current_date - (greatest(days, 1) - 1) * interval '1 day'
  group by channel
  order by channel;
$$;

alter table public.orders
  drop column if exists pos_user_id,
  drop column if exists pos_user_name,
  drop column if exists pos_user_email,
  drop column if exists pos_user_phone;

drop function if exists public.get_dashboard_recent_orders(integer, integer);

create or replace function public.get_dashboard_recent_orders(days integer, limit_count integer default 8)
returns table (
  id bigint,
  created_at timestamptz,
  status text,
  total_amount numeric,
  sale_channel text,
  origin_name text,
  origin_email text,
  origin_phone text
)
language sql
as $$
  select
    o.id,
    o.created_at,
    o.status,
    o.total_amount,
    o.sale_channel,
    case when o.sale_channel = 'pos' then 'Administrador' else c.full_name end as origin_name,
    case when o.sale_channel = 'pos' then null else c.email end as origin_email,
    case when o.sale_channel = 'pos' then null else c.phone end as origin_phone
  from public.orders o
  left join public.customers c on c.id = o.customer_id
  where o.created_at::date >= current_date - (greatest(days, 1) - 1) * interval '1 day'
  order by o.created_at desc
  limit limit_count;
$$;

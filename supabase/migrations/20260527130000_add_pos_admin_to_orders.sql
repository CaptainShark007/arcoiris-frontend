alter table public.orders
  add column if not exists pos_user_id uuid,
  add column if not exists pos_user_name text,
  add column if not exists pos_user_email text,
  add column if not exists pos_user_phone text;

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
    case when o.sale_channel = 'pos' then o.pos_user_name else c.full_name end as origin_name,
    case when o.sale_channel = 'pos' then o.pos_user_email else c.email end as origin_email,
    case when o.sale_channel = 'pos' then o.pos_user_phone else c.phone end as origin_phone
  from public.orders o
  left join public.customers c on c.id = o.customer_id
  where o.created_at::date >= current_date - (greatest(days, 1) - 1) * interval '1 day'
  order by o.created_at desc
  limit limit_count;
$$;

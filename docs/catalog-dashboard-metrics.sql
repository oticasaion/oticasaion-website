-- Executar uma vez no SQL Editor do projeto Supabase.
-- Métricas derivadas exclusivamente de public.products. Sem dados fictícios de vendas ou acessos.
begin;
create or replace function public.catalog_dashboard_metrics()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'total', count(*),
    'without_photo', count(*) filter (where coalesce(cardinality(images), 0) = 0),
    'promotions', count(*) filter (where is_promo is true),
    'featured', count(*) filter (where is_bestseller is true),
    'added_last_30_days', count(*) filter (where created_at >= now() - interval '30 days'),
    'average_price', round(avg(current_price)::numeric, 2)
  )
  from public.products
  where (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and (select auth.uid()) is not null
    and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
$$;
revoke all on function public.catalog_dashboard_metrics() from public, anon;
grant execute on function public.catalog_dashboard_metrics() to authenticated;
commit;

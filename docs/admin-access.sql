-- Apply in the Supabase SQL Editor after reviewing docs/ADMIN_ACCESS.md.
-- Only catalog authorization; signup must also be disabled in Auth settings.
begin;
alter table public.products enable row level security;

drop policy if exists "Gerenciamento de produtos por usuários autenticados" on public.products;
drop policy if exists "Produtos visíveis publicamente" on public.products;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;
drop policy if exists "products_admin_insert_guard" on public.products;
drop policy if exists "products_admin_update_guard" on public.products;
drop policy if exists "products_admin_delete_guard" on public.products;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
revoke insert, update, delete, truncate, references, trigger on public.products from anon;
revoke truncate, references, trigger on public.products from authenticated;

create policy "products_public_read" on public.products for select to anon, authenticated using (true);
create policy "products_admin_insert" on public.products for insert to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
create policy "products_admin_update" on public.products for update to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false))
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
create policy "products_admin_delete" on public.products for delete to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));

-- Restrictive guards also constrain any other permissive write policies.
create policy "products_admin_insert_guard" on public.products as restrictive for insert to public
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
create policy "products_admin_update_guard" on public.products as restrictive for update to public
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false))
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
create policy "products_admin_delete_guard" on public.products as restrictive for delete to public
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
commit;

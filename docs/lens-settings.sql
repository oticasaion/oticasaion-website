-- Execute uma vez no SQL Editor do Supabase para habilitar a edição das lentes.
begin;
alter table public.site_settings drop constraint if exists site_settings_home_only;
alter table public.site_settings add constraint site_settings_known_keys check (key in ('home', 'lenses'));

drop policy if exists site_settings_public_read on public.site_settings;
drop policy if exists site_settings_admin_insert on public.site_settings;
drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated
using (key in ('home', 'lenses'));
create policy site_settings_admin_insert on public.site_settings for insert to authenticated
with check (key in ('home', 'lenses') and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
create policy site_settings_admin_update on public.site_settings for update to authenticated
using (key in ('home', 'lenses') and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false))
with check (key in ('home', 'lenses') and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
commit;

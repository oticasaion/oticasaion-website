-- Execute uma vez no SQL Editor do projeto Supabase para ativar a personalização da home.
begin;
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_settings_home_only check (key = 'home'),
  constraint site_settings_value_object check (jsonb_typeof(value) = 'object')
);

alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
revoke insert, update, delete, truncate, references, trigger on public.site_settings from anon;
revoke delete, truncate, references, trigger on public.site_settings from authenticated;

drop policy if exists site_settings_public_read on public.site_settings;
drop policy if exists site_settings_admin_insert on public.site_settings;
drop policy if exists site_settings_admin_update on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (key = 'home');
create policy site_settings_admin_insert on public.site_settings for insert to authenticated
with check (key = 'home' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
create policy site_settings_admin_update on public.site_settings for update to authenticated
using (key = 'home' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false))
with check (key = 'home' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.uid()) is not null and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false));
commit;

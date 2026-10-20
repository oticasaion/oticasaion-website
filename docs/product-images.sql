-- Configuração única para o upload de imagens de produtos.
-- Execute no SQL Editor do mesmo projeto Supabase usado pelo site.
-- Bucket público: somente fotos de catálogo, nunca receitas ou dados pessoais.
begin;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_select" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;
drop policy if exists "product_images_insert_guard" on storage.objects;
drop policy if exists "product_images_update_guard" on storage.objects;
drop policy if exists "product_images_delete_guard" on storage.objects;

create policy "product_images_admin_insert" on storage.objects
for insert to authenticated with check (bucket_id = 'product-images' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and (select auth.uid()) is not null
    and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "product_images_admin_select" on storage.objects
for select to authenticated using (bucket_id = 'product-images' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and (select auth.uid()) is not null
    and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "product_images_admin_delete" on storage.objects
for delete to authenticated using (bucket_id = 'product-images' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and (select auth.uid()) is not null
    and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
    and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Other buckets keep their existing policies. Guard this bucket against broader policies.
create policy "product_images_insert_guard" on storage.objects as restrictive
for insert to public with check (bucket_id <> 'product-images' or ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and (select auth.uid()) is not null
    and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
    and (storage.foldername(name))[1] = (select auth.uid())::text));
create policy "product_images_update_guard" on storage.objects as restrictive
for update to public using (bucket_id <> 'product-images')
with check (bucket_id <> 'product-images');
create policy "product_images_delete_guard" on storage.objects as restrictive
for delete to public using (bucket_id <> 'product-images' or ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and (select auth.uid()) is not null
    and not coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
    and (storage.foldername(name))[1] = (select auth.uid())::text));
commit;

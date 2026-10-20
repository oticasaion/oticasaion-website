-- Mantém as lentes ativas nas armações já cadastradas.
alter table public.products
  add column if not exists lenses_enabled boolean not null default true;

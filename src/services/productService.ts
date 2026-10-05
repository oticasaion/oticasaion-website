import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'oticas_aion_products_v1';

// Script SQL pronto para o usuário criar a tabela no Supabase
export const SUPABASE_PRODUCTS_SQL = `-- Script para criar a tabela de produtos no Supabase (SQL Editor)
create table if not exists public.products (
  id text primary key,
  name text not null,
  material text not null,
  shape text not null,
  gender text not null,
  rim_type text not null,
  original_price numeric not null,
  current_price numeric not null,
  pix_discount_percent numeric default 5,
  rating numeric default 5.0,
  reviews_count integer default 10,
  is_bestseller boolean default false,
  is_promo boolean default false,
  images text[] not null,
  client_photos text[],
  colors jsonb not null,
  dimensions jsonb not null,
  specs jsonb not null,
  description text not null,
  included_items text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ativar segurança RLS
alter table public.products enable row level security;

-- Política para permitir que qualquer visitante veja os produtos
create policy "Produtos visíveis publicamente" 
on public.products for select 
using (true);

-- Política para permitir que usuários autenticados criem/atualizem/deletem produtos
create policy "Gerenciamento de produtos por usuários autenticados" 
on public.products for all 
using (auth.role() = 'authenticated');
`;

// Helper para converter produto do formato Supabase para o formato do Frontend
function mapSupabaseRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    material: row.material,
    shape: row.shape,
    gender: row.gender,
    rimType: row.rim_type || row.rimType || 'Aro Fechado',
    originalPrice: Number(row.original_price ?? row.originalPrice ?? 0),
    currentPrice: Number(row.current_price ?? row.currentPrice ?? 0),
    pixDiscountPercent: Number(row.pix_discount_percent ?? row.pixDiscountPercent ?? 5),
    rating: Number(row.rating ?? 5.0),
    reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? 1),
    isBestseller: Boolean(row.is_bestseller ?? row.isBestseller),
    isPromo: Boolean(row.is_promo ?? row.isPromo),
    images: Array.isArray(row.images) ? row.images : [],
    clientPhotos: Array.isArray(row.client_photos) ? row.client_photos : [],
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : (row.colors || []),
    dimensions: typeof row.dimensions === 'string' ? JSON.parse(row.dimensions) : (row.dimensions || {
      lensWidth: 52,
      lensHeight: 35,
      bridgeWidth: 18,
      totalFront: 135,
      templeLength: 140,
    }),
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || {
      materialFront: row.material,
      materialTemple: row.material,
      rimType: row.rim_type || 'Aro Fechado',
      nosePads: 'Sim (Silicone Anatômico)',
      springHinges: 'Sim (Flexível)',
      style: 'Contemporâneo',
    }),
    description: row.description || '',
    includedItems: Array.isArray(row.included_items) ? row.included_items : (row.includedItems || []),
  };
}

// Helper para converter produto do formato Frontend para o formato do Supabase
function mapProductToSupabaseRow(product: Product) {
  return {
    id: product.id,
    name: product.name,
    material: product.material,
    shape: product.shape,
    gender: product.gender,
    rim_type: product.rimType,
    original_price: product.originalPrice,
    current_price: product.currentPrice,
    pix_discount_percent: product.pixDiscountPercent,
    rating: product.rating,
    reviews_count: product.reviewsCount,
    is_bestseller: product.isBestseller ?? false,
    is_promo: product.isPromo ?? false,
    images: product.images,
    client_photos: product.clientPhotos || [],
    colors: product.colors,
    dimensions: product.dimensions,
    specs: product.specs,
    description: product.description,
    included_items: product.includedItems,
  };
}

// Carregar produtos locais como fallback
export function getLocalStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler produtos locais:', err);
  }
  return INITIAL_PRODUCTS;
}

// Salvar produtos no cache local
export function saveLocalStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn('Erro ao salvar produtos no localStorage:', err);
  }
}

// Carregar produtos com sincronização do Supabase
export async function fetchProducts(): Promise<{ products: Product[]; source: 'supabase' | 'local' }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map(mapSupabaseRowToProduct);
      saveLocalStoredProducts(mapped);
      return { products: mapped, source: 'supabase' };
    }
  } catch (err) {
    // Falha silenciosa do Supabase, usa cache local
  }

  return { products: getLocalStoredProducts(), source: 'local' };
}

// Salvar ou atualizar um produto (no Supabase e localmente)
export async function saveProduct(product: Product): Promise<{ success: boolean; savedInSupabase: boolean; error?: string }> {
  // 1. Atualiza no cache local imediatamente para feedback instantâneo
  const current = getLocalStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updatedList: Product[];

  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = product;
  } else {
    updatedList = [product, ...current];
  }
  saveLocalStoredProducts(updatedList);

  // 2. Tenta sincronizar com o Supabase
  let savedInSupabase = false;
  try {
    const row = mapProductToSupabaseRow(product);
    const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (!error) {
      savedInSupabase = true;
    } else {
      console.warn('Aviso ao sincronizar produto com Supabase:', error.message);
    }
  } catch (err: any) {
    console.warn('Aviso Supabase indisponível no momento:', err?.message);
  }

  return { success: true, savedInSupabase };
}

// Excluir um produto
export async function deleteProduct(productId: string): Promise<{ success: boolean; deletedInSupabase: boolean }> {
  // 1. Remove localmente
  const current = getLocalStoredProducts();
  const updatedList = current.filter((p) => p.id !== productId);
  saveLocalStoredProducts(updatedList);

  // 2. Remove do Supabase
  let deletedInSupabase = false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) {
      deletedInSupabase = true;
    }
  } catch (err) {
    console.warn('Erro ao remover produto do Supabase:', err);
  }

  return { success: true, deletedInSupabase };
}

// Restaurar para produtos de fábrica
export function resetProductsToDefaults(): Product[] {
  saveLocalStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

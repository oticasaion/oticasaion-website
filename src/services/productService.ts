import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';
import { requireAdmin } from '../lib/adminAccess';
import adminAccessSql from '../../docs/admin-access.sql?raw';

const LOCAL_STORAGE_KEY = 'oticas_aion_products_v2';

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
  lenses_enabled boolean not null default true,
  images text[] not null,
  client_photos text[],
  colors jsonb not null,
  dimensions jsonb not null,
  specs jsonb not null,
  description text not null,
  included_items text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);


` + adminAccessSql;

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
    lensesEnabled: row.lenses_enabled ?? row.lensesEnabled ?? true,
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

export interface AdminProductListItem {
  id: string;
  name: string;
  material: string;
  gender: Product['gender'];
  currentPrice: number;
  pixDiscountPercent: number;
  isPromo: boolean;
  isBestseller: boolean;
  lensesEnabled: boolean;
  image: string;
}

export interface AdminProductPage {
  items: AdminProductListItem[];
  total: number;
}

export interface AdminProductPageParams {
  page: number;
  pageSize: number;
  query: string;
  filter: string;
  sort: string;
}

export async function fetchAdminProductPage({ page, pageSize, query, filter, sort }: AdminProductPageParams): Promise<AdminProductPage> {
  await requireAdmin();
  const safePage = Math.max(1, Math.trunc(page));
  const safeSize = Math.min(50, Math.max(1, Math.trunc(pageSize)));
  let request = supabase.from('products')
    .select('id,name,material,gender,current_price,pix_discount_percent,is_promo,is_bestseller,lenses_enabled,images', { count: 'exact' });
  const term = query.trim().replace(/[^\p{L}\p{N} -]/gu, '').slice(0, 80);
  if (term) request = request.or(`name.ilike.%${term}%,id.ilike.%${term}%,material.ilike.%${term}%`);
  if (filter === 'promocoes') request = request.eq('is_promo', true);
  else if (filter === 'destaques') request = request.eq('is_bestseller', true);
  else if (['feminino', 'masculino', 'unissex'].includes(filter)) request = request.eq('gender', filter);
  if (sort === 'price') request = request.order('current_price', { ascending: true }).order('id');
  else if (sort === 'name') request = request.order('name', { ascending: true }).order('id');
  else request = request.order('created_at', { ascending: false }).order('id');
  const start = (safePage - 1) * safeSize;
  const { data, count, error } = await request.range(start, start + safeSize - 1);
  if (error) throw new Error(error.message);
  return { total: count ?? 0, items: (data || []).map(row => ({
    id: row.id, name: row.name, material: row.material, gender: row.gender,
    currentPrice: Number(row.current_price || 0), pixDiscountPercent: Number(row.pix_discount_percent || 0),
    isPromo: !!row.is_promo, isBestseller: !!row.is_bestseller,
    lensesEnabled: row.lenses_enabled !== false,
    image: Array.isArray(row.images) ? row.images[0] || '' : '',
  })) };
}

export async function fetchAdminProductById(id: string): Promise<Product> {
  await requireAdmin();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error || !data) throw new Error('Não foi possível carregar esta armação.');
  return mapSupabaseRowToProduct(data);
}

export async function fetchAllAdminProducts(): Promise<Product[]> {
  await requireAdmin();
  const result: Product[] = [];
  for (let start = 0; ; start += 200) {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }).range(start, start + 199);
    if (error) throw new Error(error.message);
    result.push(...(data || []).map(mapSupabaseRowToProduct));
    if (!data || data.length < 200) break;
  }
  return result;
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
    lenses_enabled: product.lensesEnabled !== false,
    images: product.images,
    client_photos: product.clientPhotos || [],
    colors: product.colors,
    dimensions: product.dimensions,
    specs: product.specs,
    description: product.description,
    included_items: product.includedItems,
  };
}

export async function updateProductLenses(id: string, enabled: boolean): Promise<void> {
  await requireAdmin();
  const { data, error } = await supabase.from('products').update({ lenses_enabled: enabled }).eq('id', id).select('id').single();
  if (error || !data) throw new Error(error?.message || 'Não foi possível atualizar esta armação.');
  saveLocalStoredProducts(getLocalStoredProducts().map(product => product.id === id ? { ...product, lensesEnabled: enabled } : product));
}

export async function updateAllProductsLenses(enabled: boolean): Promise<number> {
  await requireAdmin();
  const { data, error, count } = await supabase.from('products').update({ lenses_enabled: enabled }, { count: 'exact' }).neq('id', '').select('id');
  if (error) throw new Error(error.message);
  saveLocalStoredProducts(getLocalStoredProducts().map(product => ({ ...product, lensesEnabled: enabled })));
  return count ?? data?.length ?? 0;
}

// Carregar produtos locais como fallback
export function getLocalStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const hasLegacyImages = parsed.some((p: any) =>
          Array.isArray(p.images) && p.images.some((img: string) => typeof img === 'string' && img.includes('unsplash.com'))
        );
        if (!hasLegacyImages) {
          return parsed;
        }
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

    if (!error && data) {
      const mapped = data.map(mapSupabaseRowToProduct);
      saveLocalStoredProducts(mapped);
      return { products: mapped, source: 'supabase' };
    }
  } catch (err) {
    // Falha silenciosa do Supabase, usa cache local
  }

  return { products: getLocalStoredProducts(), source: 'local' };
}

// Commit remotely before updating the local cache.
export async function saveProduct(product: Product): Promise<{ success: boolean; savedInSupabase: boolean; error?: string }> {
  try {
    await requireAdmin();
    const { data, error } = await supabase.from('products')
      .upsert(mapProductToSupabaseRow(product), { onConflict: 'id' }).select('id').single();
    if (error || !data) throw new Error('Não foi possível salvar na loja. Verifique sua conexão e permissão e tente novamente.');
    const current = getLocalStoredProducts();
    saveLocalStoredProducts(current.some(p => p.id === product.id)
      ? current.map(p => p.id === product.id ? product : p) : [product, ...current]);
    return { success: true, savedInSupabase: true };
  } catch (error) {
    return { success: false, savedInSupabase: false, error: error instanceof Error ? error.message : 'Falha ao salvar produto.' };
  }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; deletedInSupabase: boolean; error?: string }> {
  try {
    await requireAdmin();
    const { data, error } = await supabase.from('products').delete().eq('id', productId).select('id');
    if (error || !data?.length) throw new Error('Não foi possível excluir da loja. Verifique sua conexão e permissão e tente novamente.');
    saveLocalStoredProducts(getLocalStoredProducts().filter(p => p.id !== productId));
    return { success: true, deletedInSupabase: true };
  } catch (error) {
    return { success: false, deletedInSupabase: false, error: error instanceof Error ? error.message : 'Falha ao excluir produto.' };
  }
}

// Legacy local reset, retained for compatibility; not exposed in the active panel.
export function resetProductsToDefaults(): Product[] {
  saveLocalStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

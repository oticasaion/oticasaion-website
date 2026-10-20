import { supabase } from '../lib/supabase';
import { requireAdmin } from '../lib/adminAccess';

export interface HomeSettings {
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroButtonText: string;
  catalogTitle: string;
  catalogSubtitle: string;
}

export const defaultHomeSettings: HomeSettings = {
  announcement: '',
  heroTitle: 'A beleza de enxergar com nitidez e a alegria de viver cada conexão.',
  heroSubtitle: 'Escolha sua armação, consulte as opções de lentes e converse com a Óticas Aion pelo WhatsApp.',
  heroImageUrl: './branding/hero-conexao-aion.webp',
  heroImageAlt: 'Pessoas usando óculos da Óticas Aion',
  heroButtonText: 'Escolher minha armação',
  catalogTitle: 'Óculos de grau completo',
  catalogSubtitle: 'Selecione um modelo para ver fotos, medidas e opções de lentes.',
};

export function normalizeHomeSettings(value: unknown): HomeSettings {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return Object.fromEntries(Object.entries(defaultHomeSettings).map(([key, fallback]) => {
    const raw = source[key];
    return [key, typeof raw === 'string' ? raw.slice(0, 500).trim() : fallback];
  })) as unknown as HomeSettings;
}

export function validHomeImageUrl(value: string): boolean {
  if (value.startsWith('./branding/')) return !value.includes('..', 2);
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

export async function fetchHomeSettings(): Promise<HomeSettings> {
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'home').maybeSingle();
  if (error) throw new Error(error.message);
  return normalizeHomeSettings(data?.value);
}

export async function saveHomeSettings(value: HomeSettings): Promise<HomeSettings> {
  await requireAdmin();
  const normalized = normalizeHomeSettings(value);
  if (!normalized.heroTitle || !normalized.heroSubtitle || !normalized.heroButtonText || !normalized.catalogTitle) {
    throw new Error('Preencha os títulos, o texto do banner e o botão principal.');
  }
  if (!validHomeImageUrl(normalized.heroImageUrl)) throw new Error('Use um endereço HTTPS público para a imagem.');
  const { error } = await supabase.from('site_settings').upsert({ key: 'home', value: normalized }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  return normalized;
}

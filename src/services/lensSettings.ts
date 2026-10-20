import type { LensOption } from '../types';
import { LENS_OPTIONS } from '../data/lenses';
import { supabase } from '../lib/supabase';
import { requireAdmin } from '../lib/adminAccess';

const text = (value: unknown, fallback: string, limit = 500) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : fallback;

export function normalizeLensOptions(value: unknown): LensOption[] {
  const source = value && typeof value === 'object' ? value as { options?: unknown } : {};
  const rows = Array.isArray(source.options) ? source.options : [];
  return LENS_OPTIONS.map(defaultOption => {
    const saved = rows.find(row => row && typeof row === 'object' && row.id === defaultOption.id) as Partial<LensOption> | undefined;
    if (!saved) return { ...defaultOption, features: [...defaultOption.features] };
    const price = Number(saved.price);
    return {
      ...defaultOption,
      name: text(saved.name, defaultOption.name, 100),
      description: text(saved.description, defaultOption.description),
      subtitle: text(saved.subtitle, defaultOption.subtitle, 150),
      material: text(saved.material, defaultOption.material, 150),
      recommendedDegrees: text(saved.recommendedDegrees, defaultOption.recommendedDegrees, 200),
      thicknessBadge: text(saved.thicknessBadge, defaultOption.thicknessBadge, 80),
      features: Array.isArray(saved.features)
        ? saved.features.filter((item): item is string => typeof item === 'string').slice(0, 6).map(item => item.trim().slice(0, 150))
        : [...defaultOption.features],
      price: Number.isFinite(price) && price >= 0 && price <= 100000 ? Math.round(price * 100) / 100 : defaultOption.price,
    };
  });
}

export async function fetchLensOptions(): Promise<LensOption[]> {
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'lenses').maybeSingle();
  if (error) throw new Error(error.message);
  return normalizeLensOptions(data?.value);
}

export async function saveLensOptions(options: LensOption[]): Promise<LensOption[]> {
  await requireAdmin();
  if (options.length !== LENS_OPTIONS.length || LENS_OPTIONS.some(defaultOption => !options.some(option => option.id === defaultOption.id))) {
    throw new Error('A lista de lentes está incompleta. Recarregue a página e tente novamente.');
  }
  const normalized = normalizeLensOptions({ options });
  if (normalized.some(option => !option.name || !option.description || !option.subtitle || !option.material || !option.recommendedDegrees || !option.thicknessBadge || !option.features.length || option.features.some(feature => !feature))) {
    throw new Error('Preencha nome, descrição, material, indicação e características de todas as lentes.');
  }
  if (options.some(option => !Number.isFinite(Number(option.price)) || Number(option.price) < 0 || Number(option.price) > 100000)) {
    throw new Error('Informe um valor válido entre R$ 0 e R$ 100.000 para cada lente.');
  }
  const { error } = await supabase.from('site_settings').upsert({ key: 'lenses', value: { options: normalized } }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  return normalized;
}

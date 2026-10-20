import { supabase } from '../lib/supabase';
import { requireAdmin } from '../lib/adminAccess';

export interface AdminMetrics {
  total: number;
  withoutPhoto: number;
  promotions: number;
  featured: number;
  addedLast30Days: number;
  averagePrice: number | null;
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  await requireAdmin();
  const { data, error } = await supabase.rpc('catalog_dashboard_metrics');
  if (error || !data || typeof data !== 'object') throw new Error(error?.message || 'Não foi possível carregar os indicadores.');
  const value = data as Record<string, unknown>;
  return {
    total: Number(value.total || 0), withoutPhoto: Number(value.without_photo || 0),
    promotions: Number(value.promotions || 0), featured: Number(value.featured || 0),
    addedLast30Days: Number(value.added_last_30_days || 0),
    averagePrice: value.average_price == null ? null : Number(value.average_price),
  };
}

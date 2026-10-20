import React, { useEffect, useState } from 'react';
import type { LensOption } from '../../types';
import { fetchLensOptions, saveLensOptions } from '../../services/lensSettings';
import { currency } from '../../lib/productPresentation';
import { FloppyDisk } from '@phosphor-icons/react';

export const AdminLensSettingsView: React.FC = () => {
  const [options, setOptions] = useState<LensOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetchLensOptions().then(value => { if (active) setOptions(value); })
      .catch(() => { if (active) setError('Não foi possível carregar as lentes. Confira as configurações do banco de dados.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const update = (id: string, patch: Partial<LensOption>) => {
    setOptions(current => current.map(option => option.id === id ? { ...option, ...patch } : option));
    setMessage('');
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const saved = await saveLensOptions(options);
      setOptions(saved);
      setMessage('Lentes atualizadas. Os preços e textos já estão disponíveis na loja.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar as lentes.'); }
    finally { setSaving(false); }
  };

  return <div className="max-w-5xl mx-auto p-5 sm:p-8 lg:p-10 space-y-6">
    <header><p className="admin-eyebrow">Catálogo</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Lentes</h1><p className="text-sm text-stone-600 mt-3">Edite preços e descrições. Essas opções aparecem apenas nas armações com lentes ativadas. <a className="underline" href="#/admin/produtos">Escolher modelos no catálogo</a>.</p></header>
    {loading ? <p role="status">Carregando lentes…</p> : <form onSubmit={save} className="space-y-5">
      {options.map(option => <section key={option.id} className="admin-card p-5 sm:p-6 space-y-4" aria-label={option.name}>
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{option.name}</h2><span className="text-sm font-bold text-[#18392d]">{option.price === 0 ? 'Sem adicional' : `+ ${currency(option.price)}`}</span></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className="block text-sm font-semibold mb-1.5">Nome</span><input required maxLength={100} className="admin-input w-full" value={option.name} onChange={event => update(option.id, { name: event.target.value })} /></label>
          <label className="block"><span className="block text-sm font-semibold mb-1.5">Adicional (R$)</span><input required type="number" min="0" max="100000" step="0.01" className="admin-input w-full" value={option.price} onChange={event => update(option.id, { price: event.target.value === '' ? NaN : Number(event.target.value) })} /></label>
          <label className="block"><span className="block text-sm font-semibold mb-1.5">Subtítulo / índice</span><input required maxLength={150} className="admin-input w-full" value={option.subtitle} onChange={event => update(option.id, { subtitle: event.target.value })} /></label>
          <label className="block"><span className="block text-sm font-semibold mb-1.5">Selo</span><input required maxLength={80} className="admin-input w-full" value={option.thicknessBadge} onChange={event => update(option.id, { thicknessBadge: event.target.value })} /></label>
          <label className="block"><span className="block text-sm font-semibold mb-1.5">Material</span><input required maxLength={150} className="admin-input w-full" value={option.material} onChange={event => update(option.id, { material: event.target.value })} /></label>
          <label className="block"><span className="block text-sm font-semibold mb-1.5">Indicação de grau</span><input required maxLength={200} className="admin-input w-full" value={option.recommendedDegrees} onChange={event => update(option.id, { recommendedDegrees: event.target.value })} /></label>
        </div>
        <label className="block"><span className="block text-sm font-semibold mb-1.5">Descrição</span><textarea required maxLength={500} rows={2} className="admin-input w-full" value={option.description} onChange={event => update(option.id, { description: event.target.value })} /></label>
        <label className="block"><span className="block text-sm font-semibold mb-1.5">Características</span><textarea required rows={4} className="admin-input w-full" value={option.features.join('\n')} onChange={event => update(option.id, { features: event.target.value.split('\n').slice(0, 6) })} /><span className="block text-xs text-stone-500 mt-1">Uma característica por linha, até seis.</span></label>
      </section>)}
      {error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-4 text-sm">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-emerald-50 text-emerald-900 p-4 text-sm">{message}</p>}
      <button disabled={saving || !options.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173629] px-6 py-3 text-white font-semibold hover:bg-[#285540] disabled:opacity-50"><FloppyDisk size={20} />{saving ? 'Salvando…' : 'Salvar lentes'}</button>
    </form>}
  </div>;
};

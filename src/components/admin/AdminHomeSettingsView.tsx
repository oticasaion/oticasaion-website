import React, { useEffect, useState } from 'react';
import { ArrowSquareOut, FloppyDisk } from '@phosphor-icons/react';
import { defaultHomeSettings, fetchHomeSettings, saveHomeSettings, validHomeImageUrl, type HomeSettings } from '../../services/homeSettings';

interface Props {
  onSaved: (settings: HomeSettings) => void;
}

const fields: { key: keyof HomeSettings; label: string; help?: string; multiline?: boolean }[] = [
  { key: 'announcement', label: 'Aviso no topo', help: 'Deixe vazio para ocultar. Publique apenas promoções e prazos confirmados.' },
  { key: 'heroTitle', label: 'Título principal' },
  { key: 'heroSubtitle', label: 'Texto do banner', multiline: true },
  { key: 'heroImageUrl', label: 'Link público da imagem', help: 'Use uma imagem HTTPS, como a URL pública do Supabase Storage.' },
  { key: 'heroImageAlt', label: 'Descrição da imagem', help: 'Descreva o que aparece na foto para acessibilidade.' },
  { key: 'heroButtonText', label: 'Texto do botão do banner' },
  { key: 'catalogTitle', label: 'Título do catálogo na home' },
  { key: 'catalogSubtitle', label: 'Texto de apoio do catálogo', multiline: true },
];

export const AdminHomeSettingsView: React.FC<Props> = ({ onSaved }) => {
  const [draft, setDraft] = useState<HomeSettings>(defaultHomeSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchHomeSettings().then(settings => { if (active) setDraft(settings); })
      .catch(() => { if (active) setError('Não foi possível carregar as configurações. Verifique se a tabela site_settings foi criada no Supabase.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const update = (key: keyof HomeSettings, value: string) => {
    setDraft(current => ({ ...current, [key]: value }));
    setMessage('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); setMessage(''); setSaving(true);
    try {
      const saved = await saveHomeSettings(draft);
      setDraft(saved);
      onSaved(saved);
      setMessage('Página inicial atualizada. As alterações já estão disponíveis no site.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar as alterações.');
    } finally { setSaving(false); }
  };

  return <div className="max-w-6xl mx-auto p-5 sm:p-8 lg:p-10 space-y-7">
    <header><p className="admin-eyebrow">Aparência da loja</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Página inicial</h1><p className="text-sm text-stone-500 mt-3">Edite os textos e a imagem mostrados aos visitantes. Revise a prévia antes de publicar.</p></header>
    {loading ? <p role="status">Carregando configurações…</p> : <div className="grid lg:grid-cols-2 gap-6 items-start">
      <form onSubmit={submit} className="admin-card p-5 sm:p-6 space-y-5">
        {fields.map(field => <label key={field.key} className="block"><span className="block text-sm font-semibold mb-1.5">{field.label}</span>
          {field.multiline ? <textarea className="admin-input w-full min-h-24" maxLength={500} value={draft[field.key]} onChange={event => update(field.key, event.target.value)} />
            : <input className="admin-input w-full" maxLength={500} value={draft[field.key]} onChange={event => update(field.key, event.target.value)} />}
          {field.help && <span className="block text-xs text-stone-500 mt-1">{field.help}</span>}
        </label>)}
        {error && <p role="alert" className="text-sm text-red-800 bg-red-50 rounded-xl p-3">{error}</p>}
        {message && <p role="status" className="text-sm text-green-800 bg-green-50 rounded-xl p-3">{message}</p>}
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-[#0c251d] hover:bg-[#194132] text-white font-semibold px-5 py-3 rounded-xl disabled:opacity-60"><FloppyDisk size={19} />{saving ? 'Publicando…' : 'Publicar alterações'}</button>
      </form>
      <div className="admin-card overflow-hidden lg:sticky lg:top-6"><div className="p-4 border-b border-stone-200 flex items-center justify-between"><h2 className="font-semibold">Prévia</h2><a href="#/" className="text-sm underline inline-flex gap-1 items-center">Ver site <ArrowSquareOut size={16} /></a></div>
        {draft.announcement && <p className="bg-[#081a14] text-[#e7d7b5] text-xs text-center p-2">{draft.announcement}</p>}
        <div className="bg-[#0c251d] text-white p-5 space-y-4">
          {validHomeImageUrl(draft.heroImageUrl) && <img src={draft.heroImageUrl} alt={draft.heroImageAlt} className="w-full h-44 object-cover rounded-xl" />}
          <h3 className="text-2xl font-bold leading-tight">{draft.heroTitle || 'Título principal'}</h3><p className="text-sm text-stone-300">{draft.heroSubtitle}</p><span className="inline-block bg-[#c8a25a] text-[#071d16] font-semibold text-sm px-4 py-2 rounded-xl">{draft.heroButtonText || 'Botão'}</span>
        </div><div className="p-5"><h3 className="text-xl font-semibold">{draft.catalogTitle || 'Título do catálogo'}</h3><p className="text-sm text-stone-500 mt-2">{draft.catalogSubtitle}</p></div>
      </div>
    </div>}
  </div>;
};

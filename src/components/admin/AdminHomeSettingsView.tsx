import React, { useEffect, useRef, useState } from 'react';
import { ArrowSquareOut, FloppyDisk, UploadSimple } from '@phosphor-icons/react';
import { defaultHomeSettings, fetchHomeSettings, saveHomeSettings, uploadHomeImage, validHomeImageUrl, type HomeSettings } from '../../services/homeSettings';
import { prepareImage, validateImageFile } from '../../services/productImages';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageInfo, setImageInfo] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [preparingImage, setPreparingImage] = useState(false);
  const previewRef = useRef('');

  useEffect(() => {
    let active = true;
    fetchHomeSettings().then(settings => { if (active) setDraft(settings); })
      .catch(() => { if (active) setError('Não foi possível carregar as configurações. Verifique se a tabela site_settings foi criada no Supabase.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);

  const chooseImage = async (file?: File) => {
    if (!file) return;
    setError(''); setMessage('');
    const invalid = validateImageFile(file);
    if (invalid) { setError(invalid); return; }
    setPreparingImage(true);
    try {
      const optimized = await prepareImage(file);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const preview = URL.createObjectURL(optimized);
      previewRef.current = preview;
      setImagePreview(preview);
      setImageFile(optimized);
      setUploadedImageUrl('');
      setImageInfo(`${Math.round(file.size / 1024)} KB → ${Math.round(optimized.size / 1024)} KB em WebP`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível preparar a imagem.'); }
    finally { setPreparingImage(false); }
  };

  const update = (key: keyof HomeSettings, value: string) => {
    setDraft(current => ({ ...current, [key]: value }));
    setMessage('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); setMessage(''); setSaving(true);
    try {
      if (!draft.heroTitle.trim() || !draft.heroSubtitle.trim() || !draft.heroButtonText.trim() || !draft.catalogTitle.trim()) {
        throw new Error('Preencha os títulos, o texto do banner e o botão principal.');
      }
      if (!imageFile && !validHomeImageUrl(draft.heroImageUrl)) throw new Error('Use uma imagem enviada ou um endereço HTTPS público.');
      const next = { ...draft };
      if (imageFile) {
        next.heroImageUrl = uploadedImageUrl || (await uploadHomeImage(imageFile)).url;
        setUploadedImageUrl(next.heroImageUrl);
      }
      const saved = await saveHomeSettings(next);
      setDraft(saved);
      onSaved(saved);
      setImageFile(null); setImageInfo(''); setImagePreview(''); setUploadedImageUrl('');
      if (previewRef.current) { URL.revokeObjectURL(previewRef.current); previewRef.current = ''; }
      setMessage('Página inicial atualizada. As alterações já estão disponíveis no site.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar as alterações.');
    } finally { setSaving(false); }
  };

  return <div className="max-w-6xl mx-auto p-5 sm:p-8 lg:p-10 space-y-7">
    <header><p className="admin-eyebrow">Aparência da loja</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Página inicial</h1><p className="text-sm text-stone-500 mt-3">Edite os textos e a imagem mostrados aos visitantes. Revise a prévia antes de publicar.</p></header>
    {loading ? <p role="status">Carregando configurações…</p> : <div className="grid lg:grid-cols-2 gap-6 items-start">
      <form onSubmit={submit} className="admin-card p-5 sm:p-6 space-y-5">
        <label className="block rounded-xl border border-dashed border-[#a6b8a6] bg-[#f6f9f5] p-4 cursor-pointer"><span className="flex items-center gap-2 text-sm font-semibold"><UploadSimple size={20} /> Importar imagem do banner</span><span className="block text-xs text-stone-500 mt-1">JPG, PNG ou WebP até 8 MB. A imagem será convertida para WebP antes de publicar.</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={saving || preparingImage} onChange={event => { void chooseImage(event.target.files?.[0]); event.target.value = ''; }} className="block w-full text-xs mt-3" />{preparingImage && <span role="status" className="block text-xs mt-2">Otimizando imagem…</span>}{imageInfo && <span className="block text-xs text-[#1d4935] mt-2">Pronta para publicar · {imageInfo}</span>}</label>
        {fields.map(field => <label key={field.key} className="block"><span className="block text-sm font-semibold mb-1.5">{field.label}</span>
          {field.multiline ? <textarea className="admin-input w-full min-h-24" maxLength={500} value={draft[field.key]} onChange={event => update(field.key, event.target.value)} />
            : <input className="admin-input w-full" maxLength={500} value={draft[field.key]} onChange={event => update(field.key, event.target.value)} />}
          {field.help && <span className="block text-xs text-stone-500 mt-1">{field.help}</span>}
        </label>)}
        {error && <p role="alert" className="text-sm text-red-800 bg-red-50 rounded-xl p-3">{error}</p>}
        {message && <p role="status" className="text-sm text-green-800 bg-green-50 rounded-xl p-3">{message}</p>}
        <button type="submit" disabled={saving || preparingImage} className="inline-flex items-center justify-center gap-2 bg-[#0c251d] hover:bg-[#194132] text-white font-semibold px-5 py-3 rounded-xl disabled:opacity-60"><FloppyDisk size={19} />{saving ? 'Publicando…' : 'Publicar alterações'}</button>
      </form>
      <div className="admin-card overflow-hidden lg:sticky lg:top-6"><div className="p-4 border-b border-stone-200 flex items-center justify-between"><h2 className="font-semibold">Prévia</h2><a href="#/" className="text-sm underline inline-flex gap-1 items-center">Ver site <ArrowSquareOut size={16} /></a></div>
        {draft.announcement && <p className="bg-[#081a14] text-[#e7d7b5] text-xs text-center p-2">{draft.announcement}</p>}
        <div className="bg-[#0c251d] text-white p-5 space-y-4">
          {(imagePreview || validHomeImageUrl(draft.heroImageUrl)) && <img src={imagePreview || draft.heroImageUrl} alt={draft.heroImageAlt} className="w-full h-44 object-cover rounded-xl" />}
          <h3 className="text-2xl font-bold leading-tight">{draft.heroTitle || 'Título principal'}</h3><p className="text-sm text-stone-300">{draft.heroSubtitle}</p><span className="inline-block bg-[#c8a25a] text-[#071d16] font-semibold text-sm px-4 py-2 rounded-xl">{draft.heroButtonText || 'Botão'}</span>
        </div><div className="p-5"><h3 className="text-xl font-semibold">{draft.catalogTitle || 'Título do catálogo'}</h3><p className="text-sm text-stone-500 mt-2">{draft.catalogSubtitle}</p></div>
      </div>
    </div>}
  </div>;
};

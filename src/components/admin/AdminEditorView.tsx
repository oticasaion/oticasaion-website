import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Product } from '../../types';
import { blankProductDraft, buildDraftProduct, draftFromProduct, getProductIssues, validateProductDraft, type ProductDraft } from '../../lib/productDraft';
import { prepareImage, removeUnpublishedImages, uploadProductImage, validateImageFile } from '../../services/productImages';
import { saveProduct } from '../../services/productService';
import { AdminProductPreview } from './AdminProductPreview';
import { ArrowLeft, ArrowRight, FloppyDisk, ImageSquare, Plus, Trash, UploadSimple } from '@phosphor-icons/react';

interface Props {
  productToEdit: Product | null;
  onBackToCatalog: () => void;
  onSaveSuccess: (product: Product) => void;
}
interface Photo { id: string; src: string; name: string; file?: File; originalSize?: number }
type StringKey = { [K in keyof ProductDraft]: ProductDraft[K] extends string ? K : never }[keyof ProductDraft];

export const AdminEditorView: React.FC<Props> = ({ productToEdit, onBackToCatalog, onSaveSuccess }) => {
  const [draft, setDraft] = useState<ProductDraft>(() => productToEdit ? draftFromProduct(productToEdit) : blankProductDraft());
  const [photos, setPhotos] = useState<Photo[]>(() => (productToEdit?.images || []).map((src, index) => ({ id: 'existing-' + index, src, name: 'Foto ' + (index + 1) })));
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const urls = useRef(new Set<string>());
  const mounted = useRef(true);
  const input = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const busy = saving || importing;
  const toolbarRef = useRef<HTMLElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(220);
  const [validatedSteps, setValidatedSteps] = useState<number[]>([]);
  const issues = getProductIssues(draft, photos.length).filter(issue => validatedSteps.includes(issue.step));
  const originalBytes = photos.reduce((sum, photo) => sum + (photo.originalSize || 0), 0);
  const optimizedBytes = photos.reduce((sum, photo) => sum + (photo.file?.size || 0), 0);
  const formatBytes = (bytes: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(bytes / 1024) + ' KB';
  useLayoutEffect(() => {
    const element = toolbarRef.current;
    if (!element) return;
    const measure = () => setToolbarHeight(element.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const focusErrors = () => requestAnimationFrame(() => errorRef.current?.focus({ preventScroll: true }));
  const changeStep = (target: number) => {
    if (busy) return;
    if (target > step) {
      const checked = Array.from({ length: target - 1 }, (_, index) => index + 1);
      setValidatedSteps(current => [...new Set([...current, ...checked])]);
      const issue = getProductIssues(draft, photos.length).find(item => item.step < target);
      if (issue) { setStep(issue.step); focusErrors(); return; }
    }
    setStep(target);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    mounted.current = true;
    const objectUrls = urls.current;
    return () => { mounted.current = false; objectUrls.forEach(url => URL.revokeObjectURL(url)); objectUrls.clear(); };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    const guard = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a[href]');
      if (!anchor || anchor.getAttribute('href') === window.location.hash) return;
      if (busy || (dirty && !window.confirm('Sair sem salvar este produto? As alterações e fotos selecionadas serão descartadas.'))) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener('click', guard, true);
    return () => document.removeEventListener('click', guard, true);
  }, [dirty, busy]);
  useEffect(() => { if (error) errorRef.current?.focus({ preventScroll: true }); }, [error]);

  const update = (key: StringKey, value: string) => { setDraft(current => ({ ...current, [key]: value })); setDirty(true); };
  const back = () => { if (!dirty || window.confirm('Sair sem salvar este produto? As alterações e fotos selecionadas serão descartadas.')) onBackToCatalog(); };
  const importFiles = async (files: File[]) => {
    if (busy || !files.length) return;
    setError('');
    if (photos.length + files.length > 8) { setError('Você pode adicionar até 8 fotos. Remova uma foto antes de importar outras.'); return; }
    for (const file of files) { const invalid = validateImageFile(file); if (invalid) { setError(file.name + ': ' + invalid); return; } }
    setImporting(true);
    const prepared: Photo[] = [];
    try {
      for (const file of files) {
        setProgress('Otimizando foto ' + (prepared.length + 1) + ' de ' + files.length + ' no navegador…');
        const image = await prepareImage(file);
        if (!mounted.current) return;
        const src = URL.createObjectURL(image);
        urls.current.add(src);
        prepared.push({ id: crypto.randomUUID(), src, name: file.name, file: image, originalSize: file.size });
      }
      setPhotos(current => [...current, ...prepared]);
      setDirty(true);
    } catch {
      prepared.forEach(photo => { URL.revokeObjectURL(photo.src); urls.current.delete(photo.src); });
      if (mounted.current) setError('Não foi possível otimizar a foto. Verifique se o arquivo é uma imagem válida e se o navegador está atualizado.');
    } finally {
      if (mounted.current) { setImporting(false); setProgress(''); }
    }
  };
  const remove = (photo: Photo) => {
    setPhotos(current => current.filter(item => item.id !== photo.id));
    if (photo.file) { URL.revokeObjectURL(photo.src); urls.current.delete(photo.src); }
    setDirty(true);
  };
  const preview = buildDraftProduct(draft, photos.map(p => p.src), productToEdit?.id || 'preview', productToEdit);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setValidatedSteps([1, 2, 3]);
    const validation = validateProductDraft(draft, photos.length);
    if (validation) { setStep(validation.step); focusErrors(); return; }
    setError('');
    setSaving(true);
    const id = productToEdit?.id || 'aion-' + crypto.randomUUID();
    const uploaded: string[] = [];
    let committed = false;
    try {
      const images: string[] = [];
      for (let index = 0; index < photos.length; index++) {
        const photo = photos[index];
        if (photo.file) {
          setProgress('Enviando foto ' + (index + 1) + ' de ' + photos.length + '…');
          const result = await uploadProductImage(photo.file, id);
          uploaded.push(result.path);
          images.push(result.url);
        } else images.push(photo.src);
      }
      setProgress('Salvando produto…');
      const product = buildDraftProduct(draft, images, id, productToEdit);
      const result = await saveProduct(product);
      if (!result.success) throw new Error(result.error || 'Não foi possível salvar.');
      committed = true;
      setDirty(false);
      onSaveSuccess(product);
    } catch (err) {
      if (!committed) {
        try { await removeUnpublishedImages(uploaded); } catch { /* Keep original error; cleanup may be retried in Storage. */ }
      }
      setError(err instanceof Error ? err.message : 'Não foi possível salvar. As informações foram mantidas nesta tela.');
    } finally { setSaving(false); setProgress(''); }
  };

  const help: Partial<Record<StringKey, string>> = {
    name: 'Use o nome e o código que identificam este modelo no seu catálogo.',
    material: 'Informe o material da parte frontal da armação.',
    shape: 'Escolha o formato predominante da armação.',
    gender: 'Defina em qual filtro de público o produto aparecerá.',
    rimType: 'Indique se o aro envolve toda a lente, parte dela ou se o modelo não tem aro.',
    description: 'Descreva o acabamento, o conforto e os diferenciais reais do modelo.',
    lensWidth: 'Largura horizontal de uma lente, em milímetros.',
    lensHeight: 'Altura de uma lente, em milímetros.',
    bridgeWidth: 'Distância da ponte entre as lentes, em milímetros.',
    totalFront: 'Largura total da frente da armação, em milímetros.',
    templeLength: 'Comprimento de uma haste, em milímetros.',
    currentPrice: 'Preço de venda da armação antes do desconto Pix.',
    originalPrice: 'Preencha apenas se existir um preço anterior. Caso contrário, deixe vazio.',
    pixDiscount: 'Percentual entre 0 e 100. Deixe vazio para não aplicar desconto.',
  };
  const fieldIssue = (key: StringKey) => issues.find(issue => issue.field === key);
  const descriptionIds = (key: StringKey) => [help[key] ? 'product-' + key + '-help' : '', fieldIssue(key) ? 'product-' + key + '-error' : ''].filter(Boolean).join(' ') || undefined;
  const hint = (key: StringKey) => <>{help[key] && <p id={'product-' + key + '-help'} className="text-xs text-stone-500 mt-2 leading-relaxed">{help[key]}</p>}{fieldIssue(key) && <p id={'product-' + key + '-error'} className="text-xs text-red-700 mt-2">{fieldIssue(key)!.message}</p>}</>;
  const badge = (optional: boolean) => <span className={'ml-2 text-[10px] font-normal ' + (optional ? 'text-stone-400' : 'text-[#55704d]')}>{optional ? 'Opcional' : 'Obrigatório'}</span>;
  const field = (label: string, key: StringKey, type = 'text', optional = false) => <div key={key}><label htmlFor={'product-' + key} className="block text-sm font-medium mb-2">{label}{badge(optional)}</label><input id={'product-' + key} name={key} required={!optional} aria-invalid={!!fieldIssue(key)} aria-describedby={descriptionIds(key)} type={type} value={draft[key]} onChange={e => update(key, e.target.value)} className="admin-input" {...(type === 'number' ? { min: 0, step: 'any', inputMode: 'decimal' as const } : {})} />{hint(key)}</div>;
  const select = (label: string, key: StringKey, options: string[][], optional = false) => <div><label htmlFor={'product-' + key} className="block text-sm font-medium mb-2">{label}{badge(optional)}</label><select id={'product-' + key} name={key} required={!optional} aria-invalid={!!fieldIssue(key)} aria-describedby={descriptionIds(key)} value={draft[key]} onChange={e => update(key, e.target.value)} className="admin-input"><option value="">Selecione…</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>{hint(key)}</div>;
  const textarea = (label: string, key: StringKey, optional = false) => <div><label htmlFor={'product-' + key} className="block text-sm font-medium mb-2">{label}{badge(optional)}</label><textarea id={'product-' + key} name={key} required={!optional} aria-invalid={!!fieldIssue(key)} aria-describedby={descriptionIds(key)} rows={4} value={draft[key]} onChange={e => update(key, e.target.value)} className="admin-input resize-y" />{hint(key)}</div>;

  return <div className="admin-editor" style={{ paddingTop: toolbarHeight, '--editor-toolbar-height': toolbarHeight + 'px' } as React.CSSProperties}>
    <header ref={toolbarRef} className="fixed top-0 left-0 right-0 lg:left-64 z-[55] bg-white shadow-sm border-b border-stone-200">
      <div className="px-4 sm:px-8 pt-3 pb-3 flex items-center justify-between gap-3">
        <div className="min-w-0"><button type="button" onClick={back} disabled={busy} className="text-xs text-stone-500 inline-flex items-center gap-1 mb-1"><ArrowLeft size={14} /> Catálogo</button><h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">{productToEdit ? 'Editar produto' : 'Criar novo produto'}</h1></div>
        <div className="flex items-center gap-2">
          {step > 1 && <button type="button" disabled={busy} onClick={() => changeStep(step - 1)} className="admin-icon" aria-label="Voltar à etapa anterior"><ArrowLeft size={19} /></button>}
          {step < 3 ? <button type="button" disabled={busy} onClick={() => changeStep(step + 1)} className="admin-primary disabled:opacity-50">Próximo <ArrowRight size={17} /></button> : <button type="submit" form="product-editor-form" disabled={busy} className="admin-primary disabled:opacity-50"><FloppyDisk size={18} />{saving ? 'Salvando…' : 'Salvar produto'}</button>}
        </div>
      </div>
      <nav aria-label="Etapas do cadastro" className="grid grid-cols-3 gap-2 px-4 sm:px-8 pb-3">{['Modelo','Fotos e cores','Medidas e preço'].map((label,index) => <button disabled={busy} type="button" key={label} onClick={() => changeStep(index + 1)} aria-current={step === index + 1 ? 'step' : undefined} className={'rounded-lg px-2 py-2 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-2 ' + (step === index + 1 ? 'bg-[#173e2d] text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100')}><span className="opacity-60">{String(index + 1).padStart(2,'0')}</span>{label}</button>)}</nav>
      {(error || issues.length > 0) && <div ref={errorRef} tabIndex={-1} role="alert" className="border-t border-red-200 bg-red-50 px-4 sm:px-8 py-3 text-red-800 text-xs max-h-32 overflow-y-auto">
        <p className="font-semibold mb-1">Revise antes de continuar</p>
        {error && <p>{error}</p>}
        {!!issues.length && <ul className="space-y-1">{issues.map(issue => <li key={issue.field}><button type="button" className="underline underline-offset-2 text-left" onClick={() => { setStep(issue.step); requestAnimationFrame(() => { const field = document.getElementById('product-' + issue.field); field?.focus({ preventScroll: true }); field?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }); }}>{issue.message}</button></li>)}</ul>}
      </div>}
      {busy && <p role="status" className="bg-[#edf3e9] border-t border-[#dfe8d7] px-4 sm:px-8 py-2 text-xs text-[#36502c]">{progress || 'Preparando imagens…'}</p>}
    </header>
    <div className="p-5 sm:p-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.9fr)] gap-6 items-start">
      <form id="product-editor-form" onSubmit={step < 3 ? event => { event.preventDefault(); changeStep(step + 1); } : save} noValidate aria-busy={busy} className="min-w-0">
        <fieldset disabled={busy} className="admin-card p-5 sm:p-6 space-y-6 disabled:opacity-70">
          <legend className="sr-only">{['Dados do modelo','Fotos e cores','Medidas e preço'][step - 1]}</legend>
          {step === 1 && <>
            <div><p className="admin-eyebrow">Etapa 01</p><h2 className="text-lg font-semibold mt-2">Apresente sua armação</h2><p className="text-xs text-stone-500 mt-2">Obrigatório: nome, material da frente, formato, público, tipo de aro e descrição. As características adicionais são opcionais.</p></div>
            {field('Nome do produto','name')}
            {field('Material da frente','material')}
            <div className="grid sm:grid-cols-2 gap-4">
              {select('Formato','shape',[['quadrado','Quadrado'],['redondo','Redondo'],['gatinho','Gatinho'],['retangular','Retangular'],['aviador','Aviador'],['oval','Oval']])}
              {select('Público','gender',[['feminino','Feminino'],['masculino','Masculino'],['unissex','Unissex']])}
            </div>
            {select('Tipo de aro','rimType',[['Aro Fechado','Aro fechado'],['Meio Aro','Meio aro'],['Sem Aro (Balgriff)','Sem aro (Balgriff)']])}
            {textarea('Descrição do produto','description')}
            <details className="border-t border-stone-100 pt-4"><summary className="text-sm font-medium cursor-pointer">Características adicionais</summary><div className="space-y-5 mt-5">{field('Material das hastes','materialTemple','text',true)}{select('Plaquetas nasais','nosePads',[['Sim','Sim'],['Não','Não']],true)}{select('Mola nas hastes','springHinges',[['Sim','Sim'],['Não','Não']],true)}{field('Estilo','style','text',true)}{textarea('Itens inclusos — um por linha','includedItems',true)}</div></details>
          </>}
          {step === 2 && <>
            <div><p className="admin-eyebrow">Etapa 02</p><h2 className="text-lg font-semibold mt-2">Mostre cada detalhe</h2><p className="text-xs text-stone-500 mt-2">Obrigatório: pelo menos uma foto real do produto. A primeira será a capa. Importe até 8 fotos JPG, PNG ou WebP, com até 8 MB cada. As cores são opcionais.</p></div>
            <div id="product-photos" tabIndex={-1} onDragOver={e => { e.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); void importFiles(Array.from(e.dataTransfer.files)); }} className={'border-2 border-dashed rounded-2xl p-7 text-center ' + (dragging ? 'border-[#173e2d] bg-[#e6eee5]' : 'border-stone-300 bg-stone-50')}>
              <UploadSimple size={30} className="mx-auto text-[#6b886d]" /><p className="text-sm font-medium mt-4">Arraste suas fotos para cá</p><p className="text-xs text-stone-500 mt-2">ou selecione os arquivos do seu dispositivo</p><button type="button" disabled={busy || photos.length >= 8} onClick={() => input.current?.click()} className="admin-primary mt-5 disabled:opacity-50">{importing ? 'Preparando fotos…' : 'Importar imagens'}</button>
              <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" aria-label="Importar fotos do produto" className="sr-only" disabled={busy || photos.length >= 8} onChange={e => { const files = Array.from(e.target.files || []); e.target.value = ''; void importFiles(files); }} />
            </div>
            <div className="rounded-xl bg-[#edf3e9] border border-[#dfe8d7] p-4 text-xs text-[#36502c]">
              <p className="font-semibold">WebP otimizado no seu navegador</p>
              <p className="mt-1 leading-relaxed">Redimensionamos e comprimimos antes do envio. Somente a versão otimizada vai para o Storage; o banco guarda o endereço da foto.</p>
              {originalBytes > 0 && <p className="mt-2 font-medium tabular-nums">{formatBytes(originalBytes)} → {formatBytes(optimizedBytes)}{optimizedBytes < originalBytes ? ' · economia de ' + Math.round((1 - optimizedBytes / originalBytes) * 100) + '%' : ' · imagens prontas para envio'}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{photos.map((photo,index) => <div key={photo.id} className="border border-stone-200 rounded-xl overflow-hidden"><div className="aspect-square bg-stone-50 relative"><img src={photo.src} alt={'Foto ' + (index + 1) + ' do produto'} className="w-full h-full object-contain" />{index === 0 && <span className="absolute top-2 left-2 admin-badge">Capa</span>}</div><div className="p-2"><p className="text-[10px] text-stone-500 truncate" title={photo.name}>{photo.name}</p>{photo.file && <p className="text-[10px] text-[#55704d] mt-1">WebP · {formatBytes(photo.file.size)}</p>}<div className="flex items-center justify-between mt-1">{index > 0 ? <button type="button" onClick={() => { setPhotos(current => [photo, ...current.filter(p => p.id !== photo.id)]); setDirty(true); }} className="text-xs font-medium p-1">Usar como capa</button> : <span className="text-xs text-stone-400 p-1">Foto principal</span>}<button type="button" className="admin-icon text-red-700" aria-label={'Remover foto ' + (index + 1)} onClick={() => remove(photo)}><Trash size={16} /></button></div></div></div>)}</div>
            {!photos.length && <p className="flex gap-2 items-center text-xs text-stone-500"><ImageSquare size={17} /> Nenhuma imagem selecionada.</p>}
            <div id="product-colors" tabIndex={-1} className="border-t border-stone-100 pt-5"><h3 className="text-sm font-medium">Cores disponíveis <span className="text-xs text-stone-400">(opcional)</span></h3><div className="space-y-3 mt-4">{draft.colors.map((color,index) => <div key={index} className="flex items-center gap-2"><input type="color" value={color.hex} aria-label={'Cor da opção ' + (index + 1)} onChange={e => { setDraft(current => ({ ...current, colors: current.colors.map((c,i) => i === index ? { ...c, hex: e.target.value } : c) })); setDirty(true); }} className="w-12 h-11 rounded border border-stone-200" /><input value={color.name} aria-label={'Nome da cor ' + (index + 1)} onChange={e => { setDraft(current => ({ ...current, colors: current.colors.map((c,i) => i === index ? { ...c, name: e.target.value } : c) })); setDirty(true); }} className="admin-input" /><button type="button" className="admin-icon shrink-0" aria-label={'Remover cor ' + (index + 1)} onClick={() => { setDraft(current => ({ ...current, colors: current.colors.filter((_,i) => i !== index) })); setDirty(true); }}><Trash size={17} /></button></div>)}</div><button type="button" onClick={() => { setDraft(current => ({ ...current, colors: [...current.colors, { name: '', hex: '#000000' }] })); setDirty(true); }} className="text-sm font-medium inline-flex items-center gap-2 mt-4"><Plus size={17} /> Adicionar cor</button></div>
          </>}
          {step === 3 && <>
            <div><p className="admin-eyebrow">Etapa 03</p><h2 className="text-lg font-semibold mt-2">Medidas e condições de venda</h2><p className="text-xs text-stone-500 mt-2">Obrigatório: as cinco medidas em milímetros e o preço de venda em reais. Preço anterior, desconto Pix e selos são opcionais.</p></div>
            <div className="grid sm:grid-cols-2 gap-4">{field('Largura da lente (mm)','lensWidth','number')}{field('Altura da lente (mm)','lensHeight','number')}{field('Ponte (mm)','bridgeWidth','number')}{field('Largura frontal total (mm)','totalFront','number')}{field('Comprimento da haste (mm)','templeLength','number')}</div>
            <div className="border-t border-stone-100 pt-5 grid sm:grid-cols-2 gap-4">{field('Preço de venda (R$)','currentPrice','number')}{field('Preço anterior (R$)','originalPrice','number',true)}{field('Desconto Pix (%)','pixDiscount','number',true)}</div>
            <p className="text-xs text-stone-500">Sem preço anterior, usamos o preço de venda. Sem desconto informado, o desconto Pix será zero.</p>
            <div className="space-y-3 border-t border-stone-100 pt-5">{[['isPromo','Marcar como promoção'],['isBestseller','Marcar como mais vendido']].map(([key,label]) => <label key={key} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft[key as 'isPromo' | 'isBestseller']} onChange={e => { setDraft(current => ({ ...current, [key]: e.target.checked })); setDirty(true); }} className="accent-[#173e2d] w-4 h-4" />{label}</label>)}</div>
          </>}
        </fieldset>
        <p role="status" className="text-xs text-stone-500 mt-4">{busy ? progress || 'Preparando imagens…' : 'O produto só aparece na loja depois que você salvar.'}</p>
      </form>
      <div className="min-w-0 xl:sticky" style={{ top: toolbarHeight + 20 }}><AdminProductPreview product={preview} /></div>
    </div>
  </div>;
};

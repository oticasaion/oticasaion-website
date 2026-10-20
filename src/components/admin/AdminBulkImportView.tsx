import React, { useState } from 'react';
import { ArrowRight, DownloadSimple, FileCsv, FileCode, UploadSimple } from '@phosphor-icons/react';
import type { Product } from '../../types';
import { fillFromExisting, importIssues, parseImportEntries, productFromImport, requiredImportIssues, type ImportEntry } from '../../lib/bulkProductImport';
import { exportImportAuditCsv, exportPreparedCsv, exportProductsCsv, importProductsCsv } from '../../lib/productSpreadsheet';
import { saveProduct } from '../../services/productService';

interface Props { products: Product[]; onComplete: (products: Product[]) => void }
const shapes = ['quadrado','redondo','gatinho','retangular','aviador','oval'] as const;
const genders = ['feminino','masculino','unissex'] as const;
const rims = ['Aro Fechado','Meio Aro','Sem Aro (Balgriff)'] as const;
const numbers = [
  ['current_price','Preço de venda (R$)'], ['lens_width_mm','Largura da lente (mm)'],
  ['lens_height_mm','Altura da lente (mm)'], ['bridge_width_mm','Ponte (mm)'],
  ['total_front_mm','Largura frontal (mm)'], ['temple_length_mm','Haste (mm)'],
] as const;

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const AdminBulkImportView: React.FC<Props> = ({ products, onComplete }) => {
  const [entries, setEntries] = useState<ImportEntry[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [sheet, setSheet] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const update = (reference: string, change: (entry: ImportEntry) => ImportEntry) =>
    setEntries(current => current.map(entry => entry.reference === reference ? change(entry) : entry));
  const updateRequired = (reference: string, key: keyof ImportEntry['required_to_confirm'], value: string | number | null) =>
    update(reference, entry => ({ ...entry, required_to_confirm: { ...entry.required_to_confirm, [key]: value } }));
  const updateOptional = (reference: string, key: keyof NonNullable<ImportEntry['optional_to_confirm']>, value: unknown) =>
    update(reference, entry => ({ ...entry, optional_to_confirm: { ...entry.optional_to_confirm, [key]: value } }));

  const loadJson = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = parseImportEntries(JSON.parse(await file.text())).map(entry =>
        fillFromExisting(entry, products.find(product => product.id === `aion-import-${entry.reference}`)));
      setEntries(parsed); setSheet([]); setSavedIds([]);
      setSelected(parsed.filter(entry => importIssues(entry).length === 0 || !['sol-avulsas','sol-09'].includes(entry.reference)).map(entry => entry.reference));
      setMessage(`${parsed.length} referências carregadas. Os dados existentes no JSON aparecem abaixo; campos ausentes devem ser confirmados.`);
    } catch (error) { setEntries([]); setSelected([]); setMessage(error instanceof Error ? error.message : 'JSON inválido.'); }
  };
  const loadCsv = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = importProductsCsv(await file.text());
      setSheet(parsed); setEntries([]); setSavedIds([]);
      setMessage(`${parsed.length} linha(s) válidas. Confira a prévia antes de salvar.`);
    } catch (error) { setSheet([]); setMessage(error instanceof Error ? error.message : 'Planilha inválida.'); }
  };
  const chosen = entries.filter(entry => selected.includes(entry.reference));
  const ready = chosen.filter(entry => importIssues(entry).length === 0);
  const estimatedCount = entries.filter(entry => Array.isArray(entry.estimated_fields) && entry.estimated_fields.length > 0).length;
  const missingCounts = Object.entries(entries.reduce<Record<string, number>>((counts, entry) => {
    for (const field of requiredImportIssues(entry)) counts[field] = (counts[field] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]);
  const saveRows = async (rows: Product[]) => {
    if (busy || !rows.length) return;
    setBusy(true); setMessage('Salvando produtos…');
    const saved: Product[] = [];
    for (const row of rows) {
      const previous = products.find(product => product.id === row.id);
      const product = { ...row, lensesEnabled: row.lensesEnabled ?? previous?.lensesEnabled ?? true, rating: previous?.rating ?? 0, reviewsCount: previous?.reviewsCount ?? 0, clientPhotos: previous?.clientPhotos || [] };
      const result = await saveProduct(product);
      if (!result.success) {
        setSavedIds(saved.map(item => item.id));
        setMessage(`Falha em ${row.id}: ${result.error || 'erro ao salvar'}. ${saved.length} produto(s) salvos. Você pode tentar novamente; os IDs são preservados.`);
        setBusy(false); if (saved.length) onComplete(saved); return;
      }
      saved.push(product); setMessage(`${saved.length} de ${rows.length} produtos salvos…`);
    }
    setSavedIds(saved.map(item => item.id)); setBusy(false);
    setMessage(`${saved.length} produto(s) cadastrados ou atualizados.`); onComplete(saved);
  };
  const saveJson = () => {
    if (!chosen.length || ready.length !== chosen.length) return;
    void saveRows(chosen.map(entry => {
      const imported = productFromImport(entry);
      const previous = products.find(product => product.id === imported.id);
      return previous ? { ...imported, isPromo: previous.isPromo, isBestseller: previous.isBestseller, specs: { ...imported.specs, style: previous.specs.style } } : imported;
    }));
  };

  return <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10 space-y-6">
    <header><p className="admin-eyebrow">Gestão de produtos</p><h1 className="text-3xl font-semibold mt-2">Importar e exportar</h1><p className="text-sm text-stone-500 mt-2">Atualize vários produtos com uma planilha ou complete o catálogo das fotos já enviadas.</p></header>
    <div className="grid lg:grid-cols-2 gap-5">
      <section className="admin-card p-5 sm:p-6 space-y-4"><div className="flex items-center gap-3"><FileCsv size={25} className="text-[#577760]" /><h2 className="font-semibold text-lg">Planilha CSV</h2></div><p className="text-sm text-stone-500">Exporte o catálogo, edite no Excel ou LibreOffice e salve como CSV UTF-8. Mantenha o ID para atualizar um produto.</p><button type="button" onClick={() => download('catalogo-oticas-aion.csv', exportProductsCsv(products, window.location.href.split('#')[0]), 'text/csv;charset=utf-8')} disabled={busy} className="admin-secondary"><DownloadSimple size={18} /> Exportar catálogo</button><label htmlFor="sheet-file" className="block text-sm font-medium">Importar planilha editada</label><input id="sheet-file" type="file" accept=".csv,text/csv" disabled={busy} onChange={event => void loadCsv(event.target.files?.[0])} className="admin-file-input" /></section>
      <section className="admin-card p-5 sm:p-6 space-y-4"><div className="flex items-center gap-3"><FileCode size={25} className="text-[#577760]" /><h2 className="font-semibold text-lg">Catálogo de fotos JSON</h2></div><p className="text-sm text-stone-500">O JSON preenche nome, descrição, formato, público, aro e links das fotos quando esses dados constam do arquivo.</p><label htmlFor="bulk-file" className="block text-sm font-medium">Selecionar JSON</label><input id="bulk-file" type="file" accept=".json,application/json" disabled={busy} onChange={event => void loadJson(event.target.files?.[0])} className="admin-file-input" /></section>
    </div>
    {message && <p role="status" className="admin-card border-l-4 !border-l-[#75937b] p-4 text-sm">{message}</p>}

    {!!sheet.length && <section className="admin-card p-5 sm:p-6 space-y-4"><div className="flex flex-wrap items-center gap-3"><div className="mr-auto"><h2 className="font-semibold">Prévia da planilha</h2><p className="text-sm text-stone-500">{sheet.length} produto(s) · {sheet.filter(row => products.some(item => item.id === row.id)).length} atualização(ões)</p></div><button type="button" onClick={() => void saveRows(sheet)} disabled={busy} className="admin-primary disabled:opacity-50"><UploadSimple size={18} /> {busy ? 'Salvando…' : 'Importar planilha'}</button></div><div className="max-h-80 overflow-auto divide-y text-sm">{sheet.map(row => <div key={row.id} className="py-2 flex gap-3"><span className="font-mono text-xs text-stone-500">{row.id}</span><span>{row.name}</span><span className="ml-auto text-stone-500">{row.images.length} foto(s)</span></div>)}</div></section>}

    {!!entries.length && <>
      <section className="admin-card p-5 sm:p-6 space-y-4"><div className="flex flex-wrap items-center gap-3"><div className="mr-auto"><h2 className="font-semibold">Conferência do arquivo</h2><p className="text-sm text-stone-500">{entries.length} referências · {entries.reduce((sum, entry) => sum + entry.images.length, 0)} fotos · {chosen.length} selecionadas · {ready.length} prontas</p></div><button type="button" onClick={() => download('pendencias-obrigatorias.csv', exportImportAuditCsv(entries), 'text/csv;charset=utf-8')} disabled={busy} className="admin-secondary"><DownloadSimple size={18} /> Baixar pendências</button><button type="button" onClick={() => download('armacoes-para-completar.csv', exportPreparedCsv(entries), 'text/csv;charset=utf-8')} disabled={busy} className="admin-secondary"><DownloadSimple size={18} /> Baixar planilha</button><button type="button" onClick={() => download('catalogo-preenchido.json', JSON.stringify(entries,null,2), 'application/json')} disabled={busy} className="admin-secondary"><DownloadSimple size={18} /> Baixar JSON</button><button type="button" onClick={saveJson} disabled={busy || !chosen.length || ready.length !== chosen.length} className="admin-primary disabled:opacity-50"><UploadSimple size={18} /> {busy ? 'Salvando…' : `Importar ${chosen.length} produto(s)`}</button></div>{missingCounts.length > 0 && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-semibold">O JSON contém campos obrigatórios sem valor</p><p className="mt-1 text-xs">Preencha com medidas da armação e dados comerciais reais antes de importar.</p><ul className="mt-3 flex flex-wrap gap-2">{missingCounts.map(([field, count]) => <li key={field} className="rounded-full bg-white border border-amber-200 px-3 py-1 text-xs">{field}: {count}</li>)}</ul></div>}{estimatedCount > 0 && <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-semibold">{estimatedCount} referência(s) contêm dados fictícios</p><p className="mt-1 text-xs">O arquivo atende aos campos obrigatórios, mas preço, material e medidas estimados precisam ser conferidos antes da venda.</p></div>}<p className="text-xs text-stone-500">A planilha inclui os links das fotos e pode ser editada localmente; depois selecione-a acima em “Importar planilha editada”. Grupos de fotos diferentes devem ser separados por produto.</p></section>
      <div className="space-y-4">{entries.map(entry => {
        const issues = importIssues(entry), checked = selected.includes(entry.reference);
        return <section key={entry.reference} className="admin-card p-5 sm:p-6"><div className="flex gap-3 items-start"><input type="checkbox" aria-label={'Selecionar '+entry.reference} checked={checked} disabled={busy} onChange={event => setSelected(current => event.target.checked ? [...current,entry.reference] : current.filter(ref => ref !== entry.reference))} className="mt-1 h-5 w-5 accent-[#173e2d]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{entry.reference}</h3><span className={'text-xs rounded-full px-2 py-1 ' + (issues.length ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800')}>{issues.length ? `${issues.length} campo(s) pendentes` : 'Pronto'}</span>{!!entry.estimated_fields?.length && <span className="text-xs rounded-full px-2 py-1 bg-amber-50 text-amber-800">Dados estimados</span>}</div><p className="text-xs text-stone-500 mt-1">{entry.images.length} foto(s){issues.length ? ` · Falta: ${issues.join(', ')}` : ''}</p></div><ArrowRight size={18} className="text-stone-400 shrink-0" /></div>
          {checked && <div className="mt-5 space-y-5 border-t border-stone-100 pt-5"><div className="grid sm:grid-cols-2 gap-3"><label className="text-xs font-medium">Nome<input value={entry.name || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,name:event.target.value}))} className="admin-input mt-1" /></label><label className="text-xs font-medium">Material da frente<input value={entry.required_to_confirm.material_front || ''} disabled={busy} onChange={event => updateRequired(entry.reference,'material_front',event.target.value)} className="admin-input mt-1" /></label></div>
            <label className="block text-xs font-medium">Descrição<textarea value={entry.description || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,description:event.target.value}))} rows={2} className="admin-input mt-1 resize-y" /></label>
            <div className="grid sm:grid-cols-3 gap-3"><label className="text-xs font-medium">Formato<select value={entry.shape || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,shape:event.target.value as Product['shape']}))} className="admin-input mt-1"><option value="">Selecione</option>{shapes.map(value => <option key={value} value={value}>{value}</option>)}</select></label><label className="text-xs font-medium">Público<select value={entry.gender || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,gender:event.target.value as Product['gender']}))} className="admin-input mt-1"><option value="">Selecione</option>{genders.map(value => <option key={value} value={value}>{value}</option>)}</select></label><label className="text-xs font-medium">Tipo de aro<select value={entry.rim_type || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,rim_type:event.target.value as Product['rimType']}))} className="admin-input mt-1"><option value="">Selecione</option>{rims.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{numbers.map(([key,label]) => <label key={key} className="text-xs font-medium">{label}<input type="number" min="0" step="any" value={entry.required_to_confirm[key] ?? ''} disabled={busy} onChange={event => updateRequired(entry.reference,key,event.target.value === '' ? null : Number(event.target.value))} className="admin-input mt-1" /></label>)}</div>
            <div className="grid sm:grid-cols-2 gap-3"><label className="text-xs font-medium">Preço anterior (opcional)<input type="number" min="0" step="any" value={entry.optional_to_confirm?.original_price ?? ''} disabled={busy} onChange={event => updateOptional(entry.reference,'original_price',event.target.value === '' ? null : Number(event.target.value))} className="admin-input mt-1" /></label><label className="text-xs font-medium">Desconto Pix % (opcional)<input type="number" min="0" max="100" step="any" value={entry.optional_to_confirm?.pix_discount_percent ?? ''} disabled={busy} onChange={event => updateOptional(entry.reference,'pix_discount_percent',event.target.value === '' ? null : Number(event.target.value))} className="admin-input mt-1" /></label></div>
            <label className="block text-xs font-medium">Links públicos das fotos — um por linha<textarea value={entry.images.join('\n')} disabled={busy} onChange={event => update(entry.reference,e => ({...e,images:event.target.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean)}))} rows={Math.min(5,Math.max(2,entry.images.length))} className="admin-input mt-1 font-mono text-xs resize-y" /></label><div className="flex flex-wrap gap-2">{entry.images.map((url,index) => <a key={url+index} href={url} target="_blank" rel="noreferrer" className="admin-photo-thumb" title={`Abrir foto ${index+1}`}><img src={url} alt={`${entry.name}, foto ${index+1}`} loading="lazy" /></a>)}</div>
          </div>}
          {savedIds.includes(`aion-import-${entry.reference}`) && <p className="text-xs text-emerald-700 mt-3">Salvo no banco.</p>}
        </section>;
      })}</div>
    </>}
  </div>;
};

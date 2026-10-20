import React, { useState } from 'react';
import type { Product } from '../../types';
import { importIssues, parseImportEntries, productFromImport, type ImportEntry } from '../../lib/bulkProductImport';
import { saveProduct } from '../../services/productService';
import { exportPreparedCsv, exportProductsCsv, importProductsCsv } from '../../lib/productSpreadsheet';

interface Props { products: Product[]; onComplete: (products: Product[]) => void }
const numericFields = [
  ['current_price','Preço (R$)'], ['lens_width_mm','Lente (largura)'], ['lens_height_mm','Lente (altura)'],
  ['bridge_width_mm','Ponte'], ['total_front_mm','Frente total'], ['temple_length_mm','Haste'],
] as const;

export const AdminBulkImportView: React.FC<Props> = ({ products, onComplete }) => {
  const [entries,setEntries] = useState<ImportEntry[]>([]);
  const [selected,setSelected] = useState<string[]>([]);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const [done,setDone] = useState<Product[]>([]);
  const [sheet,setSheet] = useState<Product[]>([]);
  const update = (reference: string, change: (entry: ImportEntry) => ImportEntry) => setEntries(current => current.map(entry => entry.reference === reference ? change(entry) : entry));
  const load = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = parseImportEntries(JSON.parse(await file.text()));
      setEntries(parsed); setSheet([]); setSelected(parsed.filter(entry => entry.reference !== 'sol-avulsas' && entry.reference !== 'sol-09').map(entry => entry.reference));
      setDone([]); setMessage(`${parsed.length} referências carregadas. Confira fotos e complete os dados antes de importar.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Arquivo inválido.'); }
  };
  const chosen = entries.filter(entry => selected.includes(entry.reference));
  const ready = chosen.filter(entry => importIssues(entry).length === 0);
  const submit = async () => {
    if (busy || !chosen.length || ready.length !== chosen.length) return;
    setBusy(true); setMessage('Salvando produtos…');
    const saved: Product[] = [];
    for (const entry of chosen) {
      const product = productFromImport(entry);
      const result = await saveProduct(product);
      if (!result.success) { setDone(saved); setMessage(`Importação interrompida em ${entry.reference}: ${result.error || 'erro ao salvar'}. ${saved.length} produto(s) salvo(s). É seguro tentar novamente: as referências usam IDs fixos.`); setBusy(false); if (saved.length) onComplete(saved); return; }
      saved.push(product);
      setMessage(`${saved.length} de ${chosen.length} produtos salvos…`);
    }
    setDone(saved); setBusy(false); setMessage(`${saved.length} produtos cadastrados. Confira o catálogo público.`); onComplete(saved);
  };
  const loadSheet = async (file?: File) => {
    if (!file) return;
    try { const parsed=importProductsCsv(await file.text()); setSheet(parsed); setEntries([]); setDone([]); setMessage(`${parsed.length} linha(s) válidas. Confira a prévia e importe para criar ou atualizar os produtos.`); }
    catch(error) {setSheet([]);setMessage(error instanceof Error ? error.message : 'Planilha inválida.');}
  };
  const submitSheet = async () => {
    if (busy || !sheet.length) return;
    setBusy(true); const saved: Product[]=[];
    for (const row of sheet) {
      const old=products.find(p=>p.id===row.id);
      const product={...row,rating:old?.rating ?? 0,reviewsCount:old?.reviewsCount ?? 0,clientPhotos:old?.clientPhotos || []};
      const result=await saveProduct(product);
      if(!result.success) {setMessage(`Falha em ${row.id}: ${result.error || 'erro ao salvar'}. ${saved.length} linha(s) salvas; importe o mesmo arquivo novamente após corrigir.`);setBusy(false);if(saved.length)onComplete(saved);return;}
      saved.push(product);setMessage(`${saved.length} de ${sheet.length} produtos salvos…`);
    }
    setBusy(false);setDone(saved);setMessage(`${saved.length} produtos criados ou atualizados.`);onComplete(saved);
  };
  const downloadCsv = () => {
    const url=URL.createObjectURL(new Blob([exportProductsCsv(products, window.location.href.split('#')[0])],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='catalogo-oticas-aion.csv';anchor.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const downloadPrepared = () => {
    const url=URL.createObjectURL(new Blob([exportPreparedCsv(entries)],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='armacoes-para-completar.csv';anchor.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(entries,null,2)],{type:'application/json'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'catalogo-para-importacao-preenchido.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10 space-y-6">
    <div><p className="admin-eyebrow">Catálogo</p><h1 className="text-3xl font-semibold mt-2">Importar e exportar</h1><p className="text-sm text-stone-500 mt-2">Edite produtos em uma planilha CSV ou use o JSON preparado das novas armações. As imagens são vinculadas pelos links públicos.</p></div>
    <div className="admin-card p-5 space-y-4"><h2 className="font-semibold">Planilha do catálogo</h2><p className="text-sm text-stone-500">Exporte, edite no Excel ou LibreOffice e salve como CSV UTF-8. Mantenha a coluna ID para atualizar o mesmo produto. Separe várias URLs de imagens por |.</p><button type="button" onClick={downloadCsv} disabled={busy} className="admin-primary disabled:opacity-50">Exportar catálogo CSV</button><label htmlFor="sheet-file" className="block text-sm font-medium">Importar planilha CSV</label><input id="sheet-file" type="file" accept=".csv,text/csv" disabled={busy} onChange={event => void loadSheet(event.target.files?.[0])} className="block text-sm" /></div>
    <div className="admin-card p-5 space-y-3"><label htmlFor="bulk-file" className="block text-sm font-medium">Ou importar o JSON das fotos preparadas</label><input id="bulk-file" type="file" accept="application/json,.json" disabled={busy} onChange={event => void load(event.target.files?.[0])} className="block text-sm" /><p className="text-xs text-stone-500">O JSON permite completar os dados na tela. Nenhum produto é publicado antes de clicar em Importar.</p></div>
    {message && <p role="status" className="admin-card p-4 text-sm">{message}</p>}
    {!!sheet.length && <div className="admin-card p-5 space-y-4"><div className="flex flex-wrap items-center gap-3"><p className="text-sm mr-auto">{sheet.length} linha(s) válidas · {sheet.filter(p=>products.some(old=>old.id===p.id)).length} atualização(ões) · {sheet.filter(p=>!products.some(old=>old.id===p.id)).length} novo(s)</p><button type="button" onClick={()=>void submitSheet()} disabled={busy} className="admin-primary disabled:opacity-50">{busy?'Importando…':'Importar planilha'}</button></div><div className="max-h-80 overflow-auto divide-y text-sm">{sheet.map(p=><div key={p.id} className="py-2 flex gap-3"><span className="font-mono text-xs text-stone-500">{p.id}</span><span>{p.name}</span><span className="ml-auto text-stone-500">{p.images.length} foto(s)</span></div>)}</div></div>}
    {!!entries.length && <><div className="admin-card p-5 flex flex-wrap items-center gap-3"><p className="text-sm mr-auto">{chosen.length} selecionados · {ready.length} prontos</p><button type="button" onClick={downloadPrepared} disabled={busy} className="admin-input !w-auto">Baixar planilha para completar</button><button type="button" onClick={download} disabled={busy} className="admin-input !w-auto">Baixar JSON preenchido</button><button type="button" onClick={() => void submit()} disabled={busy || !chosen.length || ready.length !== chosen.length} className="admin-primary disabled:opacity-50">{busy ? 'Importando…' : `Importar ${chosen.length} produto(s)`}</button></div>
      <div className="space-y-4">{entries.map(entry => { const issues=importIssues(entry), checked=selected.includes(entry.reference); return <section key={entry.reference} className="admin-card p-5"><div className="flex gap-3 items-start"><input type="checkbox" aria-label={'Selecionar '+entry.reference} checked={checked} disabled={busy} onChange={event => setSelected(current => event.target.checked ? [...current,entry.reference] : current.filter(ref => ref !== entry.reference))} className="mt-1" /><div className="flex-1"><h2 className="font-semibold">{entry.reference} · {entry.name}</h2><p className="text-xs text-stone-500">{entry.images.length} foto(s) · {issues.length ? `Faltam: ${issues.join(', ')}` : 'Pronto para importar'}</p></div></div>
        {checked && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4"><label className="text-xs">Material da frente<input value={entry.required_to_confirm.material_front || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,required_to_confirm:{...e.required_to_confirm,material_front:event.target.value}}))} className="admin-input mt-1" /></label>
          <label className="text-xs">Público<select value={entry.gender || ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,gender:event.target.value as Product['gender']}))} className="admin-input mt-1"><option value="">Selecione</option>{['feminino','masculino','unissex'].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          {numericFields.map(([key,label]) => <label key={key} className="text-xs">{label}<input type="number" min="0" step="any" value={entry.required_to_confirm[key] ?? ''} disabled={busy} onChange={event => update(entry.reference,e => ({...e,required_to_confirm:{...e.required_to_confirm,[key]:event.target.value === '' ? null : Number(event.target.value)}}))} className="admin-input mt-1" /></label>)}</div>}
        {done.some(product => product.id === `aion-import-${entry.reference}`) && <p className="text-xs text-emerald-700 mt-3">Salvo no banco.</p>}
      </section>; })}</div></>}
  </div>;
};

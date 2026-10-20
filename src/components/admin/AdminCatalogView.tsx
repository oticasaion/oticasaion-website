import React, { useMemo, useState } from 'react';
import { Product } from '../../types';
import { MagnifyingGlass, Plus, PencilSimple, Trash, Eye, Package, Tag, Star, ArrowRight } from '@phosphor-icons/react';

interface Props {
  products: Product[];
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onPreviewProduct: (product: Product) => void;
}

const currency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const AdminCatalogView: React.FC<Props> = ({ products, onAddNewProduct, onEditProduct, onDeleteProduct, onPreviewProduct }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('todos');
  const [sort, setSort] = useState('recent');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [failed, setFailed] = useState(false);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-BR');
    const list = products.filter(p =>
      [p.name, p.material, p.shape, p.id].some(value => value.toLocaleLowerCase('pt-BR').includes(term)) &&
      (filter === 'todos' || (filter === 'promocoes' ? p.isPromo : filter === 'destaques' ? p.isBestseller : p.gender === filter)));
    if (sort === 'price') list.sort((a,b) => a.currentPrice - b.currentPrice);
    if (sort === 'name') list.sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));
    return list;
  }, [products, query, filter, sort]);

  const remove = async (product: Product) => {
    if (deleting || !window.confirm('Excluir “' + product.name + '” da loja? Esta ação removerá o produto do catálogo.')) return;
    setDeleting(product.id);
    setFeedback('');
    setFailed(false);
    try {
      await onDeleteProduct(product.id);
      setFeedback('Produto excluído do catálogo.');
    } catch (error) {
      setFailed(true);
      setFeedback(error instanceof Error ? error.message : 'Não foi possível excluir. Tente novamente.');
    } finally {
      setDeleting(null);
    }
  };

  return <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">
    <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
      <div><p className="admin-eyebrow">Sua vitrine, sempre em dia</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Catálogo de armações</h1><p className="mt-2 text-sm text-stone-500">Gerencie os modelos e as ofertas que seus clientes encontram na loja.</p></div>
      <button onClick={onAddNewProduct} className="admin-primary"><Plus size={19} /> Nova armação</button>
    </div>
    <section aria-label="Resumo do catálogo" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Modelos no catálogo', value: products.length, icon: Package, caption: 'Armações disponíveis na vitrine' },
        { label: 'Em promoção', value: products.filter(p => p.isPromo).length, icon: Tag, caption: 'Ofertas sinalizadas para o cliente' },
        { label: 'Destaques', value: products.filter(p => p.isBestseller).length, icon: Star, caption: 'Modelos com selo de mais vendido' },
      ].map(item => <div key={item.label} className="admin-card p-5"><div className="flex justify-between text-sm text-stone-500">{item.label}<item.icon size={20} className="text-[#78927b]" /></div><div className="text-3xl font-semibold mt-4 tabular-nums">{item.value}</div><p className="text-xs text-stone-500 mt-2">{item.caption}</p></div>)}
    </section>
    <section className="admin-card overflow-hidden" aria-label="Produtos">
      <div className="p-5 border-b border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><MagnifyingGlass size={19} className="absolute left-3 top-3.5 text-stone-400" /><input type="search" aria-label="Buscar armações" name="product-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar modelo, material ou código…" className="admin-input pl-10" /></div>
          <select aria-label="Ordenar armações" value={sort} onChange={e => setSort(e.target.value)} className="admin-input sm:w-48"><option value="recent">Ordem do catálogo</option><option value="name">Nome de A a Z</option><option value="price">Menor preço</option></select>
        </div>
        <div className="flex flex-wrap gap-2">{[['todos','Todos'],['promocoes','Promoções'],['destaques','Destaques'],['feminino','Feminino'],['masculino','Masculino'],['unissex','Unissex']].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className={'px-3 py-2 rounded-lg text-xs font-medium transition-colors ' + (filter === id ? 'bg-[#e6eee5] text-[#1d4935]' : 'text-stone-500 hover:bg-stone-100')}>{label}</button>)}</div>
      </div>
      {feedback && <p role={failed ? 'alert' : 'status'} className={'m-5 p-3 rounded-lg text-sm ' + (failed ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800')}>{feedback}</p>}
      <p className="px-5 pt-4 text-xs text-stone-500" aria-live="polite">{filtered.length} de {products.length} modelos</p>
      {filtered.length ? <div className="divide-y divide-stone-100 px-5">{filtered.map(product => <article key={product.id} className="grid grid-cols-[72px_1fr] md:grid-cols-[80px_1fr_auto_auto] items-center gap-4 py-5">
        <div className="rounded-xl bg-[#f5f5f1] overflow-hidden"><img src={product.images[0]} alt={product.name} width={80} height={80} loading="lazy" className="w-20 h-20 object-contain" /></div>
        <div className="min-w-0"><h2 className="font-semibold text-sm break-words">{product.name}</h2><p className="text-xs text-stone-500 mt-1 truncate">{product.material}</p><div className="flex gap-2 mt-2"><span className="admin-badge capitalize">{product.gender}</span>{product.isPromo && <span className="admin-badge bg-amber-50 text-amber-800">Promoção</span>}{product.isBestseller && <span className="admin-badge">Destaque</span>}</div></div>
        <div className="md:text-right"><p className="text-sm font-semibold tabular-nums">{currency(product.currentPrice)}</p><p className="text-xs text-stone-500 mt-1">{currency(product.currentPrice * (1 - product.pixDiscountPercent / 100))} no Pix</p></div>
        <div className="flex items-center justify-end gap-1">
          <button className="admin-icon" aria-label={'Visualizar ' + product.name} onClick={() => onPreviewProduct(product)}><Eye size={19} /></button>
          <button className="admin-icon" aria-label={'Editar ' + product.name} onClick={() => onEditProduct(product)}><PencilSimple size={19} /></button>
          <button className="admin-icon text-red-700 hover:bg-red-50 disabled:opacity-40" disabled={!!deleting} aria-label={'Excluir ' + product.name} onClick={() => remove(product)}><Trash size={19} /></button>
        </div>
      </article>)}</div> : <div className="text-center py-16 px-6"><Package size={36} className="mx-auto text-stone-400" /><h2 className="font-semibold mt-4">Nenhuma armação encontrada</h2><p className="text-sm text-stone-500 mt-2">Ajuste os filtros ou adicione um modelo ao catálogo.</p><button className="inline-flex items-center gap-2 text-sm font-semibold mt-5" onClick={() => { setQuery(''); setFilter('todos'); }}>Limpar filtros <ArrowRight size={16} /></button></div>}
    </section>
    <p className="text-xs text-stone-500 mt-5 leading-relaxed">Alterações só são confirmadas após o salvamento na loja. Rascunhos permanecem neste navegador.</p>
  </div>;
};

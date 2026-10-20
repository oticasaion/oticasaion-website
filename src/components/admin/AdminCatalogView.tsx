import React, { useEffect, useRef, useState } from 'react';
import { fetchAdminProductPage, updateAllProductsLenses, updateProductLenses, type AdminProductListItem } from '../../services/productService';
import { MagnifyingGlass, Plus, PencilSimple, Trash, Eye, ArrowRight, UploadSimple, Package } from '@phosphor-icons/react';

interface Props {
  onAddNewProduct: () => void;
  onEditProduct: (id: string) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onPreviewProduct: (id: string) => Promise<void>;
  onLensesChanged: (id: string | null, enabled: boolean) => void;
}

const PAGE_SIZE = 12;
const currency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const AdminCatalogView: React.FC<Props> = ({ onAddNewProduct, onEditProduct, onDeleteProduct, onPreviewProduct, onLensesChanged }) => {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [items, setItems] = useState<AdminProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [lensBusy, setLensBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [failed, setFailed] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => { setPage(1); setSearch(query); }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const current = ++requestId.current;
    setLoading(true);
    fetchAdminProductPage({ page, pageSize: PAGE_SIZE, query: search, filter, sort })
      .then(result => {
        if (current !== requestId.current) return;
        if (page > 1 && result.total > 0 && !result.items.length) { setPage(Math.max(1, Math.ceil(result.total / PAGE_SIZE))); return; }
        setItems(result.items); setTotal(result.total); setFailed(false);
      })
      .catch(cause => { if (current === requestId.current) { setItems([]); setTotal(0); setFailed(true); setFeedback(cause instanceof Error ? cause.message : 'Não foi possível carregar o catálogo.'); } })
      .finally(() => { if (current === requestId.current) setLoading(false); });
    return () => { requestId.current++; };
  }, [page, search, filter, sort, refresh]);

  const remove = async (product: AdminProductListItem) => {
    if (deleting || !window.confirm('Excluir “' + product.name + '” da loja? Esta ação removerá o produto do catálogo.')) return;
    setDeleting(product.id);
    setFeedback('');
    setFailed(false);
    try {
      await onDeleteProduct(product.id);
      setFeedback('Produto excluído do catálogo.');
      setRefresh(value => value + 1);
    } catch (error) {
      setFailed(true);
      setFeedback(error instanceof Error ? error.message : 'Não foi possível excluir. Tente novamente.');
    } finally {
      setDeleting(null);
    }
  };

  const preview = async (id: string) => {
    setFeedback('');
    try { await onPreviewProduct(id); }
    catch (cause) { setFailed(true); setFeedback(cause instanceof Error ? cause.message : 'Não foi possível abrir a armação.'); }
  };
  const toggleLenses = async (product: AdminProductListItem) => {
    if (lensBusy) return;
    const enabled = product.lensesEnabled === false;
    setLensBusy(product.id); setFeedback(''); setFailed(false);
    try {
      await updateProductLenses(product.id, enabled);
      onLensesChanged(product.id, enabled);
      setItems(current => current.map(item => item.id === product.id ? { ...item, lensesEnabled: enabled } : item));
      setFeedback(`Lentes ${enabled ? 'ativadas' : 'desativadas'} em “${product.name}”.`);
    } catch (cause) { setFailed(true); setFeedback(cause instanceof Error ? cause.message : 'Não foi possível atualizar as lentes.'); }
    finally { setLensBusy(null); }
  };
  const toggleAllLenses = async (enabled: boolean) => {
    if (lensBusy || !window.confirm(`${enabled ? 'Ativar' : 'Desativar'} lentes em todas as armações do catálogo?`)) return;
    setLensBusy('all'); setFeedback(''); setFailed(false);
    try {
      const count = await updateAllProductsLenses(enabled);
      onLensesChanged(null, enabled);
      setItems(current => current.map(item => ({ ...item, lensesEnabled: enabled })));
      setRefresh(value => value + 1);
      setFeedback(`Lentes ${enabled ? 'ativadas' : 'desativadas'} em ${count} armação(ões).`);
    } catch (cause) { setFailed(true); setFeedback(cause instanceof Error ? cause.message : 'Não foi possível atualizar o catálogo.'); }
    finally { setLensBusy(null); }
  };
  const changeFilter = (value: string) => { setFilter(value); setPage(1); };
  const changeSort = (value: string) => { setSort(value); setPage(1); };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">
    <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
      <div><p className="admin-eyebrow">Produtos cadastrados</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Armações</h1><p className="mt-2 text-sm text-stone-500">Busque, confira e edite os produtos do site.</p></div>
      <div className="flex flex-wrap gap-2"><a href="#/admin/produtos/importar" className="admin-input !w-auto inline-flex items-center gap-2"><UploadSimple size={19} /> Importar ou exportar</a><button onClick={onAddNewProduct} className="admin-primary"><Plus size={19} /> Nova armação</button></div>
    </div>
    <section className="admin-card p-4 sm:p-5 mb-5 flex flex-wrap items-center justify-between gap-4" aria-label="Lentes no catálogo"><div><h2 className="text-sm font-semibold">Lentes no catálogo</h2><p className="text-xs text-stone-600 mt-1">Ative ou desative em todas as armações. Também é possível alterar cada modelo abaixo.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={!!lensBusy || loading} onClick={() => { void toggleAllLenses(true); }} className="admin-input !w-auto text-xs disabled:opacity-50">Ativar em todos</button><button type="button" disabled={!!lensBusy || loading} onClick={() => { void toggleAllLenses(false); }} className="admin-input !w-auto text-xs disabled:opacity-50">Desativar em todos</button></div></section>
    <section className="admin-card overflow-hidden" aria-label="Produtos">
      <div className="p-5 border-b border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><MagnifyingGlass size={19} className="absolute left-3 top-3.5 text-stone-400" /><input type="search" aria-label="Buscar armações" name="product-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar modelo, material ou código…" className="admin-input pl-10" /></div>
          <select aria-label="Ordenar armações" value={sort} onChange={e => changeSort(e.target.value)} className="admin-input sm:w-48"><option value="recent">Mais recentes</option><option value="name">Nome de A a Z</option><option value="price">Menor preço</option></select>
        </div>
        <div className="flex flex-wrap gap-2">{[['todos','Todos'],['promocoes','Promoções'],['destaques','Destaques'],['feminino','Feminino'],['masculino','Masculino'],['unissex','Unissex']].map(([id,label]) => <button key={id} onClick={() => changeFilter(id)} aria-pressed={filter === id} className={'px-3 py-2 rounded-lg text-xs font-medium transition-colors ' + (filter === id ? 'bg-[#e6eee5] text-[#1d4935]' : 'text-stone-500 hover:bg-stone-100')}>{label}</button>)}</div>
      </div>
      {feedback && <p role={failed ? 'alert' : 'status'} className={'m-5 p-3 rounded-lg text-sm ' + (failed ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800')}>{feedback}</p>}
      <p className="px-5 pt-4 text-xs text-stone-500" aria-live="polite">{loading ? 'Carregando armações…' : `${total} modelo(s) encontrados · ${items.length} nesta página`}</p>
      {!loading && !!items.length && <div className="divide-y divide-stone-100 px-5">{items.map(product => <article key={product.id} className="grid grid-cols-[72px_1fr] md:grid-cols-[80px_1fr_auto_auto] items-center gap-4 py-5">
        <div className="rounded-xl bg-[#f5f5f1] overflow-hidden">{product.image ? <img src={product.image} alt={product.name} width={80} height={80} loading="lazy" className="w-20 h-20 object-contain" /> : <div className="w-20 h-20 flex items-center justify-center text-xs text-stone-400">Sem foto</div>}</div>
        <div className="min-w-0"><h2 className="font-semibold text-sm break-words">{product.name}</h2><p className="text-xs text-stone-500 mt-1 truncate">{product.material}</p><div className="flex gap-2 mt-2"><span className="admin-badge capitalize">{product.gender}</span>{product.isPromo && <span className="admin-badge bg-amber-50 text-amber-800">Promoção</span>}{product.isBestseller && <span className="admin-badge">Destaque</span>}</div><button type="button" disabled={!!lensBusy} onClick={() => { void toggleLenses(product); }} aria-label={`${product.lensesEnabled ? 'Desativar' : 'Ativar'} lentes em ${product.name}`} aria-pressed={product.lensesEnabled} className={'mt-2 rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-50 ' + (product.lensesEnabled ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-stone-100 text-stone-600 hover:bg-stone-200')}>{lensBusy === product.id ? 'Salvando…' : product.lensesEnabled ? 'Lentes ativas · desativar' : 'Lentes desativadas · ativar'}</button></div>
        <div className="md:text-right"><p className="text-sm font-semibold tabular-nums">{currency(product.currentPrice)}</p><p className="text-xs text-stone-500 mt-1">{currency(product.currentPrice * (1 - product.pixDiscountPercent / 100))} no Pix</p></div>
        <div className="flex items-center justify-end gap-1">
          <button className="admin-icon" aria-label={'Visualizar ' + product.name} onClick={() => { void preview(product.id); }}><Eye size={19} /></button>
          <button className="admin-icon" aria-label={'Editar ' + product.name} onClick={() => onEditProduct(product.id)}><PencilSimple size={19} /></button>
          <button className="admin-icon text-red-700 hover:bg-red-50 disabled:opacity-40" disabled={!!deleting} aria-label={'Excluir ' + product.name} onClick={() => remove(product)}><Trash size={19} /></button>
        </div>
      </article>)}</div>}
      {!loading && !items.length && !failed && <div className="text-center py-16 px-6"><Package size={36} className="mx-auto text-stone-400" /><h2 className="font-semibold mt-4">Nenhuma armação encontrada</h2><p className="text-sm text-stone-500 mt-2">Ajuste os filtros ou adicione um modelo ao catálogo.</p><button className="inline-flex items-center gap-2 text-sm font-semibold mt-5" onClick={() => { setQuery(''); setSearch(''); changeFilter('todos'); }}>Limpar filtros <ArrowRight size={16} /></button></div>}
      {!loading && total > PAGE_SIZE && <nav aria-label="Páginas do catálogo" className="flex items-center justify-between gap-3 border-t border-stone-200 p-5"><button className="admin-input !w-auto disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Anterior</button><span className="text-sm text-stone-600 tabular-nums">Página {page} de {pages}</span><button className="admin-input !w-auto disabled:opacity-40" disabled={page >= pages} onClick={() => setPage(value => value + 1)}>Próxima</button></nav>}
    </section>
  </div>;
};

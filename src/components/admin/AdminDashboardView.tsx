import React, { useEffect, useState } from 'react';
import { fetchAdminMetrics, type AdminMetrics } from '../../services/adminMetrics';
import { ImageSquare, Package, Plus, Tag, UploadSimple, CurrencyCircleDollar } from '@phosphor-icons/react';

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const AdminDashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetchAdminMetrics().then(value => { if (active) setMetrics(value); })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os indicadores.'); });
    return () => { active = false; };
  }, []);
  const cards = metrics ? [
    { label: 'Armações cadastradas', value: metrics.total, icon: Package, link: '#/admin/produtos' },
    { label: 'Sem foto', value: metrics.withoutPhoto, icon: ImageSquare, link: '#/admin/produtos' },
    { label: 'Em promoção', value: metrics.promotions, icon: Tag, link: '#/admin/produtos' },
    { label: 'Preço médio cadastrado', value: metrics.averagePrice == null ? '—' : money(metrics.averagePrice), icon: CurrencyCircleDollar, link: '#/admin/produtos' },
  ] : [];
  return <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10 space-y-7">
    <header><p className="admin-eyebrow">Painel da loja</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Visão geral</h1><p className="text-sm text-stone-500 mt-3">Indicadores do cadastro no banco de dados. Não representam vendas, visitas ou cliques.</p></header>
    {error && <p role="alert" className="text-sm text-red-800 bg-red-50 rounded-xl p-4">{error} <span className="block mt-1">Confira se a função de métricas foi instalada no Supabase.</span></p>}
    {!metrics && !error && <p role="status" className="text-sm text-stone-500">Carregando indicadores…</p>}
    <section aria-label="Resumo do catálogo" className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(card => <a href={card.link} key={card.label} className="admin-card p-5 hover:border-[#9fb49f] transition-colors"><card.icon size={22} className="text-[#78927b]" /><p className="text-3xl font-semibold mt-3 tabular-nums">{card.value}</p><p className="text-sm text-stone-500 mt-1">{card.label}</p></a>)}
    </section>
    <section className="flex flex-wrap gap-3"><a href="#/admin/produtos/novo" className="admin-primary"><Plus size={18} /> Nova armação</a><a href="#/admin/produtos/importar" className="admin-input !w-auto inline-flex items-center gap-2"><UploadSimple size={18} /> Importar ou exportar</a></section>
    {!!metrics?.withoutPhoto && <p role="status" className="text-sm text-amber-800 bg-amber-50 rounded-xl p-4">{metrics.withoutPhoto} produto(s) estão cadastrados sem foto. Revise esses itens no catálogo.</p>}
  </div>;
};

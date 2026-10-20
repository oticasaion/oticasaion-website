import React from 'react';
import type { Product } from '../../types';
import { ArrowRight, House, ImageSquare, Package, Plus, UploadSimple } from '@phosphor-icons/react';

export const AdminDashboardView: React.FC<{ products: Product[]; email?: string }> = ({ products }) => {
  const noPhoto = products.filter(product => !product.images.length).length;
  return <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10 space-y-7">
    <header><p className="admin-eyebrow">Painel da loja</p><h1 className="text-3xl font-semibold tracking-tight mt-2">Visão geral</h1><p className="text-sm text-stone-500 mt-3">Acesso rápido aos produtos cadastrados.</p></header>
    <section aria-label="Resumo do catálogo" className="grid sm:grid-cols-2 gap-4">
      <div className="admin-card p-5"><Package size={22} className="text-[#78927b]" /><p className="text-3xl font-semibold mt-3 tabular-nums">{products.length}</p><p className="text-sm text-stone-500 mt-1">Produtos cadastrados</p></div>
      <div className="admin-card p-5"><ImageSquare size={22} className="text-[#78927b]" /><p className="text-3xl font-semibold mt-3 tabular-nums">{noPhoto}</p><p className="text-sm text-stone-500 mt-1">Produtos sem foto</p></div>
    </section>
    <section className="admin-card p-5 sm:p-6"><h2 className="font-semibold">O que deseja fazer?</h2><div className="grid sm:grid-cols-2 gap-3 mt-4">
      <a href="#/admin/pagina-inicial" className="admin-input flex items-center justify-between gap-2">Editar página inicial <House size={18} /></a>
      <a href="#/admin/produtos" className="admin-input flex items-center justify-between gap-2">Ver catálogo <ArrowRight size={18} /></a>
      <a href="#/admin/produtos/novo" className="admin-input flex items-center justify-between gap-2">Nova armação <Plus size={18} /></a>
      <a href="#/admin/produtos/importar" className="admin-input flex items-center justify-between gap-2">Importar ou exportar <UploadSimple size={18} /></a>
    </div></section>
    {noPhoto > 0 && <p role="status" className="text-sm text-amber-800 bg-amber-50 rounded-xl p-4">{noPhoto} produto(s) estão cadastrados sem foto. Revise esses itens no catálogo.</p>}
  </div>;
};

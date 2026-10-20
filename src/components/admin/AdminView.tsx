import React, { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAccess';
import { Product } from '../../types';
import { deleteProduct, fetchAdminProductById, fetchAllAdminProducts } from '../../services/productService';
import { Logo } from '../Logo';
import { AdminLoginView } from './AdminLoginView';
import { AdminCatalogView } from './AdminCatalogView';
import { AdminEditorView } from './AdminEditorView';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminAccessView } from './AdminAccessView';
import { AdminBulkImportView } from './AdminBulkImportView';
import { AdminHomeSettingsView } from './AdminHomeSettingsView';
import type { HomeSettings } from '../../services/homeSettings';
import { ArrowUpRight, House, Package, Plus, ShieldCheck, SignOut, SquaresFour, UploadSimple } from '@phosphor-icons/react';

interface AdminViewProps {
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  onHomeSettingsUpdated: (settings: HomeSettings) => void;
  onBackToStore: () => void;
  onPreviewProduct: (product: Product) => void;
}

const AdminEditProductPage: React.FC<{ id: string; onBack: () => void; onSaved: (product: Product) => void }> = ({ id, onBack, onSaved }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetchAdminProductById(id).then(value => { if (active) setProduct(value); })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível abrir a armação.'); });
    return () => { active = false; };
  }, [id]);
  if (error) return <div className="p-10" role="alert">{error} <button className="underline" onClick={onBack}>Voltar ao catálogo</button></div>;
  if (!product) return <div className="p-10" role="status">Carregando armação…</div>;
  return <AdminEditorView productToEdit={product} onBackToCatalog={onBack} onSaveSuccess={onSaved} />;
};

const AdminBulkImportPage: React.FC<{ onComplete: (products: Product[]) => void }> = ({ onComplete }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetchAllAdminProducts().then(value => { if (active) setProducts(value); })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os produtos.'); });
    return () => { active = false; };
  }, []);
  if (error) return <p role="alert" className="p-10 text-red-800">{error}</p>;
  if (!products) return <p role="status" className="p-10">Carregando catálogo para importação e exportação…</p>;
  return <AdminBulkImportView products={products} onComplete={saved => {
    const merged = [...saved, ...products.filter(product => !saved.some(item => item.id === product.id))];
    setProducts(merged); onComplete(merged);
  }} />;
};

export const AdminView: React.FC<AdminViewProps> = ({ products, onProductsUpdated, onHomeSettingsUpdated, onBackToStore, onPreviewProduct }) => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [hash, setHash] = useState(window.location.hash);
  const [notice, setNotice] = useState('');
  const revision = useRef(0);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      const current = ++revision.current;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (active && current === revision.current) {
          setUser(!error && isAdmin(data.user) ? data.user : null);
          setChecking(false);
        }
      } catch {
        if (active && current === revision.current) { setUser(null); setChecking(false); }
      }
    };
    void verify();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || !isAdmin(session.user)) {
        revision.current++;
        setUser(null);
        setChecking(false);
      } else {
        // Run outside the Auth callback to avoid waiting on the Auth lock.
        window.setTimeout(() => { if (active) void verify(); }, 0);
      }
    });
    const onHash = () => { setHash(window.location.hash); setNotice(''); };
    window.addEventListener('hashchange', onHash);
    return () => { active = false; revision.current++; subscription.unsubscribe(); window.removeEventListener('hashchange', onHash); };
  }, []);

  useEffect(() => {
    if (checking) return;
    const path = window.location.hash.replace(/^#\/?/, '');
    if (!user && path !== 'admin/login') {
      window.history.replaceState(null, '', '#/admin/login');
      setHash('#/admin/login');
    } else if (user && ['admin', 'admin/login', 'lojista'].includes(path)) {
      window.history.replaceState(null, '', '#/admin/dashboard');
      setHash('#/admin/dashboard');
    }
  }, [user, checking, hash]);

  const navigate = (target: string) => { window.location.hash = target; window.scrollTo({ top: 0 }); };
  const logout = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) { setNotice('Não foi possível encerrar a sessão. Tente novamente.'); return; }
    setUser(null);
    navigate('#/admin/login');
  };

  if (checking) return <div className="min-h-screen bg-[#f6f7f4] flex items-center justify-center text-[#18392d]" role="status">Verificando acesso…</div>;
  if (!user) return <AdminLoginView onLoginSuccess={() => { setChecking(true); window.location.reload(); }} onBackToStore={onBackToStore} />;

  const path = hash.replace(/^#\/?/, '');
  const editingMatch = path.match(/^admin\/produtos\/([^/]+)\/editar$/);
  let editingId: string | undefined;
  try { editingId = editingMatch ? decodeURIComponent(editingMatch[1]) : undefined; } catch { editingId = undefined; }
  const isNew = path === 'admin/produtos/novo';
  const isEditor = isNew || !!editingMatch;
  const isAccess = path === 'admin/acesso';
  const isCatalog = path === 'admin/produtos';
  const isBulkImport = path === 'admin/produtos/importar';
  const isDashboard = path === 'admin/dashboard';
  const isHomeSettings = path === 'admin/pagina-inicial';
  const navItems = [
    { href: '#/admin/dashboard', label: 'Visão geral', icon: SquaresFour, active: isDashboard },
    { href: '#/admin/pagina-inicial', label: 'Página inicial', icon: House, active: isHomeSettings },
    { href: '#/admin/produtos', label: 'Catálogo', icon: Package, active: isCatalog || !!editingMatch },
    { href: '#/admin/produtos/novo', label: 'Nova armação', icon: Plus, active: isNew },
    { href: '#/admin/produtos/importar', label: 'Importar em lote', icon: UploadSimple, active: isBulkImport },
    { href: '#/admin/acesso', label: 'Regras e acesso', icon: ShieldCheck, active: isAccess },
  ];

  return <div className="admin-workspace min-h-screen bg-[#f6f7f4] text-[#18392d] lg:pl-64">
    <aside className={'bg-[#0c251d] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 flex-col p-5 lg:p-6 z-50 ' + (isEditor ? 'hidden lg:flex' : 'flex')}>
      <a href="#/admin/dashboard" className="self-start"><Logo variant="light" size="sm" showSlogan={false} /></a>
      <p className="mt-7 mb-3 text-[10px] tracking-[0.2em] uppercase text-[#9dae9e]">Área de gestão</p>
      <nav aria-label="Navegação administrativa" className="flex lg:flex-col gap-1 overflow-x-auto">{navItems.map(item => <a href={item.href} key={item.href} aria-current={item.active ? 'page' : undefined} className={'flex items-center gap-3 px-3 py-3 rounded-xl text-sm whitespace-nowrap transition-colors ' + (item.active ? 'bg-[#d7bb7e] text-[#173629] font-semibold' : 'text-stone-300 hover:bg-white/10 hover:text-white')}><item.icon size={19} /><span>{item.label}</span></a>)}</nav>
      <div className="lg:mt-auto pt-6 mt-4 border-t border-white/10">
        <a href="#/" className="flex items-center gap-3 text-sm text-stone-300 hover:text-white py-2">Ver loja online <ArrowUpRight size={17} /></a>
        <div className="hidden lg:block my-5"><p className="text-xs text-[#9dae9e]">Administrador</p><p className="text-xs mt-1 truncate" title={user.email}>{user.email}</p></div>
        <button onClick={logout} className="flex items-center gap-3 text-sm text-stone-300 hover:text-white py-2"><SignOut size={18} /> Encerrar sessão</button>
      </div>
    </aside>
    <main id="admin-content">
      {notice && <p role="alert" className="m-6 bg-red-50 text-red-800 rounded-xl p-4 text-sm">{notice}</p>}
      {isDashboard ? <AdminDashboardView /> : isHomeSettings ? <AdminHomeSettingsView onSaved={onHomeSettingsUpdated} /> : isAccess ? <AdminAccessView email={user.email} /> : isEditor ? (isNew ? <AdminEditorView key="new" productToEdit={null} onBackToCatalog={() => navigate('#/admin/produtos')} onSaveSuccess={product => {
        const exists = products.some(p => p.id === product.id);
        onProductsUpdated(exists ? products.map(p => p.id === product.id ? product : p) : [product, ...products]);
        navigate('#/admin/produtos');
      }} /> : editingId ? <AdminEditProductPage key={editingId} id={editingId} onBack={() => navigate('#/admin/produtos')} onSaved={product => { onProductsUpdated([...products.filter(item => item.id !== product.id), product]); navigate('#/admin/produtos'); }} /> : null) : isBulkImport ? <AdminBulkImportPage onComplete={onProductsUpdated} /> : isCatalog ? <AdminCatalogView onAddNewProduct={() => navigate('#/admin/produtos/novo')} onEditProduct={id => navigate('#/admin/produtos/' + encodeURIComponent(id) + '/editar')} onDeleteProduct={async id => {
        const result = await deleteProduct(id);
        if (!result.success) throw new Error(result.error || 'Não foi possível excluir o produto.');
        onProductsUpdated(products.filter(p => p.id !== id));
      }} onPreviewProduct={async id => onPreviewProduct(await fetchAdminProductById(id))} /> : <div className="p-10"><h1 className="text-2xl font-semibold">Página não encontrada</h1><a href="#/admin/produtos" className="inline-block mt-5 underline">Voltar ao catálogo</a></div>}
    </main>
  </div>;
};

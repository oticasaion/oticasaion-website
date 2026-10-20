import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { isAdmin } from '../../lib/adminAccess';
import { Logo } from '../Logo';
import { ArrowLeft, ArrowRight, Eye, EyeSlash, Lock, ShieldCheck } from '@phosphor-icons/react';

interface AdminLoginViewProps {
  onLoginSuccess: (email: string) => void;
  onBackToStore: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw new Error('Não foi possível entrar. Confira seu e-mail e senha e tente novamente.');
      if (!isAdmin(data.user)) {
        await supabase.auth.signOut({ scope: 'local' });
        throw new Error('Esta conta não tem permissão administrativa. Solicite acesso ao responsável pela loja.');
      }
      onLoginSuccess(data.user!.email || email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível conectar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login min-h-screen bg-[#f6f7f4] text-[#18392d] grid lg:grid-cols-2">
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0c251d] p-14 text-white">
        <div className="absolute -bottom-40 -right-40 w-[640px] h-[640px] rounded-full border border-[#c8a25a]/20 pointer-events-none" aria-hidden="true" />
        <Logo variant="light" size="md" />
        <div className="relative max-w-lg py-20">
          <span className="text-xs tracking-[0.24em] uppercase text-[#d8bd83]">Gestão Óticas Aion</span>
          <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight">Mais clareza para cuidar da sua loja.</h1>
          <p className="mt-6 text-base leading-relaxed text-stone-300">Organize suas armações, atualize os preços e prepare sua vitrine em um só lugar.</p>
          <div className="mt-10 flex items-center gap-3 text-sm text-[#d8bd83]"><ShieldCheck size={22} /> Acesso exclusivo para administradores</div>
        </div>
        <p className="text-xs text-stone-400">Óticas Aion · Visão que permanece.</p>
      </aside>
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <button onClick={onBackToStore} className="inline-flex items-center gap-2 self-start text-sm text-stone-600 hover:text-[#0c251d]"><ArrowLeft size={17} /> Voltar para a loja</button>
        <div className="w-full max-w-md m-auto py-16">
          <div className="lg:hidden mb-10"><Logo variant="dark" size="md" /></div>
          <div className="w-12 h-12 rounded-2xl bg-[#e6ece5] flex items-center justify-center"><Lock size={23} /></div>
          <h2 className="text-3xl font-semibold mt-6 tracking-tight">Bem-vindo de volta</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">Entre com sua conta autorizada para acessar o painel da loja.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={isLoading}>
            <div><label htmlFor="admin-email" className="block text-sm font-medium mb-2">E-mail</label><input id="admin-email" name="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu e-mail de acesso" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base" /></div>
            <div><label htmlFor="admin-password" className="block text-sm font-medium mb-2">Senha</label><div className="relative"><input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-14 text-base" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute right-1 top-1 p-3 text-stone-500">{showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}</button></div></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</p>}
            <button disabled={isLoading} type="submit" className="w-full flex justify-center items-center gap-3 rounded-xl bg-[#0c251d] hover:bg-[#1c4435] py-3.5 text-sm font-semibold text-white disabled:opacity-60">{isLoading ? 'Entrando…' : 'Entrar no painel'}<ArrowRight size={18} /></button>
          </form>
          <p className="mt-8 border-t border-stone-200 pt-6 text-xs leading-relaxed text-stone-500">O painel aceita apenas contas autorizadas. Para obter ou recuperar seu acesso, fale com o responsável pela loja.</p>
        </div>
      </main>
    </div>
  );
};

import React from 'react';
import { CheckCircle, Lock, ShieldCheck, UserCircle } from '@phosphor-icons/react';

export const AdminAccessView: React.FC<{ email?: string }> = ({ email }) => <div className="max-w-5xl mx-auto p-5 sm:p-8 lg:p-10">
  <p className="admin-eyebrow">Controle e responsabilidade</p>
  <h1 className="text-3xl font-semibold tracking-tight mt-2">Regras e acesso</h1>
  <p className="text-sm text-stone-500 mt-3">Conheça as permissões e as regras de uso do painel.</p>
  <div className="admin-card p-6 mt-8 flex gap-4 items-center"><UserCircle size={42} className="text-[#6b886d] shrink-0" /><div className="min-w-0"><p className="text-xs text-stone-500">Conta conectada</p><p className="font-semibold break-all mt-1">{email}</p><span className="admin-badge inline-block mt-2">Administrador</span></div></div>
  <div className="grid sm:grid-cols-2 gap-5 mt-6">
    {[{ icon: Lock, title: 'Somente login', text: 'Não é possível criar uma conta pelo site. O acesso é reservado às contas autorizadas pelo responsável pela loja.' },
      { icon: ShieldCheck, title: 'Permissão administrativa', text: 'Entrar com e-mail e senha não basta. A conta também precisa ter a permissão de administrador para abrir o painel e salvar alterações.' },
      { icon: CheckCircle, title: 'Publicação consciente', text: 'Revise fotos, medidas, preços e descontos antes de salvar. A exclusão de uma armação exige confirmação.' },
      { icon: UserCircle, title: 'Cuide da sua sessão', text: 'Use uma conta individual, mantenha sua senha em sigilo e encerre a sessão ao usar um computador compartilhado.' },
    ].map(rule => <section key={rule.title} className="admin-card p-6"><rule.icon size={23} className="text-[#6b886d]" /><h2 className="font-semibold mt-4">{rule.title}</h2><p className="text-sm leading-relaxed text-stone-500 mt-2">{rule.text}</p></section>)}
  </div>
</div>;

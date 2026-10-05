import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { AdminProductManager } from './AdminProductManager';
import {
  Lock,
  Mail,
  Key,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: (updatedList: Product[]) => void;
  onPreviewProduct: (product: Product) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
  onPreviewProduct,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Check existing session
  useEffect(() => {
    if (!isOpen) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user.email);
      } else {
        setIsAuthenticated(false);
        setCurrentUserEmail(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isRegisterMode) {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setIsAuthenticated(true);
          setCurrentUserEmail(data.user?.email);
          setSuccessMessage('Conta administrativa criada com sucesso!');
        } else {
          setSuccessMessage('Cadastro realizado! Se o e-mail de confirmação estiver ativado no Supabase, verifique sua caixa de entrada.');
        }
      } else {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // Provide friendly Portuguese message
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('E-mail ou senha incorretos no Supabase.');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('E-mail ainda não confirmado no Supabase.');
          }
          throw error;
        }

        if (data.user) {
          setIsAuthenticated(true);
          setCurrentUserEmail(data.user.email);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUserEmail(undefined);
  };

  // If already authenticated with Supabase, render the Product Manager directly
  if (isAuthenticated) {
    return (
      <AdminProductManager
        products={products}
        onProductsUpdated={onProductsUpdated}
        onClose={onClose}
        onLogout={handleLogout}
        userEmail={currentUserEmail}
        onPreviewProduct={onPreviewProduct}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="bg-[#0c251d] text-white p-6 border-b border-[#c8a25a]/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c8a25a]/20 border border-[#c8a25a]/40 flex items-center justify-center text-[#c8a25a]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c8a25a]">
                Painel Restrito
              </span>
              <h3 className="text-lg font-bold font-serif-brand">
                {isRegisterMode ? 'Criar Usuário Admin' : 'Acesso do Lojista'}
              </h3>
            </div>
          </div>
          <p className="text-xs text-stone-300 mt-2">
            Autenticação via Supabase para gerenciamento de catálogo e preços.
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                E-mail do Supabase
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@oticasaion.com.br"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0c251d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0c251d]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0c251d] hover:bg-[#12362b] text-[#c8a25a] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Conectando ao Supabase...' : isRegisterMode ? 'Cadastrar Administrador' : 'Entrar no Painel'}</span>
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="pt-2 text-center border-t border-stone-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-stone-600 hover:text-stone-900 font-semibold"
            >
              {isRegisterMode
                ? 'Já possui usuário no Supabase? Fazer Login'
                : 'Novo lojista? Criar primeiro usuário admin'}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 text-center text-[11px] text-stone-500">
          Protegido com criptografia ponta a ponta e Supabase Auth.
        </div>
      </div>
    </div>
  );
};

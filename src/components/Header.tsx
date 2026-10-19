import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { List, X, ShieldCheck, Truck, Sparkle, CheckCircle } from '@phosphor-icons/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeaderProps {
  onWhatsAppClick: (customText?: string) => void;
  onNavigate: (view: 'home' | 'catalog' | 'terms-policy') => void;
  currentView?: 'home' | 'catalog' | 'product-detail' | 'terms-policy';
}

export const Header: React.FC<HeaderProps> = ({
  onWhatsAppClick,
  onNavigate,
  currentView = 'home',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  const handleSectionClick = (anchor: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector(anchor);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(anchor);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Notification Announcement Bar - Sits at page top and scrolls up naturally on scroll */}
      <div className="bg-[#081a14] text-[#e7d7b5] text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#c8a25a]/20 relative z-30">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Display: Consolidated high-converting message */}
          <div className="flex sm:hidden items-center justify-center text-center font-bold tracking-tight text-[11px] text-[#e7d7b5]">
            <span>Envio Nacional, 7 dias de garantia e 5% Off no Pix</span>
          </div>

          {/* Tablet/Desktop Display: Distributed items */}
          <div className="hidden sm:flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 sm:gap-6 font-bold scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <Truck className="w-3.5 h-3.5 text-[#c8a25a]" />
              <span>Envio Nacional • <strong>Entrega em até 7 dias</strong></span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c8a25a]" />
              <span><strong>7 Dias de Garantia</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <Sparkle className="w-3.5 h-3.5 text-[#c8a25a]" />
              <span>Até <strong>50% mais econômico</strong></span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>5% OFF no PIX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full shadow-md">
        <div className="bg-[#0c251d] text-white backdrop-blur-md bg-opacity-95 border-b border-[#c8a25a]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center focus:outline-none text-left"
          >
            {/* Logo adapts size */}
            <div className="block sm:hidden">
              <Logo variant="light" size="sm" showSlogan={false} />
            </div>
            <div className="hidden sm:block">
              <Logo variant="light" size="md" />
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-bold text-stone-200">
            <button
              onClick={() => onNavigate('home')}
              className={`whitespace-nowrap transition-colors py-1 hover:text-[#c8a25a] ${
                currentView === 'home' ? 'text-[#c8a25a] font-bold border-b-2 border-[#c8a25a]' : ''
              }`}
            >
              Início
            </button>

            <button
              onClick={() => onNavigate('catalog')}
              className={`whitespace-nowrap transition-colors py-1 hover:text-[#c8a25a] ${
                currentView === 'catalog' ? 'text-[#c8a25a] font-bold border-b-2 border-[#c8a25a]' : ''
              }`}
            >
              Catálogo de Armações
            </button>

            <button
              onClick={() => handleSectionClick('#como-funciona')}
              className="whitespace-nowrap transition-colors py-1 hover:text-[#c8a25a]"
            >
              Como Funciona
            </button>

            <button
              onClick={() => handleSectionClick('#comparativo')}
              className="whitespace-nowrap transition-colors py-1 hover:text-[#c8a25a]"
            >
              Por Que a Aion?
            </button>

            <button
              onClick={() => onNavigate('terms-policy')}
              className={`whitespace-nowrap transition-colors py-1 hover:text-[#c8a25a] ${
                currentView === 'terms-policy' ? 'text-[#c8a25a] font-bold border-b-2 border-[#c8a25a]' : ''
              }`}
            >
              Políticas & Termos
            </button>

            <button
              onClick={() => handleSectionClick('#faq')}
              className="whitespace-nowrap transition-colors py-1 hover:text-[#c8a25a]"
            >
              Dúvidas Frequentes
            </button>
          </nav>

          {/* Action Button & Mobile icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick WhatsApp button on desktop (hidden on mobile to prevent duplicate with floating button) */}
            <button
              onClick={() =>
                onWhatsAppClick('Olá! Gostaria de consultar armações e tirar dúvidas sobre óculos de grau na Óticas Aion.')
              }
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-md transition-all active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Enviar Receita</span>
            </button>

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-200 hover:text-white hover:bg-white/10 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 sm:top-20 z-50 lg:hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0a1e17] border-b border-[#c8a25a]/30 px-6 py-6 space-y-6 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => handleLinkClick(() => onNavigate('home'))}
                className={`text-left text-base font-bold py-3.5 border-b border-white/5 px-2 rounded-lg flex items-center justify-between ${
                  currentView === 'home' ? 'text-[#c8a25a]' : 'text-stone-200'
                }`}
              >
                <span>Início</span>
                <span className="text-stone-500 text-xs">→</span>
              </button>

              <button
                onClick={() => handleLinkClick(() => onNavigate('catalog'))}
                className={`text-left text-base font-bold py-3.5 border-b border-white/5 px-2 rounded-lg flex items-center justify-between ${
                  currentView === 'catalog' ? 'text-[#c8a25a]' : 'text-stone-200'
                }`}
              >
                <span>Catálogo Completo</span>
                <span className="text-stone-500 text-xs">→</span>
              </button>

              <button
                onClick={() => handleSectionClick('#como-funciona')}
                className="text-left text-stone-200 hover:text-[#c8a25a] text-base font-bold py-3.5 border-b border-white/5 px-2 rounded-lg flex items-center justify-between"
              >
                <span>Como Funciona o Envio da Receita</span>
                <span className="text-stone-500 text-xs">→</span>
              </button>

              <button
                onClick={() => handleSectionClick('#comparativo')}
                className="text-left text-stone-200 hover:text-[#c8a25a] text-base font-bold py-3.5 border-b border-white/5 px-2 rounded-lg flex items-center justify-between"
              >
                <span>Por Que a Aion?</span>
                <span className="text-stone-500 text-xs">→</span>
              </button>

              <button
                onClick={() => handleLinkClick(() => onNavigate('terms-policy'))}
                className={`text-left text-base font-bold py-3.5 border-b border-white/5 px-2 rounded-lg flex items-center justify-between ${
                  currentView === 'terms-policy' ? 'text-[#c8a25a]' : 'text-stone-200'
                }`}
              >
                <span>Políticas de Privacidade & Termos</span>
                <span className="text-stone-500 text-xs">→</span>
              </button>

              <button
                onClick={() => handleSectionClick('#faq')}
                className="text-left text-stone-200 hover:text-[#c8a25a] text-base font-bold py-3.5 border-b border-white/5 px-2 rounded-lg flex items-center justify-between"
              >
                <span>Perguntas Frequentes (FAQ)</span>
                <span className="text-stone-500 text-xs">→</span>
              </button>
            </nav>

            <div className="pt-2 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onWhatsAppClick('Olá! Gostaria de enviar minha receita e ver as armações disponíveis.');
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg active:scale-95 text-sm"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>Chamar no WhatsApp com Receita</span>
              </button>

              <div className="text-center text-xs text-stone-400 pt-2">
                Atendimento humanizado de Segunda a Sábado
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

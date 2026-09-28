import React, { useState } from 'react';
import { Logo } from './Logo';
import { MessageCircle, Menu, X, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onWhatsAppClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Lentes Oftálmicas', href: '#lentes' },
    { label: 'Por Que a Aion?', href: '#comparativo' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#081a14] text-[#e7d7b5] text-xs font-medium py-2 px-4 border-b border-[#c8a25a]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto whitespace-nowrap gap-6 scrollbar-none">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span>Envio para todo o Brasil • <strong>Entrega em até 7 dias úteis</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span>Até <strong>50% mais econômico</strong> que óticas físicas</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span><strong>7 Dias de Garantia</strong> de Adaptação</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>5% de Desconto no PIX</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#0c251d] text-white backdrop-blur-md bg-opacity-95 border-b border-[#c8a25a]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <Logo variant="light" size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#c8a25a] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a25a] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onWhatsAppClick('Olá! Gostaria de consultar armações e tirar dúvidas sobre óculos de grau na Óticas Aion.')}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enviar Receita</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-200 hover:text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1e17] border-b border-[#c8a25a]/30 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-200 hover:text-[#c8a25a] text-base font-medium py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onWhatsAppClick('Olá! Gostaria de enviar minha receita e ver as armações disponíveis.');
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3 px-4 rounded-xl shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chamar no WhatsApp com Receita</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Truck, Lock, CreditCard, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onWhatsAppClick }) => {
  return (
    <footer className="bg-[#081a14] text-stone-300 pt-16 pb-12 border-t border-[#c8a25a]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed mt-2">
              A Óticas Aion nasceu com a missão de tornar a saúde visual e o conforto estético acessíveis a todos, unindo armações premium em titânio e lentes oftálmicas de alta definição direto na sua casa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-stone-400">Atendimento humanizado:</span>
              <button
                onClick={() => onWhatsAppClick('Olá! Gostaria de falar com o atendimento da Óticas Aion.')}
                className="inline-flex items-center gap-1.5 text-xs text-[#c8a25a] hover:underline font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Oficial</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#c8a25a]">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#catalogo" className="hover:text-white transition">Catálogo de Armações</a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition">Como Funciona o Envio da Receita</a>
              </li>
              <li>
                <a href="#comparativo" className="hover:text-white transition">Por Que a Aion é Mais Barata</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition">Opiniões de Clientes Reais</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">Perguntas Frequentes (FAQ)</a>
              </li>
            </ul>
          </div>

          {/* Security & Benefits Badges */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#c8a25a]">
              Segurança & Compromisso
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#c8a25a] shrink-0" />
                <span>Garantia de 7 Dias de Adaptação</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Entrega em até 7 dias úteis</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#c8a25a] shrink-0" />
                <span>Compra Segura & Dados Protegidos</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>PIX 5% OFF ou 12x no Cartão</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4 text-center sm:text-left">
          <div>
            <p>© {new Date().getFullYear()} Óticas Aion. Todos os direitos reservados.</p>
            <p className="mt-0.5">As receitas médicas oftálmicas são manipuladas em laboratório homologado com surfaçagem digital.</p>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Visão que permanece.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

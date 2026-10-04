import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles, MessageCircle, ArrowRight, Check } from 'lucide-react';

interface HeroProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onWhatsAppClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0c251d] via-[#091d17] to-[#061410] text-white pt-8 pb-14 sm:pt-16 sm:pb-24">
      {/* Background Decorative Gold Light Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-[#c8a25a]/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-60 sm:w-96 h-60 sm:h-96 bg-[#1a4a3b]/30 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] font-serif-brand">
              Seu óculos de grau completo sem sair de casa e com{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5e48e] via-[#c8a25a] to-[#e5c77a]">
                até 50% de economia
              </span>.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Armações em titânio e acetato nobre com lentes oftálmicas de laboratório. Escolha seu modelo, envie a receita pelo WhatsApp e receba em até 7 dias úteis com <strong>garantia de adaptação de 7 dias</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1 sm:pt-2">
              <a
                href="#catalogo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c8a25a] hover:bg-[#d8b56d] text-[#071d16] font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl shadow-[#c8a25a]/20 transition-all active:scale-95 text-center"
              >
                <span>Escolher Minha Armação</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              <button
                onClick={() =>
                  onWhatsAppClick(
                    'Olá! Tenho minha receita oftálmica e gostaria de um orçamento para óculos de grau completo.'
                  )
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-[#25D366]/25 transition-all active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0" />
                <span>Enviar Receita no WhatsApp</span>
              </button>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="pt-4 sm:pt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 border-t border-white/10 text-xs sm:text-sm text-stone-300 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Medição DNP guiada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Sem custo de loja física</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Entrega em até 7 dias úteis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#c8a25a] text-[#0c251d] font-bold text-[10px] sm:text-xs uppercase px-3.5 py-1 rounded-bl-xl tracking-wider shadow">
                  Mais Vendido
                </div>

                <div className="pt-2 sm:pt-4 pb-2 text-center">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c8a25a] font-semibold">
                    Modelo em Destaque
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif-brand font-bold text-white mt-0.5">
                    Aion Aetherium Titanium
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-300">
                    Titânio Aeroespacial • Apenas 13 gramas
                  </p>
                </div>

                <div className="relative my-3 sm:my-4 aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900/60 border border-white/10 flex items-center justify-center p-3">
                  <img
                    src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"
                    alt="Óculos de Grau Aion Aetherium"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-[#0c251d]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="truncate">Lentes Antirreflexo + Antirrisco inclusas</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-stone-400 line-through">De R$ 159,00</span>
                    <div className="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1">
                      <span>R$ 141,55</span>
                      <span className="text-[10px] sm:text-xs text-[#c8a25a] font-semibold">no PIX</span>
                    </div>
                  </div>
                  <a
                    href="#catalogo"
                    className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-white/20 transition"
                  >
                    <span>Ver no Catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Floating Guarantee Badge */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-5 bg-[#0c251d] border-2 border-[#c8a25a] rounded-2xl p-3 sm:p-3.5 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c8a25a]/20 flex items-center justify-center text-[#c8a25a] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Garantia de 7 Dias de Adaptação
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-300 leading-tight mt-0.5">
                    Não adaptou? Devolução ou troca sem complicação.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

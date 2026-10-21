import React from 'react';
import { Camera, Ruler, ShieldCheck, ArrowRight } from '@phosphor-icons/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FinalCtaProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onWhatsAppClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c251d] via-[#091f18] to-[#061410] text-white py-16 sm:py-20 lg:py-24 border-t border-[#c8a25a]/30">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8a25a]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow */}
        <span className="inline-block text-xs uppercase tracking-widest font-bold text-[#c8a25a] bg-[#c8a25a]/10 border border-[#c8a25a]/30 px-3.5 py-1.5 rounded-full mb-5">
          Atendimento Personalizado
        </span>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif-brand tracking-tight text-balance">
          Já tem sua receita médica em mãos?
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-stone-300 max-w-2xl mx-auto text-pretty leading-relaxed">
          Envie uma foto da sua receita no WhatsApp. Nossa equipe técnica analisa seu grau, ajuda a escolher o modelo ideal e envia seu orçamento em minutos — sem compromisso.
        </p>

        {/* 3 Trust Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mt-8 sm:mt-10 text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8a25a]/20 text-[#c8a25a] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-[#c8a25a]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Basta uma foto nítida</p>
              <p className="text-[11px] text-stone-400">Análise técnica imediata</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8a25a]/20 text-[#c8a25a] flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5 text-[#c8a25a]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Medição precisa da DNP</p>
              <p className="text-[11px] text-stone-400">Guia passo a passo pelo chat</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c8a25a]/20 text-[#c8a25a] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#c8a25a]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">7 dias de garantia</p>
              <p className="text-[11px] text-stone-400">Adaptação 100% garantida</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() =>
              onWhatsAppClick(
                'Olá! Tenho minha receita em mãos e gostaria de receber um orçamento de óculos de grau completo.'
              )
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-xl shadow-[#25D366]/20 transition-all active:scale-95 text-center"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
            <span>Enviar Minha Receita no WhatsApp</span>
          </button>

          <a
            href="#catalogo"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('catalogo');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base px-6 py-4 rounded-xl border border-white/20 transition-all active:scale-95 text-center"
          >
            <span>Explorar Armações</span>
            <ArrowRight className="w-4 h-4 text-[#c8a25a]" />
          </a>
        </div>

        <p className="text-xs text-stone-400 mt-5">
          Atendimento humanizado de Segunda a Sábado · Resposta média em menos de 10 minutos
        </p>
      </div>
    </section>
  );
};

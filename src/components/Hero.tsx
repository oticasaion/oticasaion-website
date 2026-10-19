import React from 'react';
import { ShieldCheck, ArrowRight, Check } from '@phosphor-icons/react';
import { ImageWithFade } from './ImageWithFade';

interface HeroProps {
  onWhatsAppClick?: (customText?: string) => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0c251d] via-[#091d17] to-[#061410] text-white pt-4 pb-14 sm:pt-8 sm:pb-20 lg:py-28 min-h-[540px] lg:min-h-[660px] xl:min-h-[720px] flex items-center">
      
      {/* Background Decorative Ambient Gold Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-[#c8a25a]/10 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-60 sm:w-96 h-60 sm:h-96 bg-[#1a4a3b]/25 rounded-full blur-[90px] pointer-events-none" />

      {/* Desktop Expansive Image Layer with Progressive Left Fade */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%] xl:w-[56%] 2xl:w-[58%] h-full pointer-events-none select-none z-0 overflow-hidden">
        
        {/* Physical Gradient Mask on the Image Container */}
        <div 
          className="w-full h-full relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.65) 24%, rgba(0,0,0,0.95) 38%, black 50%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.65) 24%, rgba(0,0,0,0.95) 38%, black 50%)'
          }}
        >
          <ImageWithFade
            src="./branding/hero-conexao-aion.webp"
            alt="Casal sorrindo com óculos de grau da Óticas Aion"
            loading="eager"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-[35%_center] lg:object-[38%_center] xl:object-[40%_center]"
          />
        </div>

        {/* Left Fade Gradient Overlays for Maximum Contrast & Smooth Blend */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0c251d] via-[#0c251d]/85 to-transparent pointer-events-none" />
        
        {/* Top and Bottom soft edge blend */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0c251d] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061410] to-transparent pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 text-center lg:text-left w-full max-w-full lg:max-w-2xl xl:max-w-3xl mx-auto lg:mx-0">
            
            {/* Mobile View: Hero Image directly below Header with 360° soft feather/fade on all edges & corners */}
            <div className="block lg:hidden -mx-3.5 xs:-mx-4 sm:mx-0 mb-4 sm:mb-6 relative">
              <div 
                className="relative overflow-hidden w-full aspect-[16/10] sm:aspect-[16/9]"
                style={{
                  maskImage: 'radial-gradient(ellipse 92% 86% at 50% 50%, black 45%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.3) 82%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 92% 86% at 50% 50%, black 45%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.3) 82%, transparent 98%)',
                }}
              >
                <ImageWithFade
                  src="./branding/hero-conexao-aion.webp"
                  alt="Casal sorrindo com óculos de grau da Óticas Aion"
                  loading="eager"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover object-center"
                />

                {/* Quad-directional soft vignette overlays for seamless blend into emerald backdrop */}
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0c251d] via-[#0c251d]/50 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0c251d] via-[#0c251d]/60 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0c251d] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0c251d] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] font-sans-brand">
              A beleza de enxergar com nitidez e a alegria de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5e48e] via-[#c8a25a] to-[#e5c77a]">
                viver cada conexão
              </span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed text-pretty">
              Armações em titânio e acetato nobre com lentes oftálmicas de laboratório. Escolha seu modelo, envie a receita pelo WhatsApp e receba em casa com total segurança.
            </p>

            {/* CTAs & Price Anchor */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#c8a25a] hover:bg-[#d8b56d] text-[#071d16] font-bold text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-[#c8a25a]/20 transition-all active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c8a25a]"
                >
                  <span>Escolher minha armação</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>

              <p className="text-xs text-stone-400 pt-0.5">
                Armação + lentes com grau completo a partir de{' '}
                <span className="text-[#c8a25a] font-semibold">R$ 75,05 no PIX</span>
              </p>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 border-t border-white/10 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#c8a25a] shrink-0" />
                <span>Medição DNP guiada</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c8a25a] shrink-0" />
                <span>Garantia de 7 dias de adaptação</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#c8a25a] shrink-0" />
                <span>Entrega em até 7 dias úteis</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

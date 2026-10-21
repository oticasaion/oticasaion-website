import React from 'react';
import { Eyeglasses, Camera, Truck, ShieldCheck, ArrowRight } from '@phosphor-icons/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HowItWorksProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onWhatsAppClick }) => {
  const steps = [
    {
      step: '01',
      icon: Eyeglasses,
      title: 'Escolha sua armação',
      description: 'Navegue pelo nosso catálogo e selecione o modelo e a cor que combinam com o seu formato de rosto e rotina.',
    },
    {
      step: '02',
      icon: Camera,
      title: 'Envie a receita no WhatsApp',
      description: 'Basta enviar uma foto da sua receita médica. Nossa equipe confere os parâmetros e auxilia na medição da DNP.',
    },
    {
      step: '03',
      icon: Truck,
      title: 'Receba em até 7 dias úteis',
      description: 'As lentes são surfaçadas com corte digital laboratorial e despachadas para sua casa com código de rastreio.',
    },
    {
      step: '04',
      icon: ShieldCheck,
      title: '7 dias de garantia de adaptação',
      description: 'Use seus óculos no dia a dia. Se houver qualquer desconforto visual ou com a armação, realizamos a troca ou devolução.',
    },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 lg:py-24 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header without redundant AI pill */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand tracking-tight text-balance">
            Como funciona o pedido
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto text-pretty leading-relaxed">
            Sem perda de tempo com deslocamentos ou preços de shopping. O processo é simples, transparente e acompanhado por consultores ópticos no WhatsApp.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#fcfbf9] rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Step number */}
                  <span className="text-4xl font-extrabold font-serif-brand text-stone-200 group-hover:text-[#c8a25a]/50 transition-colors">
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div className="w-13 h-13 rounded-2xl bg-[#0c251d] text-[#c8a25a] flex items-center justify-center my-4 shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif-brand">
                    {item.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center text-xs font-semibold text-stone-500 group-hover:text-[#0c251d] transition">
                  <span>Passo {index + 1} de 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-[#c8a25a]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* DNP Measurement Spotlight Box */}
        <div className="mt-12 sm:mt-16 bg-[#0c251d] text-white rounded-3xl p-6 sm:p-10 border border-[#c8a25a]/30 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs text-[#c8a25a] font-medium block">
              Esclarecimento técnico
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-balance">
              Como medimos a sua DNP (Distância Naso-Pupilar)?
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed text-pretty">
              A DNP é a distância exata entre o centro de cada pupila e o nariz, indispensável para centralizar o foco óptico. Pelo WhatsApp, enviamos instruções em foto com referência milimétrica. Nossa equipe afere as medidas antes do envio para o laboratório.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <button
              onClick={() => onWhatsAppClick('Olá! Gostaria de saber como é feita a medição da DNP para fazer meu óculos de grau.')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
              <span>Tirar dúvidas sobre a DNP</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Glasses, FileText, Camera, Truck, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onWhatsAppClick }) => {
  const steps = [
    {
      step: '01',
      icon: Glasses,
      title: 'Escolha sua Armação',
      description: 'Navegue pelo nosso catálogo virtual e selecione o modelo e a cor que combinam com o formato do seu rosto e estilo.',
    },
    {
      step: '02',
      icon: Camera,
      title: 'Envie a Receita no WhatsApp',
      description: 'Basta tirar uma foto da sua receita oftalmológica. Nossa equipe faz a conferência técnica e ajuda você a tirar a medida da DNP em 1 minuto.',
    },
    {
      step: '03',
      icon: Truck,
      title: 'Receba em até 7 Dias Úteis',
      description: 'Montamos suas lentes com corte digital de precisão e despachamos para sua casa com frete seguro e rastreamento ponto a ponto.',
    },
    {
      step: '04',
      icon: ShieldCheck,
      title: '7 Dias de Garantia de Adaptação',
      description: 'Experimente seus óculos no dia a dia. Se o grau causar desconforto ou você não gostar da armação, trocamos ou devolvemos seu dinheiro.',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#c8a25a] block mb-2">
            Simples, Rápido e Seguro
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand">
            Como Funciona o Pedido na Óticas Aion
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Você não precisa perder tempo indo até uma ótica de shopping nem pagar o dobro do preço. Todo o atendimento é guiado por especialistas no WhatsApp.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#fcfbf9] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Step number watermark */}
                  <span className="text-4xl font-extrabold font-serif-brand text-stone-200 group-hover:text-[#c8a25a]/40 transition-colors">
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#0c251d] text-[#c8a25a] flex items-center justify-center my-4 shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif-brand">
                    {item.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center text-xs font-bold text-[#0c251d] group-hover:text-[#c8a25a] transition">
                  <span>Passo {index + 1} de 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </div>
            );
          })}
        </div>

        {/* DNP Measurement Spotlight Box */}
        <div className="mt-16 bg-[#0c251d] text-white rounded-3xl p-8 lg:p-10 border border-[#c8a25a]/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#c8a25a]">
              Tira-Dúvidas Técnico
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand">
              Como medimos a sua DNP (Distância Naso-Pupilar)?
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              A DNP é a distância exata entre suas pupilas, essencial para centralizar o grau da lente no ponto focal do seu olho. No WhatsApp, enviamos um tutorial em vídeo e foto guiada com cartão ou régua milimétrica. Nossa equipe afere a medida com precisão digital antes do corte no laboratório!
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <button
              onClick={() => onWhatsAppClick('Olá! Gostaria de saber como é feita a medição da DNP para fazer meu óculos de grau.')}
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-4 rounded-xl shadow-lg transition active:scale-95 text-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Tirar Dúvida sobre a DNP</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

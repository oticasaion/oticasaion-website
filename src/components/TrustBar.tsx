import React from 'react';
import { ShieldCheck, Truck, Sparkle, ChatCircleDots, CreditCard } from '@phosphor-icons/react';

export const TrustBar: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: '7 Dias de Garantia',
      subtitle: 'Adaptação total ou troca sem burocracia',
    },
    {
      icon: Truck,
      title: 'Frete para Todo Brasil',
      subtitle: 'Envio seguro com código de rastreio',
    },
    {
      icon: Sparkle,
      title: 'Lentes com UV400',
      subtitle: 'Antirreflexo e proteção nas opções',
    },
    {
      icon: ChatCircleDots,
      title: 'Suporte no WhatsApp',
      subtitle: 'Consultoria e conferência da receita',
    },
    {
      icon: CreditCard,
      title: 'Até 12x ou 5% no PIX',
      subtitle: 'Condições transparentes de pagamento',
    },
  ];

  return (
    <section aria-label="Benefícios e garantias" className="bg-[#081a14] text-stone-200 border-y border-[#c8a25a]/25 py-6 sm:py-7 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-start sm:items-center gap-3 ${
                  index === benefits.length - 1 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#c8a25a]/15 text-[#c8a25a] border border-[#c8a25a]/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#c8a25a]" weight="bold" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-400 leading-tight mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

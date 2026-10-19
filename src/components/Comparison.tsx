import React from 'react';
import { Check, X } from '@phosphor-icons/react';

export const Comparison: React.FC = () => {
  const comparisonItems = [
    {
      feature: 'Preço final do óculos completo',
      aion: 'Até 50% mais em conta (sem repassar custos de aluguel de shopping ou vitrines caras)',
      traditional: 'Margens elevadas para cobrir custos fixos e taxas de franquia de lojas físicas',
    },
    {
      feature: 'Comodidade no atendimento',
      aion: '100% online pelo WhatsApp, no seu tempo e com consultor óptico dedicado',
      traditional: 'Necessidade de deslocamento, trânsito, estacionamento e vendedores insistentes',
    },
    {
      feature: 'Prazo de entrega',
      aion: 'Pronto e entregue em sua residência em até 7 dias úteis com rastreamento',
      traditional: 'Frequentemente de 15 a 20 dias úteis, exigindo retirada presencial',
    },
    {
      feature: 'Tratamentos das lentes',
      aion: 'Antirreflexo, antirrisco e proteção UV400 já contemplados nas opções',
      traditional: 'Cobrados à parte como adicionais que encarecem a compra final',
    },
    {
      feature: 'Garantia de adaptação',
      aion: '7 dias incondicionais: se não adaptar ao grau ou armação, trocamos ou devolvemos',
      traditional: 'Processo burocrático com semanas de espera para análise técnica em garantia',
    },
    {
      feature: 'Condições de pagamento',
      aion: 'Desconto de 5% à vista no PIX ou até 12x no cartão de crédito',
      traditional: 'Condições promocionais frequentemente condicionadas a juros embutidos',
    },
  ];

  return (
    <section id="comparativo" className="py-16 sm:py-20 lg:py-24 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header without redundant AI pill */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand tracking-tight text-balance">
            Por que escolher a Óticas Aion?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 px-2 text-pretty leading-relaxed">
            Eliminamos os altos custos de estruturas físicas para entregar armações nobres e lentes oftálmicas de laboratório pelo preço justo.
          </p>
        </div>

        {/* Mobile View: Comparison Cards */}
        <div className="sm:hidden space-y-3">
          {comparisonItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900">
                {item.feature}
              </h4>

              {/* Aion */}
              <div className="bg-[#0c251d]/5 rounded-xl p-2.5 flex items-start gap-2 border border-[#0c251d]/10">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check weight="bold" className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-[11px] font-bold text-[#0c251d] block">Óticas Aion:</strong>
                  <span className="text-xs text-stone-700 leading-snug">{item.aion}</span>
                </div>
              </div>

              {/* Traditional */}
              <div className="bg-stone-50 rounded-xl p-2.5 flex items-start gap-2 border border-stone-200/60">
                <div className="w-4 h-4 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X weight="bold" className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-[11px] font-bold text-stone-500 block">Ótica de shopping:</strong>
                  <span className="text-xs text-stone-500 leading-snug">{item.traditional}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Comparison Table */}
        <div className="hidden sm:block bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-stone-100 text-xs sm:text-sm font-bold border-b border-stone-200">
            <div className="col-span-4 p-4 sm:p-5 text-stone-600">
              Critério
            </div>
            <div className="col-span-4 p-4 sm:p-5 bg-[#0c251d] text-[#c8a25a] flex items-center justify-center gap-1.5 font-serif-brand">
              <span>Óticas Aion</span>
            </div>
            <div className="col-span-4 p-4 sm:p-5 text-stone-500 text-center font-normal">
              Ótica tradicional de shopping
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-stone-100 text-xs sm:text-sm">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 items-stretch hover:bg-stone-50/60 transition">
                <div className="col-span-4 p-4 sm:p-5 font-semibold text-stone-900 flex items-center">
                  {item.feature}
                </div>

                <div className="col-span-4 p-4 sm:p-5 bg-[#0c251d]/5 text-[#0c251d] font-medium flex items-center gap-2.5 border-x border-stone-200/60">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check weight="bold" className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{item.aion}</span>
                </div>

                <div className="col-span-4 p-4 sm:p-5 text-stone-500 flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <X weight="bold" className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{item.traditional}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

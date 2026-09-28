import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const Comparison: React.FC = () => {
  const comparisonItems = [
    {
      feature: 'Preço Final do Óculos Completo',
      aion: 'Até 50% mais barato (sem custos de aluguel de shopping ou vitrine cara)',
      traditional: 'Valores inflacionados com margens altas de loja física',
    },
    {
      feature: 'Comodidade no Atendimento',
      aion: '100% online pelo WhatsApp, no seu tempo e com consultor dedicado',
      traditional: 'Necessidade de deslocamento, trânsito, filas e vendedores insistentes',
    },
    {
      feature: 'Prazo de Entrega',
      aion: 'Pronto e entregue em sua casa em até 7 dias úteis',
      traditional: 'Geralmente 15 a 20 dias úteis, exigindo retirada presencial',
    },
    {
      feature: 'Tratamentos das Lentes',
      aion: 'Anti-Reflexo + Anti-Risco + Proteção UV400 inclusos nas opções',
      traditional: 'Cobrados à parte como "adicionais caros" que encarecem a compra',
    },
    {
      feature: 'Garantia de Adaptação',
      aion: '7 dias incondicionais: se não adaptar, trocamos ou devolvemos',
      traditional: 'Processo burocrático com retenção em garantia de semanas',
    },
    {
      feature: 'Forma de Pagamento',
      aion: 'Desconto extra de 5% no PIX ou até 12x no cartão de crédito',
      traditional: 'Condições engessadas com juros embutidos no preço à vista',
    },
  ];

  return (
    <section id="comparativo" className="py-12 sm:py-20 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c251d]/10 text-[#0c251d] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span>Transparência Total</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand">
            Por Que a Aion é Mais Vantajosa?
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-stone-600 px-2">
            Eliminamos os custos de aluguel de shopping para entregar armações nobres e lentes oftálmicas de alta definição pelo preço justo.
          </p>
        </div>

        {/* Mobile View: Comparison Cards */}
        <div className="sm:hidden space-y-3">
          {comparisonItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                {item.feature}
              </h4>

              {/* Aion */}
              <div className="bg-[#0c251d]/5 rounded-xl p-2.5 flex items-start gap-2 border border-[#0c251d]/10">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <strong className="text-[11px] font-bold text-[#0c251d] block">Óticas Aion:</strong>
                  <span className="text-xs text-stone-700 leading-snug">{item.aion}</span>
                </div>
              </div>

              {/* Traditional */}
              <div className="bg-stone-50 rounded-xl p-2.5 flex items-start gap-2 border border-stone-200/60">
                <div className="w-4 h-4 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <strong className="text-[11px] font-bold text-stone-500 block">Ótica de Shopping:</strong>
                  <span className="text-xs text-stone-500 leading-snug">{item.traditional}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Comparison Table */}
        <div className="hidden sm:block bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-stone-100 text-xs sm:text-sm font-bold border-b border-stone-200">
            <div className="col-span-4 p-4 sm:p-5 text-stone-600">
              Critério
            </div>
            <div className="col-span-4 p-4 sm:p-5 bg-[#0c251d] text-[#c8a25a] flex items-center justify-center gap-1.5">
              <span>Óticas Aion</span>
            </div>
            <div className="col-span-4 p-4 sm:p-5 text-stone-500 text-center">
              Ótica Tradicional de Shopping
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-stone-100 text-xs sm:text-sm">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 items-stretch hover:bg-stone-50/60 transition">
                <div className="col-span-4 p-4 sm:p-5 font-bold text-stone-900 flex items-center">
                  {item.feature}
                </div>

                <div className="col-span-4 p-4 sm:p-5 bg-[#0c251d]/5 text-[#0c251d] font-medium flex items-center gap-2.5 border-x border-stone-200/60">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item.aion}</span>
                </div>

                <div className="col-span-4 p-4 sm:p-5 text-stone-500 flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
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

import React from 'react';
import { Check, X, Sparkles, ShieldCheck } from 'lucide-react';

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
    <section id="comparativo" className="py-20 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c251d]/10 text-[#0c251d] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span>Transparência Total</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand">
            Por Que a Óticas Aion é Mais Vantajosa?
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Eliminamos os intermediários e a estrutura pesada do comércio físico para entregar armações nobres e lentes oftálmicas de laboratório pelo preço justo.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-stone-100 text-xs sm:text-sm font-bold border-b border-stone-200">
            <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 text-stone-600">
              Critério
            </div>
            <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 bg-[#0c251d] text-[#c8a25a] flex items-center justify-center gap-1.5">
              <span>Óticas Aion</span>
            </div>
            <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 text-stone-500 text-center">
              Ótica Tradicional de Shopping
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-stone-100 text-xs sm:text-sm">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 items-stretch hover:bg-stone-50/60 transition">
                
                {/* Feature Label */}
                <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 font-bold text-stone-900 flex items-center">
                  {item.feature}
                </div>

                {/* Aion Side */}
                <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 bg-[#0c251d]/5 text-[#0c251d] font-medium flex items-center gap-2 sm:gap-2.5 border-x border-stone-200/60">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item.aion}</span>
                </div>

                {/* Traditional Side */}
                <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 text-stone-500 flex items-center gap-2 sm:gap-2.5">
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

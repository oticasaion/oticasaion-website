import React from 'react';
import { TESTIMONIALS } from '../data/products';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="py-20 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Satisfação Comprovada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand">
            Quem Compra na Aion Recomenda
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Veja as mensagens e avaliações reais de clientes que confiaram na Óticas Aion para encomendar seus óculos de grau completo online via WhatsApp.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-[#fcfbf9] rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div>
                {/* Header of review: Stars + Verified Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Compra Verificada</span>
                  </span>
                </div>

                {/* Comment */}
                <p className="text-stone-700 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Model Details */}
              <div className="mt-6 pt-4 border-t border-stone-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                  <span className="text-[11px] text-stone-400">{item.date}</span>
                </div>
                <span className="text-xs text-stone-500 block">{item.city}</span>
                <span className="text-[11px] text-[#0c251d] font-medium block mt-1">
                  👓 Modelo: {item.model}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Real Social Proof Callout */}
        <div className="mt-12 text-center text-xs text-stone-500">
          ⭐ Média de <strong>4.9 de 5 estrelas</strong> em avaliações com fotos e feedback direto no WhatsApp.
        </div>

      </div>
    </section>
  );
};

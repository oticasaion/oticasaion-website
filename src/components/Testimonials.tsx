import React from 'react';
import { TESTIMONIALS } from '../data/products';
import { Star, ShieldCheck } from '@phosphor-icons/react';

export const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="py-16 sm:py-20 lg:py-24 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header without redundant AI badge */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand tracking-tight text-balance">
            O que dizem nossos clientes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto text-pretty leading-relaxed">
            Mensagens e avaliações de clientes que encomendaram seus óculos de grau completo online via WhatsApp.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-[#fcfbf9] rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div>
                {/* Header of review: Stars + Verified Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} weight="fill" className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Compra verificada</span>
                  </span>
                </div>

                {/* Comment */}
                <p className="text-stone-700 text-sm leading-relaxed italic">
                  “{item.comment}”
                </p>
              </div>

              {/* Author & Model Details */}
              <div className="mt-6 pt-4 border-t border-stone-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                  <span className="text-xs text-stone-400">{item.date}</span>
                </div>
                <span className="text-xs text-stone-500 block mt-0.5">{item.city}</span>
                <span className="text-xs text-[#0c251d] font-medium block mt-1.5">
                  Modelo: {item.model}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Real Social Proof Callout */}
        <div className="mt-12 text-center text-xs sm:text-sm text-stone-500">
          Média de <strong>4.9 de 5 estrelas</strong> em avaliações com fotos e feedback direto no WhatsApp.
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FaqProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const Faq: React.FC<FaqProps> = ({ onWhatsAppClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Como faço para enviar minha receita médica?',
      answer:
        'É muito simples: nosso site funciona como um catálogo digital. Ao escolher sua armação favorita ou clicar no botão de atendimento, envie uma foto nítida da sua receita oftálmica emitida pelo seu médico. Nossa equipe técnica faz a conferência na hora.',
    },
    {
      question: 'Como é feita a medição da DNP (Distância Naso-Pupilar) à distância?',
      answer:
        'A medição é realizada com auxílio da nossa equipe pelo próprio WhatsApp. Enviamos um guia rápido e simples de como tirar uma foto segurando um cartão ou régua milimétrica abaixo dos olhos. Nossos técnicos calculam os milímetros exatos com precisão digital.',
    },
    {
      question: 'E se o óculos não vestir bem no meu rosto ou eu não me adaptar ao grau?',
      answer:
        'Você conta com a nossa garantia de 7 dias de adaptação. Se por qualquer motivo a armação não vestir confortavelmente ou você sentir desconforto com a graduação, realizamos o ajuste, troca ou devolução sem complicações.',
    },
    {
      question: 'Qual o prazo de entrega?',
      answer:
        'Após a confirmação da sua receita e do pedido, o prazo de montagem em laboratório e entrega na sua residência é de até 7 dias úteis. Você recebe o código de rastreamento para acompanhar cada etapa.',
    },
    {
      question: 'A Óticas Aion entrega em todo o Brasil?',
      answer:
        'Sim! Atendemos e despachamos pedidos para qualquer cidade ou estado do Brasil através dos Correios e transportadoras parceiras homologadas.',
    },
    {
      question: 'Por que os óculos da Aion custam até 50% menos que em óticas de shopping?',
      answer:
        'Óticas tradicionais de shopping arcam com aluguéis elevados, taxas de franquia e estruturas pesadas. Nós operamos diretamente com corte digital em laboratório e suporte consultivo online no WhatsApp, repassando essa economia para o valor final.',
    },
    {
      question: 'Quais tipos de grau vocês atendem?',
      answer:
        'Atendemos praticamente todas as prescrições médicas oftálmicas: miopia, astigmatismo, hipermetropia e presbiopia, além de opções com filtro de luz azul (Blue Cut) e tratamentos fotossensíveis.',
    },
    {
      question: 'Quais são as formas de pagamento disponíveis?',
      answer:
        'Aceitamos pagamento à vista via PIX com 5% de desconto automático, além de parcelamento em até 12x no cartão de crédito.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header without redundant AI pill */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand tracking-tight text-balance">
            Perguntas frequentes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 px-2 text-pretty leading-relaxed">
            Tudo o que você precisa saber antes de encomendar seu óculos de grau completo com total tranquilidade.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition focus-visible:ring-2 focus-visible:ring-[#c8a25a] outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <CaretDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#c8a25a]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Callout */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-stone-900 text-base">Ainda tem alguma dúvida específica?</h4>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Nosso consultor óptico responde em poucos minutos no WhatsApp.</p>
          </div>
          <button
            onClick={() => onWhatsAppClick('Olá! Tenho uma dúvida sobre os óculos da Óticas Aion.')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow active:scale-95 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Falar com consultor</span>
          </button>
        </div>

      </div>
    </section>
  );
};

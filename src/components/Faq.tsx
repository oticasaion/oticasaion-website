import React, { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';

interface FaqProps {
  onWhatsAppClick: (customText?: string) => void;
}

export const Faq: React.FC<FaqProps> = ({ onWhatsAppClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Como faço para enviar minha receita médica?',
      answer:
        'É muito simples! Nosso site funciona como um catálogo digital. Ao escolher sua armação favorita ou clicar no botão do WhatsApp, basta enviar uma foto nítida da sua receita oftálmica emitida pelo seu médico. Nossa equipe técnica faz a conferência na hora.',
    },
    {
      question: 'Como é feita a medição da DNP (Distância Naso-Pupilar) à distância?',
      answer:
        'A medição é realizada com auxílio da nossa equipe pelo próprio WhatsApp. Enviamos um guia rápido e simples de como tirar uma foto segurando um cartão com tarja magnética ou régua milimétrica abaixo dos olhos. Nosso software e técnicos calculam os milímetros exatos com precisão digital.',
    },
    {
      question: 'E se o óculos não ficar bom no meu rosto ou eu não me adaptar ao grau?',
      answer:
        'Você conta com a nossa Garantia de 7 Dias. Se por qualquer motivo a armação não vestir confortavelmente ou você sentir tontura/dificuldade de adaptação no grau, realizamos o ajuste, troca ou devolução sem burocracia.',
    },
    {
      question: 'Qual o prazo de entrega?',
      answer:
        'Após a confirmação da sua receita e do pagamento, o prazo de montagem em laboratório e entrega na sua residência é de até 7 dias úteis. Você recebe o código de rastreamento para acompanhar cada etapa.',
    },
    {
      question: 'A Óticas Aion entrega em todo o Brasil?',
      answer:
        'Sim! Atendemos e despachamos pedidos para qualquer cidade ou estado do Brasil através dos Correios e transportadoras parceiras homologadas.',
    },
    {
      question: 'Por que os óculos da Aion são até 50% mais baratos que os de óticas de shopping?',
      answer:
        'Óticas tradicionais de shopping e bairro arcam com aluguéis abusivos, taxas de franquia e estruturas pesadas. Nós operamos diretamente com corte digital em laboratório e suporte online no WhatsApp, repassando toda essa economia para você.',
    },
    {
      question: 'Quais tipos de grau vocês atendem?',
      answer:
        'Atendemos praticamente todas as prescrições médicas oftálmicas: Miopia, Astigmatismo, Hipermetropia e Presbiopia, além de opções com filtro de luz azul (Blue Cut) e tratamentos fotossensíveis.',
    },
    {
      question: 'Quais são as formas de pagamento disponíveis?',
      answer:
        'Aceitamos pagamento à vista via PIX com 5% de desconto automático, além de parcelamento em até 12x sem complicação no cartão de crédito.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#faf8f5] text-stone-900 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c251d]/10 text-[#0c251d] text-xs font-bold tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#c8a25a]" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c251d] font-serif-brand">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-base text-stone-600">
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
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
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

        {/* WhatsApp Callout if still having questions */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-stone-900 text-base">Ainda ficou com alguma dúvida específica?</h4>
            <p className="text-xs text-stone-500">Nosso consultor óptico responde em poucos minutos no WhatsApp.</p>
          </div>
          <button
            onClick={() => onWhatsAppClick('Olá! Tenho uma dúvida sobre os óculos da Óticas Aion.')}
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow active:scale-95 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Falar com Consultor</span>
          </button>
        </div>

      </div>
    </section>
  );
};

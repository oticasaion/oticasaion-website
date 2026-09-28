import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  onClick: (customText?: string) => void;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="bg-white text-stone-800 text-xs font-medium py-2.5 px-4 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-3 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Envie sua receita pelo WhatsApp!</span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-600 transition"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button with Pulse Effect */}
      <button
        onClick={() => onClick('Olá! Gostaria de consultar os modelos de armações e enviar minha receita.')}
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Abrir WhatsApp da Óticas Aion"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white relative z-10" />
      </button>
    </div>
  );
};

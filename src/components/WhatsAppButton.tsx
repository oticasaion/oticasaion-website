import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  onClick: (customText?: string) => void;
  isDetailView?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  onClick,
  isDetailView = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div
      className={`fixed ${
        isDetailView ? 'bottom-20 sm:bottom-6' : 'bottom-4 sm:bottom-6'
      } right-4 sm:right-6 z-40 flex flex-col items-end gap-2 transition-all duration-300 pb-safe`}
    >
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="bg-white text-stone-800 text-[11px] sm:text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-2.5 animate-bounce max-w-[220px] xs:max-w-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Envie sua receita no Zap!</span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-600 transition p-0.5"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button with Pulse Effect */}
      <button
        onClick={() => onClick('Olá! Gostaria de consultar os modelos de armações e enviar minha receita.')}
        className="relative group flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Abrir WhatsApp da Óticas Aion"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        <MessageCircle className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 fill-white relative z-10" />
      </button>
    </div>
  );
};

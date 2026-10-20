import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WhatsAppButtonProps {
  onClick: (customText?: string) => void;
  isDetailView?: boolean;
  isHome?: boolean;
  isAdmin?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  onClick,
  isDetailView = false,
  isHome = false,
  isAdmin = false,
}) => {
  // Ocultar na primeira página (Home) e no painel do lojista (Admin)
  if (isHome || isAdmin) return null;

  // On detail view, hide on mobile to prevent overlapping with sticky buy bar
  return (
    <div
      className={`fixed ${
        isDetailView
          ? 'hidden lg:flex bottom-6 right-6'
          : 'flex bottom-4 right-4 sm:bottom-6 sm:right-6'
      } z-40 items-end transition-all duration-300 pb-safe`}
    >
      {/* Floating Button with Subtle Pulse */}
      <button
        onClick={() =>
          onClick('Olá! Gostaria de tirar dúvidas sobre óculos e lentes na Óticas Aion.')
        }
        className="relative group flex items-center justify-center w-13 h-13 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Falar no WhatsApp da Óticas Aion"
        title="Fale no WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
      </button>
    </div>
  );
};

import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSlogan = true,
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-3xl md:text-4xl',
  };

  const sloganSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] md:text-[11px]',
    lg: 'text-xs md:text-sm',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Brand Icon SVG */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="aionGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E48E" />
              <stop offset="50%" stopColor="#C8A25A" />
              <stop offset="100%" stopColor="#8A6B29" />
            </linearGradient>
          </defs>
          {/* Badge Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="46"
            className={isDark ? 'fill-[#0C251D]' : 'fill-[#061e16]'}
            stroke="#C8A25A"
            strokeWidth="2.8"
          />
          {/* Stylized Serif A */}
          <path
            d="M 50 24 L 37 68 H 44 L 47 58 H 53 L 56 68 H 63 Z M 50 40 L 52 51 H 48 Z"
            fill="url(#aionGoldGrad)"
            fillRule="evenodd"
          />
          {/* Cross Arrow */}
          <line
            x1="22"
            y1="51.5"
            x2="78"
            y2="51.5"
            stroke="#C8A25A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon points="76,47.5 84,51.5 76,55.5" fill="#F5E48E" />
        </svg>
      </div>

      {/* Brand Name & Slogan */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-sans-brand font-bold tracking-[0.14em] ${titleSizes[size]} ${
            isDark ? 'text-stone-900' : 'text-[#f5f1e8]'
          }`}
        >
          ÓTICAS <span className="text-[#c8a25a]">AION</span>
        </span>
        {showSlogan && (
          <span
            className={`font-sans-brand uppercase tracking-[0.22em] font-medium mt-1 ${sloganSizes[size]} ${
              isDark ? 'text-[#0C251D]/70' : 'text-[#c8a25a]'
            }`}
          >
            Visão que permanece
          </span>
        )}
      </div>
    </div>
  );
};

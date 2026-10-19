import React from 'react';
import logoWebp from '../assets/logo.webp';

interface LogoProps {
  variant?: 'light' | 'dark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSlogan = true,
}) => {
  const isDark = variant === 'dark';
  const isMonochrome = variant === 'monochrome';

  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16 md:w-20 md:h-20',
  };

  const titleSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-5xl',
  };

  const sloganSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] md:text-[11px]',
    lg: 'text-xs md:text-sm',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Brand Icon Image - Official logo.webp */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <img
          src={logoWebp}
          alt="Óticas Aion"
          className={`w-full h-full object-contain rounded-full drop-shadow-md select-none ${
            isMonochrome ? 'grayscale contrast-125 brightness-110' : ''
          }`}
        />
      </div>

      {/* Brand Name & Slogan */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-brand-name font-bold tracking-[0.04em] ${titleSizes[size]} ${
            isMonochrome
              ? 'text-white'
              : isDark
              ? 'text-stone-900'
              : 'text-[#f5f1e8]'
          }`}
        >
          Óticas{' '}
          <span
            className={
              isMonochrome
                ? 'text-stone-300'
                : isDark
                ? 'text-stone-900'
                : 'text-[#c8a25a]'
            }
          >
            Aion
          </span>
        </span>
        {showSlogan && (
          <span
            className={`font-sans-brand tracking-[0.14em] font-medium mt-0.5 ${sloganSizes[size]} ${
              isMonochrome
                ? 'text-stone-400'
                : isDark
                ? 'text-[#0C251D]/70'
                : 'text-[#c8a25a]'
            }`}
          >
            Visão que permanece
          </span>
        )}
      </div>
    </div>
  );
};

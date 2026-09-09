import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface WelleniLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  taglineText?: string;
  inverted?: boolean;
}

export const WelleniLogo: React.FC<WelleniLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  taglineText,
  inverted = false,
}) => {
  const { isTelugu } = useLanguage();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl md:text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const defaultTagline = taglineText || (isTelugu ? 'హెల్త్‌కేర్ & వెల్‌నెస్' : 'Healthcare & Wellness');

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Welleni Brand Logo Icon */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-teal-900 via-primary to-teal-600 text-on-primary flex items-center justify-center shadow-xs shrink-0 ring-1 ring-white/10`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[70%] h-[70%]"
        >
          {/* Welleni 'W' with wellness curves and health cross accent */}
          <path
            d="M7 11L12.5 25L18 13.5L23.5 25L29 11"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dynamic wellness leaf dot */}
          <circle cx="18" cy="8" r="2.5" fill="#5EEAD4" />
          <path
            d="M18 5.5C19.5 7 21 8.5 21 10.5C19 10.5 17.5 9 18 5.5Z"
            fill="#99F6E4"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <span
          className={`font-bold ${textSizes[size]} ${
            inverted ? 'text-white' : 'text-primary'
          } tracking-tight font-sans leading-tight`}
        >
          Welleni
        </span>
        {showTagline && (
          <span
            className={`${taglineSizes[size]} ${
              inverted ? 'text-white/80' : 'text-on-surface-variant'
            } font-medium leading-none`}
          >
            {defaultTagline}
          </span>
        )}
      </div>
    </div>
  );
};

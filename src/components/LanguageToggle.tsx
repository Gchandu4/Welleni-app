import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageToggleProps {
  variant?: 'header' | 'floating' | 'compact' | 'drawer';
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'header', className = '' }) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'drawer') {
    return (
      <div className={`p-3 rounded-2xl bg-surface-container border border-surface-variant flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">translate</span>
          <span className="text-xs font-bold text-on-surface">Language / భాష:</span>
        </div>
        <div className="flex items-center bg-surface-container-lowest p-1 rounded-xl border border-surface-variant shadow-2xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('te')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'te'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-sand-soft/80 hover:bg-sand-soft dark:bg-surface-container border border-primary/20 hover:border-primary/40 rounded-full p-1 transition-all shadow-2xs ${className}`}
      title="Switch between English and Telugu"
    >
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-sm text-primary pl-1.5 pr-0.5">translate</span>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
            language === 'en'
              ? 'bg-primary text-on-primary shadow-xs scale-100'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('te')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
            language === 'te'
              ? 'bg-primary text-on-primary shadow-xs scale-100'
              : 'text-on-surface-variant hover:text-primary'
          }`}
          aria-label="తెలుగులోకి మార్చండి"
        >
          తెలుగు
        </button>
      </div>
    </div>
  );
};

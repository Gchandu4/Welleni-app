import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isTelugu } = useLanguage();

  const label = isDark
    ? isTelugu ? 'లైట్ మోడ్' : 'Light Mode'
    : isTelugu ? 'డార్క్ మోడ్' : 'Dark Mode';

  const tooltip = isDark
    ? isTelugu ? 'లైట్ మోడ్‌కి మారండి' : 'Switch to Light theme'
    : isTelugu ? 'డార్క్ మోడ్‌కి మారండి' : 'Switch to Dark theme';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={tooltip}
      title={tooltip}
      className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-full border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isDark
          ? 'bg-surface-container-high border-outline-variant/60 text-primary hover:bg-surface-container-highest hover:border-primary/50'
          : 'bg-sand-soft/80 border-primary/20 text-teal-deep hover:bg-sand-soft hover:border-primary/40'
      } ${className}`}
    >
      <span className="sr-only">{tooltip}</span>
      
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <span className="material-symbols-outlined text-xl text-primary animate-in fade-in zoom-in-75 duration-200">
            light_mode
          </span>
        ) : (
          <span className="material-symbols-outlined text-xl text-teal-deep animate-in fade-in zoom-in-75 duration-200">
            dark_mode
          </span>
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold text-on-surface select-none pr-1">
          {label}
        </span>
      )}
    </button>
  );
};

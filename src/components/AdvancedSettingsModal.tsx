import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme, Theme } from '../theme/ThemeContext';

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, isTelugu } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (lang: 'en' | 'te') => {
    setLanguage(lang);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-surface-container-lowest dark:bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 md:p-7 border border-outline-variant/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-surface-variant">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-mist/30 dark:bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">
                {isTelugu ? 'అధునాతన సెట్టింగ్‌లు' : 'Advanced Settings'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {isTelugu ? 'భాష మరియు డిస్‌ప్లే మోడ్ ప్రాధాన్యతలు' : 'Language and appearance preferences'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-variant text-outline hover:text-on-surface transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Setting 1: Language Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">translate</span>
              <span>{isTelugu ? 'భాష ఎంపిక (Language)' : 'Language Selection'}</span>
            </label>
            <span className="text-[11px] font-semibold text-primary bg-teal-mist/30 dark:bg-primary/20 px-2 py-0.5 rounded-full">
              {language === 'te' ? 'తెలుగు' : 'English'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* English Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                language === 'en'
                  ? 'border-primary bg-primary/10 dark:bg-primary/15 ring-2 ring-primary/30'
                  : 'border-outline-variant/40 bg-surface-container/40 hover:bg-surface-container text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-on-surface">English</span>
                {language === 'en' && (
                  <span className="material-symbols-outlined text-base text-primary fill">check_circle</span>
                )}
              </div>
              <span className="text-[11px] text-on-surface-variant">Default app language</span>
            </button>

            {/* Telugu Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange('te')}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                language === 'te'
                  ? 'border-primary bg-primary/10 dark:bg-primary/15 ring-2 ring-primary/30'
                  : 'border-outline-variant/40 bg-surface-container/40 hover:bg-surface-container text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-on-surface">తెలుగు</span>
                {language === 'te' && (
                  <span className="material-symbols-outlined text-base text-primary fill">check_circle</span>
                )}
              </div>
              <span className="text-[11px] text-on-surface-variant">ప్రాంతీయ భాష (కోదాడ)</span>
            </button>
          </div>
        </div>

        {/* Setting 2: Dark Mode & Appearance */}
        <div className="space-y-3 pt-2 border-t border-surface-variant">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary">palette</span>
              <span>{isTelugu ? 'థీమ్ మోడ్ (Appearance)' : 'Theme Mode (Appearance)'}</span>
            </label>
            <span className="text-[11px] font-semibold text-primary bg-teal-mist/30 dark:bg-primary/20 px-2 py-0.5 rounded-full capitalize">
              {theme === 'system'
                ? (isTelugu ? 'సిస్టమ్' : 'System')
                : theme === 'dark'
                ? (isTelugu ? 'డార్క్ మోడ్' : 'Dark')
                : (isTelugu ? 'లైట్ మోడ్' : 'Light')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Light Mode */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                theme === 'light'
                  ? 'border-primary bg-primary/10 dark:bg-primary/15 ring-2 ring-primary/30'
                  : 'border-outline-variant/40 bg-surface-container/40 hover:bg-surface-container'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-lg">light_mode</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">
                  {isTelugu ? 'లైట్' : 'Light'}
                </p>
                <p className="text-[10px] text-outline">
                  {isTelugu ? 'ప్రకాశవంతమైన' : 'Bright'}
                </p>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10 dark:bg-primary/15 ring-2 ring-primary/30'
                  : 'border-outline-variant/40 bg-surface-container/40 hover:bg-surface-container'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-lg">dark_mode</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">
                  {isTelugu ? 'డార్క్' : 'Dark'}
                </p>
                <p className="text-[10px] text-outline">
                  {isTelugu ? 'కంటికి విశ్రాంతి' : 'Eye-comfort'}
                </p>
              </div>
            </button>

            {/* System Mode */}
            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                theme === 'system'
                  ? 'border-primary bg-primary/10 dark:bg-primary/15 ring-2 ring-primary/30'
                  : 'border-outline-variant/40 bg-surface-container/40 hover:bg-surface-container'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'system' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-lg">devices</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">
                  {isTelugu ? 'సిస్టమ్' : 'System'}
                </p>
                <p className="text-[10px] text-outline">
                  {resolvedTheme === 'dark' ? 'Dark auto' : 'Light auto'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Accessibility Note */}
        <div className="bg-sand-soft/70 dark:bg-surface-variant/30 p-3.5 rounded-2xl border border-outline-variant/30 flex items-start gap-2.5 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">verified_user</span>
          <p className="text-[11px] leading-relaxed">
            {isTelugu
              ? 'ఈ సెట్టింగ్‌లు మీ ప్రాధాన్యతలను ఆటోమేటిక్‌గా సేవ్ చేస్తాయి. డార్క్ మోడ్ అత్యధిక కాంట్రాస్ట్ మరియు దృశ్య సౌలభ్యం (WCAG AAA) తో రూపొందించబడింది.'
              : 'Preferences are automatically saved on this device. The dark palette is engineered to meet WCAG AAA contrast accessibility standards.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          {savedFeedback ? (
            <span className="text-xs font-bold text-teal-deep dark:text-teal-mist flex items-center gap-1 animate-in fade-in duration-150">
              <span className="material-symbols-outlined text-sm">check</span>
              {isTelugu ? 'సేవ్ చేయబడింది' : 'Preferences applied'}
            </span>
          ) : (
            <span className="text-[11px] text-outline">
              Welleni v1.2 • Sri Sankalpa
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-teal-deep text-on-primary text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            {isTelugu ? 'పూర్తయింది' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

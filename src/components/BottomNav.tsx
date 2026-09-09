import React from 'react';
import { ViewMode } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  upcomingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, upcomingCount = 0 }) => {
  const { t } = useLanguage();

  // Hide bottom nav on checkout, login, signup
  if (currentView === 'checkout' || currentView === 'login' || currentView === 'signup') {
    return null;
  }

  const hasUpcoming = upcomingCount > 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 bg-surface dark:bg-surface-dim border-t border-outline-variant/30 z-50 shadow-lg pb-safe">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center transition-all duration-200 p-2 rounded-lg ${
          currentView === 'home'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1'
            : 'text-on-surface-variant hover:bg-teal-mist/20 active:scale-90'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">home</span>
        <span className="font-semibold text-[11px] tracking-tight mt-0.5">{t.navHome}</span>
      </button>

      <button
        onClick={() => onNavigate('hospitals')}
        className={`flex flex-col items-center justify-center transition-all duration-200 p-2 rounded-lg ${
          currentView === 'hospitals'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1'
            : 'text-on-surface-variant hover:bg-teal-mist/20 active:scale-90'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">local_hospital</span>
        <span className="font-semibold text-[11px] tracking-tight mt-0.5">{t.navServices}</span>
      </button>

      <button
        onClick={() => onNavigate('bookings')}
        className={`flex flex-col items-center justify-center transition-all duration-200 p-2 rounded-lg relative ${
          currentView === 'bookings'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1'
            : 'text-on-surface-variant hover:bg-teal-mist/20 active:scale-90'
        }`}
      >
        <div className="relative">
          <span className="material-symbols-outlined text-2xl">calendar_today</span>
          {hasUpcoming && (
            <span className="absolute -top-1 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-white items-center justify-center shadow-xs">
                {upcomingCount}
              </span>
            </span>
          )}
        </div>
        <span className="font-semibold text-[11px] tracking-tight mt-0.5">{t.navBookings}</span>
      </button>

      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center transition-all duration-200 p-2 rounded-lg ${
          currentView === 'profile'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1'
            : 'text-on-surface-variant hover:bg-teal-mist/20 active:scale-90'
        }`}
      >
        <span className="material-symbols-outlined text-2xl fill">person</span>
        <span className="font-semibold text-[11px] tracking-tight mt-0.5">{t.navProfile}</span>
      </button>
    </nav>
  );
};

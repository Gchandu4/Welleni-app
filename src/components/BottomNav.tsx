import React from 'react';
import { ViewMode } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  upcomingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();

  // Hide bottom nav on checkout, login, signup
  if (currentView === 'checkout' || currentView === 'login' || currentView === 'signup') {
    return null;
  }

  const navItems: { view: ViewMode; icon: string; label: string }[] = [
    { view: 'home', icon: 'home', label: t.navHome },
    { view: 'hospitals', icon: 'local_hospital', label: t.navServices },
    { view: 'bookings', icon: 'calendar_today', label: t.navBookings },
    { view: 'profile', icon: 'person', label: t.navProfile },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 w-full flex items-center justify-around bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-xl border-t border-surface-variant/80 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className="flex-1 flex flex-col items-center justify-center pt-2 pb-1 focus:outline-none select-none group active:scale-95 transition-transform"
            aria-current={isActive ? 'page' : undefined}
          >
            <div
              className={`w-14 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-teal-mist/50 dark:bg-primary/25 text-primary scale-100 shadow-2xs'
                  : 'text-outline group-hover:text-on-surface bg-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-all ${isActive ? 'fill' : ''}`}>
                {item.icon}
              </span>
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isActive ? 'font-bold text-primary' : 'font-medium text-outline'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

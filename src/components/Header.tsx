import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { UpcomingAppointmentAlert } from '../utils/appointmentAlerts';
import { useLanguage } from '../i18n/LanguageContext';
import { WelleniLogo } from './WelleniLogo';
import { AdvancedSettingsModal } from './AdvancedSettingsModal';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  user: UserProfile;
  isLoggedIn: boolean;
  onLogout: () => void;
  unreadCount?: number;
  upcomingAlerts?: UpcomingAppointmentAlert[];
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  user,
  isLoggedIn,
  onLogout,
  unreadCount = 2,
  upcomingAlerts = [],
}) => {
  const { t, isTelugu } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const hasUpcoming24h = upcomingAlerts.length > 0;

  const generalNotifications = [
    {
      id: 'gen-1',
      title: isTelugu ? 'వైద్య రికార్డు అప్‌లోడ్ అయింది' : 'Medical Record Uploaded',
      desc: isTelugu ? 'బ్లడ్ షుగర్ & లిపిడ్ ప్రొఫైల్ విజయవంతంగా సేవ్ అయింది.' : 'Blood Sugar & Lipid Profile report was synchronized.',
      time: isTelugu ? '2 గం. క్రితం' : '2h ago',
      unread: true,
    },
    {
      id: 'gen-2',
      title: isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్ కు స్వాగతం' : 'Welcome to Sri Sankalpa Hospital',
      desc: isTelugu ? 'కోదాడలో ప్రముఖ వైద్య నిపుణులు మరియు 24/7 ఎమర్జెన్సీ సేవలు అందుబాటులో ఉన్నాయి.' : 'Specialist doctors & 24/7 emergency care available in Kodad.',
      time: isTelugu ? '1 రోజు క్రితం' : '1d ago',
      unread: false,
    },
  ];

  const totalUnreadCount = unreadCount + (hasUpcoming24h ? upcomingAlerts.length : 0);
  const showBackButton = currentView === 'checkout' || currentView === 'support' || currentView === 'login' || currentView === 'signup';

  return (
    <header className="bg-surface/90 dark:bg-surface-dim w-full top-0 sticky z-50 border-b border-outline-variant/20 backdrop-blur-md transition-all shadow-2xs">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 md:px-10 py-2.5 md:py-3">
        <div className="flex items-center gap-2.5 md:gap-4">
          {/* Mobile Back / Menu Button */}
          {showBackButton ? (
            <button
              onClick={() => onNavigate(currentView === 'checkout' ? 'hospitals' : 'home')}
              aria-label="Go back"
              className="p-2 -ml-1 rounded-full hover:bg-surface-variant/60 transition-colors text-on-surface-variant active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-full hover:bg-surface-variant/60 transition-colors text-on-surface-variant relative active:scale-95"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
              {hasUpcoming24h && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-surface"></span>
              )}
            </button>
          )}

          {/* Brand Logo: Welleni */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
            aria-label="Welleni Healthcare Home"
          >
            <WelleniLogo size="md" />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-surface-container-low px-2.5 py-0.5 rounded-full border border-surface-variant">
              <span className="material-symbols-outlined text-xs">location_on</span>
              <span>{isTelugu ? 'కోదాడ' : 'Kodad, TS'}</span>
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => onNavigate('home')}
            className={`font-medium text-sm transition-colors ${
              currentView === 'home'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => onNavigate('hospitals')}
            className={`font-medium text-sm transition-colors ${
              currentView === 'hospitals'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.navServices}
          </button>
          <button
            onClick={() => onNavigate('bookings')}
            className={`font-medium text-sm transition-colors relative flex items-center gap-1.5 ${
              currentView === 'bookings'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>{t.navBookings}</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`font-medium text-sm transition-colors ${
              currentView === 'profile'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.navProfile}
          </button>
          <button
            onClick={() => onNavigate('support')}
            className={`font-medium text-sm transition-colors ${
              currentView === 'support'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.navSupport}
          </button>
        </nav>

        {/* Right Actions: Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 relative">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-surface-variant/60 transition-colors text-on-surface-variant relative active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              {totalUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full ring-2 ring-surface flex items-center justify-center text-[9px] font-bold text-white bg-primary">
                  {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center pb-3 border-b border-surface-variant mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-on-surface text-sm">{t.notifications}</h3>
                    {hasUpcoming24h && (
                      <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-300/60">
                        {upcomingAlerts.length} {t.actionNeeded}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    {t.close}
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {/* Highlighted 24-hour upcoming appointment cards */}
                  {hasUpcoming24h && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        <span>{isTelugu ? '24 గంటల్లో రాబోయే అపాయింట్‌మెంట్' : 'Upcoming Within 24 Hours'}</span>
                      </div>
                      {upcomingAlerts.map((alert) => (
                        <div
                          key={alert.booking.id}
                          className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400/40 text-left space-y-2 transition-all hover:border-amber-500"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={alert.booking.doctorPhoto}
                              alt={alert.booking.doctorName}
                              className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs text-on-surface truncate">
                                  {alert.booking.doctorName}
                                </span>
                                <span className="bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full shrink-0">
                                  {alert.timeRemainingFormatted}
                                </span>
                              </div>
                              <p className="text-[11px] text-on-surface-variant truncate">
                                {alert.booking.hospitalName}
                              </p>
                              <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 mt-0.5">
                                {alert.isToday ? t.today : t.tomorrow} @ {alert.booking.timeSlot}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1 border-t border-amber-300/40">
                            <button
                              onClick={() => {
                                onNavigate('bookings');
                                setShowNotifications(false);
                              }}
                              className="flex-1 py-1.5 bg-primary hover:bg-teal-deep text-on-primary rounded-lg font-bold text-[11px] transition-colors"
                            >
                              {t.viewDetails}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* General Notifications */}
                  <div className="space-y-2">
                    {generalNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl transition-colors ${
                          n.unread
                            ? 'bg-teal-mist/20 border border-teal-mist/40'
                            : 'hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-xs text-on-surface">{n.title}</h4>
                          <span className="text-[10px] text-outline shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-variant/60 transition-colors"
                aria-label="User profile menu"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-primary"
                />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-surface-variant mb-1">
                    <p className="font-bold text-sm text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant">{user.phone}</p>
                    <p className="text-[11px] text-outline">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">person</span>
                    {t.navProfile}
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('bookings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">calendar_month</span>
                    {t.navBookings}
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('support');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">support_agent</span>
                    {t.navSupport}
                  </button>

                  <a
                    href="tel:7095330066"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-red-600 dark:text-red-400">call</span>
                    <span>{isTelugu ? '24/7 ఎమర్జెన్సీ హెల్ప్‌లైన్' : '24/7 Emergency Helpline'}</span>
                  </a>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowAdvancedSettings(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">settings</span>
                    {isTelugu ? 'అధునాతన సెట్టింగ్‌లు' : 'Advanced Settings'}
                  </button>

                  <div className="my-1 border-t border-surface-variant"></div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-error">logout</span>
                    {t.navLogOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-sand-soft hover:bg-surface-variant text-primary transition-colors"
              >
                {t.navLogIn}
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold rounded-lg bg-primary hover:bg-teal-deep text-on-primary transition-colors shadow-xs"
              >
                {t.navSignUp}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer / Android Sheet */}
      {showMobileMenu && (
        <div className="md:hidden bg-surface-container-lowest/98 backdrop-blur-xl border-b border-outline-variant/30 px-5 py-4 space-y-3.5 animate-in slide-in-from-top-3 duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-teal-mist/50 text-primary flex items-center justify-center font-bold text-xs">
                SS
              </span>
              <div>
                <p className="text-xs font-bold text-on-surface leading-tight">
                  {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్స్' : 'Sri Sankalpa Hospitals'}
                </p>
                <p className="text-[10px] text-outline">
                  {isTelugu ? 'కోదాడ, తెలంగాణ' : 'Kodad, Telangana'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-1 rounded-full text-on-surface-variant hover:bg-surface-variant active:scale-95"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Quick Helpline banner inside drawer */}
          <a
            href="tel:7095330066"
            className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">emergency</span>
              <span>{isTelugu ? '24/7 ఎమర్జెన్సీ: 7095330066' : '24/7 Emergency: 7095330066'}</span>
            </div>
            <span className="text-[11px] underline">{isTelugu ? 'కాల్ చేయండి' : 'Call'}</span>
          </a>

          {/* Advanced Settings in Drawer */}
          <button
            onClick={() => {
              setShowMobileMenu(false);
              setShowAdvancedSettings(true);
            }}
            type="button"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-xs font-bold text-on-surface active:scale-98 transition-all hover:bg-surface-container"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-lg text-primary">settings</span>
              <span>{isTelugu ? 'అధునాతన సెట్టింగ్‌లు (భాష & థీమ్)' : 'Advanced Settings (Language & Theme)'}</span>
            </div>
            <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
          </button>

          <div className="space-y-1">
            <button
              onClick={() => { onNavigate('support'); setShowMobileMenu(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-xs text-on-surface hover:bg-surface-container flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg text-primary">help</span>
                <span>{t.navSupport}</span>
              </span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
            </button>
          </div>

          <div className="pt-2 border-t border-surface-variant flex gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onLogout();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-error/10 text-error flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>{t.navLogOut} ({user.name})</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => { onNavigate('login'); setShowMobileMenu(false); }}
                  className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl bg-sand-soft text-primary active:scale-95 transition-all"
                >
                  {t.navLogIn}
                </button>
                <button
                  onClick={() => { onNavigate('signup'); setShowMobileMenu(false); }}
                  className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl bg-primary text-on-primary active:scale-95 transition-all shadow-xs"
                >
                  {t.navSignUp}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Advanced Settings Modal (Language Selection & Theme Mode) */}
      <AdvancedSettingsModal
        isOpen={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
      />
    </header>
  );
};

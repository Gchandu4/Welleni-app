import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { UpcomingAppointmentAlert } from '../utils/appointmentAlerts';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { WelleniLogo } from './WelleniLogo';

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
  const [isAlertBannerDismissed, setIsAlertBannerDismissed] = useState(false);

  const hasUpcoming24h = upcomingAlerts.length > 0;
  const primaryUpcoming = hasUpcoming24h ? upcomingAlerts[0] : null;

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
      {/* 24-Hour Urgent Appointment Banner Strip */}
      {hasUpcoming24h && !isAlertBannerDismissed && primaryUpcoming && (
        <div className="bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-amber-500/10 border-b border-amber-400/30 px-4 md:px-10 py-2 text-xs transition-all">
          <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
              </span>
              <span className="bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border border-amber-400/40">
                {t.alert24h}
              </span>
              <span className="font-semibold text-on-surface line-clamp-1">
                {t.upcomingAppointment}: <strong>{primaryUpcoming.booking.doctorName}</strong> ({primaryUpcoming.booking.hospitalName})
              </span>
              <span className="hidden sm:inline-block text-amber-800 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full text-[11px]">
                {primaryUpcoming.isToday ? t.today : t.tomorrow} • {primaryUpcoming.booking.timeSlot} ({primaryUpcoming.timeRemainingFormatted})
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <button
                onClick={() => {
                  onNavigate('bookings');
                }}
                className="bg-primary hover:bg-teal-deep text-on-primary font-bold px-3 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1 shadow-2xs active:scale-95"
              >
                <span>{t.viewDetails}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
              <button
                onClick={() => setIsAlertBannerDismissed(true)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Dismiss banner"
                aria-label="Dismiss banner"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 md:px-10 py-2.5 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Back / Menu Button */}
          {showBackButton ? (
            <button
              onClick={() => onNavigate('hospitals')}
              aria-label="Go back"
              className="p-2 rounded-full hover:bg-surface-variant/60 transition-colors text-on-surface-variant active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-full hover:bg-surface-variant/60 transition-colors text-on-surface-variant relative"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
              {hasUpcoming24h && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-surface animate-pulse"></span>
              )}
            </button>
          )}

          {/* Brand Logo: Welleni */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center group text-left transition-transform active:scale-95"
            aria-label="Welleni Healthcare Home"
          >
            <WelleniLogo size="md" />
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
            {hasUpcoming24h && (
              <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/60 animate-pulse shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {upcomingAlerts.length}
              </span>
            )}
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

        {/* Right Actions: Language Switcher, Notifications & Profile */}
        <div className="flex items-center gap-2 md:gap-3.5 relative">
          {/* Prominent Language Switcher */}
          <LanguageToggle variant="header" />

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-surface-variant/60 transition-colors text-on-surface-variant relative active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              {totalUnreadCount > 0 && (
                <span className={`absolute top-1.5 right-1.5 w-3 h-3 rounded-full ring-2 ring-surface flex items-center justify-center text-[9px] font-bold text-white ${
                  hasUpcoming24h ? 'bg-amber-500 animate-pulse' : 'bg-primary'
                }`}>
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

      {/* Mobile Nav Drawer */}
      {showMobileMenu && (
        <div className="md:hidden bg-surface border-b border-outline-variant/30 px-6 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Mobile Language Switcher */}
          <LanguageToggle variant="drawer" />

          <button
            onClick={() => { onNavigate('home'); setShowMobileMenu(false); }}
            className={`block w-full text-left py-2 font-medium ${currentView === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => { onNavigate('hospitals'); setShowMobileMenu(false); }}
            className={`block w-full text-left py-2 font-medium ${currentView === 'hospitals' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
          >
            {t.navServices}
          </button>
          <button
            onClick={() => { onNavigate('bookings'); setShowMobileMenu(false); }}
            className={`flex items-center justify-between w-full text-left py-2 font-medium ${currentView === 'bookings' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
          >
            <span>{t.navBookings}</span>
            {hasUpcoming24h && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {upcomingAlerts.length} within 24h
              </span>
            )}
          </button>
          <button
            onClick={() => { onNavigate('profile'); setShowMobileMenu(false); }}
            className={`block w-full text-left py-2 font-medium ${currentView === 'profile' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
          >
            {t.navProfile}
          </button>
          <button
            onClick={() => { onNavigate('support'); setShowMobileMenu(false); }}
            className={`block w-full text-left py-2 font-medium ${currentView === 'support' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
          >
            {t.navSupport}
          </button>
          <div className="pt-2 border-t border-surface-variant flex gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onLogout();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-error/10 text-error flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                {t.navLogOut} ({user.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => { onNavigate('login'); setShowMobileMenu(false); }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-sand-soft text-primary"
                >
                  {t.navLogIn}
                </button>
                <button
                  onClick={() => { onNavigate('signup'); setShowMobileMenu(false); }}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-primary text-on-primary"
                >
                  {t.navSignUp}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

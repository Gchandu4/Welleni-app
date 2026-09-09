import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { WelleniLogo } from './WelleniLogo';

interface LoginViewProps {
  onLoginSuccess: (emailOrMobile: string) => void;
  onNavigateToSignUp: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
}) => {
  const { isTelugu } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    onLoginSuccess(identifier);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-8 font-sans overflow-hidden">
      {/* Ambient Background Blur Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-teal-mist/30 blur-[100px] opacity-70"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/30 blur-[120px] opacity-60"></div>
      </div>

      <main className="w-full max-w-md px-4 md:px-0 z-10 relative">
        <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-xl border border-tertiary-fixed-dim/30 p-8 md:p-10 flex flex-col items-center">
          {/* Brand Logo: Welleni */}
          <div className="mb-6 flex items-center justify-center">
            <WelleniLogo size="lg" />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8 w-full">
            <h2 className="font-semibold text-2xl text-on-surface mb-1.5">
              {isTelugu ? 'స్వాగతం' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {isTelugu
                ? 'మీ ఆరోగ్య రికార్డులు & అపాయింట్‌మెంట్‌లను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి.'
                : 'Sign in to access your appointments and medical records.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email/Mobile Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">mail</span>
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isTelugu ? 'ఈమెయిల్ లేదా మొబైల్ నంబర్' : 'Email or Mobile Number'}
                className="w-full pl-12 pr-4 py-3.5 bg-sand-soft/60 border border-transparent rounded-xl text-sm text-on-surface placeholder-on-surface-variant focus:bg-surface-container-lowest focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isTelugu ? 'పాస్‌వర్డ్' : 'Password'}
                className="w-full pl-12 pr-12 py-3.5 bg-sand-soft/60 border border-transparent rounded-xl text-sm text-on-surface placeholder-on-surface-variant focus:bg-surface-container-lowest focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end w-full -mt-1">
              <a href="#" className="text-xs font-semibold text-primary hover:text-teal-deep transition-colors">
                {isTelugu ? 'పాస్‌వర్డ్ మర్చిపోయారా?' : 'Forgot Password?'}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-teal-deep text-on-primary font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm mt-2 cursor-pointer"
            >
              {isTelugu ? 'లాగిన్ చేయండి' : 'Login'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 my-6">
            <div className="h-px bg-outline-variant/40 flex-1"></div>
            <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
              {isTelugu ? 'లేదా వీటితో కొనసాగండి' : 'Or continue with'}
            </span>
            <div className="h-px bg-outline-variant/40 flex-1"></div>
          </div>

          {/* Social Logins */}
          <div className="w-full flex gap-3">
            <button
              type="button"
              onClick={() => onLoginSuccess('patient@srisankalpa.com')}
              className="flex-1 bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container-low text-on-surface font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess('patient.apple@srisankalpa.com')}
              className="flex-1 bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container-low text-on-surface font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 18.67c-1.3.93-2.64.91-3.87 0-1.12-.83-2.14-.85-3.33 0-1.32.95-2.73 1.05-4.05 0-3.37-2.67-6.07-8.3-4.17-11.83 1.01-1.88 2.84-3.08 4.93-3.12 1.48-.03 2.87.97 3.65.97.77 0 2.45-1.2 4.2-1.02 1.76.18 3.36 1.03 4.28 2.48-3.6 2.08-3.02 7.02.66 8.57-1.13 2.76-3.1 5.92-5.91 8.57zM12.03 4.21c-.2-2.17 1.66-4.08 3.8-4.21.35 2.37-2.02 4.39-3.8 4.21z"></path>
              </svg>
              Apple
            </button>
          </div>

          {/* Sign Up Prompt */}
          <div className="mt-8 text-center w-full">
            <p className="text-xs text-on-surface-variant">
              {isTelugu ? 'ఖాతా లేదా?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="text-primary font-bold hover:text-teal-deep transition-colors"
              >
                {isTelugu ? 'ఖాతా సృష్టించండి (Sign Up)' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

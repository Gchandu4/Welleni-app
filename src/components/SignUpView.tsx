import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { WelleniLogo } from './WelleniLogo';

interface SignUpViewProps {
  onSignUpSuccess: (name: string, email: string, mobile: string) => void;
  onNavigateToLogin: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onNavigateToLogin,
}) => {
  const { isTelugu } = useLanguage();
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verification state
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [generatedEmailCode, setGeneratedEmailCode] = useState('');
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    mobile?: string;
    password?: string;
    verification?: string;
  }>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const validateDetails = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = isTelugu
        ? 'దయచేసి సరైన పూర్తి పేరును నమోదు చేయండి (కనీసం 2 అక్షరాలు).'
        : 'Please enter a valid full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = isTelugu
        ? 'దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.'
        : 'Please enter a valid email address.';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      newErrors.mobile = isTelugu
        ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.'
        : 'Please enter a valid 10-digit mobile number.';
    }

    if (!password || password.length < 6) {
      newErrors.password = isTelugu
        ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.'
        : 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;

    // Generate 6-digit verification codes
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedEmailCode(emailCode);
    setGeneratedPhoneCode(phoneCode);
    setEmailOtp('');
    setPhoneOtp('');
    setStep('verify');
    setResendTimer(30);
    setCanResend(false);
  };

  const handleResendCodes = () => {
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailCode(emailCode);
    setGeneratedPhoneCode(phoneCode);
    setResendTimer(30);
    setCanResend(false);
    setErrors({});
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp !== generatedEmailCode && emailOtp !== '123456') {
      setErrors({
        verification: isTelugu
          ? 'చెల్లని ఈమెయిల్ OTP కోడ్. డెమో కోడ్ "123456" లేదా పంపిన కోడ్‌ను ప్రయత్నించండి.'
          : 'Invalid Email OTP verification code. Try demo code "123456" or the sent code.',
      });
      return;
    }
    if (phoneOtp !== generatedPhoneCode && phoneOtp !== '123456') {
      setErrors({
        verification: isTelugu
          ? 'చెల్లని మొబైల్ OTP కోడ్. డెమో కోడ్ "123456" లేదా పంపిన కోడ్‌ను ప్రయత్నించండి.'
          : 'Invalid Phone OTP verification code. Try demo code "123456" or the sent code.',
      });
      return;
    }

    onSignUpSuccess(fullName.trim(), email.trim(), mobile.trim());
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row font-sans text-on-surface rounded-2xl overflow-hidden my-4 border border-outline-variant/30 shadow-md">
      {/* Hero Image Section (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 relative bg-surface-variant overflow-hidden min-h-[550px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQdcoDg1XFeJetBPXN8TLsZmnjc2ANYcgXRwTQFe4S0UV3pG588fviZVuBxB7cWgVqT_ASWdRL_hCCWtaDN1C_dv2C-iRTFz8RvoOeXKDAdcb_oOXLd_C2q-jhiuHOWtcM1rFT_gd_1wGEgRhOe-L78SmftjLtPwmIuVlfCXDLnoOesTepcf0fIqzULn4Wy-Hq0IU4R_2apd_d4GIp4vZbRvQVqINncQu2CvYSG230ooX8Pw4xVXk5')",
          }}
        ></div>
        <div className="absolute inset-0 bg-teal-deep/30 backdrop-blur-[1px]"></div>
        <div className="relative z-10 p-10 flex flex-col h-full justify-between">
          <div>
            <WelleniLogo size="lg" inverted />
          </div>
          <div className="max-w-md">
            <p className="font-bold text-3xl text-on-primary mb-2 font-sans">
              {isTelugu ? 'ఉత్తమ వైద్య సేవలు' : 'Advanced & Compassionate Care'}
            </p>
            <p className="text-base text-on-primary/90 font-normal">
              {isTelugu
                ? 'స్త్రీల వ్యాధులు, ప్రసవాలు మరియు లాపరోస్కోపిక్ సర్జికల్ సేవలలో నిపుణులు.'
                : 'Specialized in Obstetrics, Gynecology, Infertility, and General & Laparoscopic Surgeries in Kodad.'}
            </p>
          </div>
        </div>
      </div>

      {/* Registration & Verification Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-10 py-8 bg-surface">
        <div className="max-w-[440px] w-full mx-auto">
          {/* Mobile Brand Header: Welleni */}
          <div className="md:hidden flex justify-center mb-6">
            <WelleniLogo size="lg" />
          </div>

          {step === 'details' ? (
            /* Form Container: Account Details */
            <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-xs border border-outline-variant/30">
              <div className="mb-6 text-center md:text-left">
                <h2 className="font-bold text-2xl text-on-surface mb-1">
                  {isTelugu ? 'కొత్త ఖాతా సృష్టించండి' : 'Create Account'}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {isTelugu ? 'దశ 1/2: ధృవీకరణ కోసం మీ వివరాలను నమోదు చేయండి.' : 'Step 1 of 2: Enter your details for verification.'}
                </p>
              </div>

              <form onSubmit={handleProceedToVerify} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    {isTelugu ? 'పూర్తి పేరు' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline text-lg">
                        person
                      </span>
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder={isTelugu ? 'ఉదా: రాహుల్ వర్మ' : 'e.g. Rahul Verma'}
                      className="w-full bg-sand-soft border-0 rounded-xl pl-11 pr-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-secondary outline-none transition-all"
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-error font-medium mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    {isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline text-lg">
                        mail
                      </span>
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="rahul.verma@example.com"
                      className="w-full bg-sand-soft border-0 rounded-xl pl-11 pr-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-secondary outline-none transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-error font-medium mt-1">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    {isTelugu ? 'మొబైల్ నంబర్' : 'Mobile Number'}
                  </label>
                  <div className="flex relative">
                    <div className="flex items-center bg-sand-soft border-r border-outline-variant/30 px-3.5 rounded-l-xl">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/\D/g, ''));
                        if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                      }}
                      placeholder="98765 43210"
                      className="w-full bg-sand-soft border-0 rounded-r-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-secondary outline-none transition-all"
                    />
                  </div>
                  {errors.mobile && <p className="text-[11px] text-error font-medium mt-1">{errors.mobile}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    {isTelugu ? 'పాస్‌వర్డ్' : 'Password'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline text-lg">
                        lock
                      </span>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className="w-full bg-sand-soft border-0 rounded-xl pl-11 pr-11 py-3 text-xs text-on-surface focus:ring-2 focus:ring-secondary outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-error font-medium mt-1">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-teal-deep text-on-primary font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs cursor-pointer"
                  >
                    {isTelugu ? 'ధృవీకరణకు కొనసాగండి' : 'Continue to Verification'}
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-xs text-on-surface-variant">
                  {isTelugu ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-primary font-bold hover:underline decoration-2 underline-offset-4"
                  >
                    {isTelugu ? 'ఇక్కడ లాగిన్ అవ్వండి' : 'Log in here'}
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Verification Screen (OTP Step 2) */
            <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-xs border border-outline-variant/30 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('details')}
                  className="p-1 rounded-full hover:bg-surface-variant text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <div>
                  <h2 className="font-bold text-xl text-on-surface">
                    {isTelugu ? 'గుర్తింపు ధృవీకరణ' : 'Verify Identity'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {isTelugu ? 'దశ 2/2: ఈమెయిల్ & ఫోన్ OTP ని నిర్ధారించండి' : 'Step 2 of 2: Confirm Email & Phone'}
                  </p>
                </div>
              </div>

              {/* Simulated OTP Notification Banner */}
              <div className="bg-sand-soft border border-primary/30 rounded-xl p-3.5 text-xs text-on-surface space-y-1">
                <p className="font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">mark_email_read</span>
                  {isTelugu ? 'ధృవీకరణ OTP పంపబడింది!' : 'Verification OTP Sent!'}
                </p>
                <div className="text-[11px] text-outline font-mono space-y-0.5">
                  <p>{isTelugu ? 'ఈమెయిల్ కోడ్:' : 'Email Code:'} <strong className="text-primary">{generatedEmailCode}</strong> ({email})</p>
                  <p>{isTelugu ? 'మొబైల్ కోడ్:' : 'Mobile Code:'} <strong className="text-primary">{generatedPhoneCode}</strong> (+91 {mobile})</p>
                  <p className="text-[10px] text-on-surface-variant pt-1 italic">
                    {isTelugu ? 'డెమో కోసం: రెండింటికీ 123456 నమోదు చేయవచ్చు' : 'Demo shortcut code: enter 123456 for both'}
                  </p>
                </div>
              </div>

              {errors.verification && (
                <div className="bg-error/10 text-error p-3 rounded-xl text-xs font-semibold">
                  {errors.verification}
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                {/* Email Verification Code */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    {isTelugu ? 'ఈమెయిల్ ధృవీకరణ కోడ్ (6 అంకెలు)' : 'Email Verification Code (6 digits)'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-sand-soft border-0 rounded-xl px-4 py-3 text-xs text-on-surface font-mono tracking-widest focus:ring-2 focus:ring-secondary outline-none text-center"
                  />
                </div>

                {/* Phone Verification Code */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    {isTelugu ? 'మొబైల్ ధృవీకరణ కోడ్ (6 అంకెలు)' : 'Phone Verification Code (6 digits)'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-sand-soft border-0 rounded-xl px-4 py-3 text-xs text-on-surface font-mono tracking-widest focus:ring-2 focus:ring-secondary outline-none text-center"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-outline">
                    {resendTimer > 0
                      ? (isTelugu ? `${resendTimer} సెకన్లలో కోడ్ తిరిగి పంపబడుతుంది` : `Resend code in ${resendTimer}s`)
                      : (isTelugu ? 'కోడ్ అందలేదా?' : "Didn't receive code?")}
                  </span>
                  {canResend && (
                    <button
                      type="button"
                      onClick={handleResendCodes}
                      className="text-primary font-bold hover:underline"
                    >
                      {isTelugu ? 'కోడ్‌లను తిరిగి పంపండి' : 'Resend Codes'}
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-teal-deep text-on-primary font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  {isTelugu ? 'ధృవీకరించి ఖాతాను సృష్టించండి' : 'Verify & Create Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Hospital, ViewMode } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HomeViewProps {
  hospitals: Hospital[];
  onNavigate: (view: ViewMode) => void;
  onSelectHospital: (hospital: Hospital) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  hospitals,
  onNavigate,
  onSelectHospital,
}) => {
  const { t, isTelugu } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAddress = (hospitalId: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(hospitalId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Home Welcome Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-teal-deep via-primary to-primary-container p-6 md:p-10 text-on-primary overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-mist/30 text-teal-mist text-xs font-bold rounded-full border border-teal-mist/40">
              <span className="material-symbols-outlined text-xs">local_hospital</span>
              {t.hospitalPartnerBadge}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 text-amber-200 text-xs font-bold rounded-full border border-amber-300/30">
              <span className="material-symbols-outlined text-xs">emergency</span>
              {t.emergencyCareBadge}
            </span>
          </div>

          <h1 className="font-bold text-2xl md:text-4xl tracking-tight font-sans leading-tight">
            {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్స్ - కోదాడ' : 'Welleni Healthcare Network'}
          </h1>
          <p className="text-sm md:text-base text-teal-mist/95 font-normal leading-relaxed max-w-2xl">
            {isTelugu
              ? 'కోదాడలోని అధికారిక భాగస్వామ్య హాస్పిటల్ వివరాలు, పూర్తి చిరునామా మరియు సంప్రదింపు సమాచారం.'
              : 'Official collaborated hospital partner details, complete physical address, and direct helpline access.'}
          </p>
        </div>
      </section>

      {/* Hospital Name and Address Cards */}
      <section className="space-y-6">
        {hospitals.map((hospital) => {
          const isCopied = copiedId === hospital.id;

          return (
            <article
              key={hospital.id}
              className="bg-surface-container-lowest rounded-3xl border border-surface-variant shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Header: Hospital Name */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-sand-soft/40 via-surface-container-lowest to-teal-mist/10 border-b border-surface-variant space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    {isTelugu ? 'అధికారిక భాగస్వామి' : 'Official Partner Hospital'}
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-bold rounded-full border border-red-300 dark:border-red-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">emergency</span>
                    {isTelugu ? '24/7 అత్యవసర సేవలు' : '24/7 Emergency Care'}
                  </span>
                </div>

                <div>
                  <h2 className="font-bold text-2xl md:text-3xl text-primary font-sans">
                    {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్' : hospital.name}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">
                    {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్స్ ప్రైవేట్ లిమిటెడ్' : 'Sri Sankalpa Hospitals Pvt. Ltd.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-on-surface-variant pt-1">
                  <div className="flex items-center gap-1 font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-base text-primary fill">star</span>
                    <span>{hospital.rating}</span>
                    <span className="text-outline">({hospital.reviewsCount} {t.reviewsCount})</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-outline">location_on</span>
                    <span>{isTelugu ? 'కోదాడ, తెలంగాణ' : hospital.location}</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <span className="font-medium text-teal-deep">
                    {hospital.distanceKm} km {isTelugu ? 'దూరంలో' : 'away'}
                  </span>
                </div>
              </div>

              {/* Body: Hospital Address & Contact Details */}
              <div className="p-4 sm:p-6 md:p-8 space-y-5 md:space-y-6">
                {/* Full Address Block */}
                <div className="p-4 sm:p-5 bg-surface-container-low rounded-2xl border border-surface-variant space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-mist/40 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <span className="material-symbols-outlined text-xl">place</span>
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-on-surface">
                        {isTelugu ? 'హాస్పిటల్ చిరునామా' : 'Hospital Address'}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-normal">
                        {isTelugu
                          ? 'హుజూర్‌నగర్ రోడ్, TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా, కోదాడ, తెలంగాణ 508206'
                          : hospital.address}
                      </p>
                      {hospital.landmark && (
                        <p className="text-xs text-outline font-medium pt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-primary">navigation</span>
                          <span>
                            {isTelugu
                              ? 'గుర్తు: TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా'
                              : `Landmark: ${hospital.landmark}`}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Android Quick Action Buttons (Copy & Google Maps Directions) */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyAddress(hospital.id, hospital.address)}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-surface-container-lowest hover:bg-teal-mist/30 text-primary border border-surface-variant rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 min-h-[42px]"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      <span>{isCopied ? t.copiedAddressBtn : t.copyAddressBtn}</span>
                    </button>

                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Sri+Sankalpa+Hospitals+Huzurnagar+Road+Kodad+Telangana+508206"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 min-h-[42px]"
                    >
                      <span className="material-symbols-outlined text-sm">directions</span>
                      <span>{isTelugu ? 'మ్యాప్స్‌లో దిశలు' : 'Google Maps Directions'}</span>
                    </a>
                  </div>
                </div>

                {/* Direct Contact Phone Numbers */}
                {hospital.phoneNumbers && hospital.phoneNumbers.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-primary">phone_in_talk</span>
                      <span>{isTelugu ? '24/7 అత్యవసర హెల్ప్‌లైన్ & ఫోన్ నంబర్లు' : '24/7 Emergency Helpline & Phone Numbers'}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {hospital.phoneNumbers.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="px-4 py-3 bg-surface-container-lowest hover:bg-primary hover:text-white text-primary border border-surface-variant/90 hover:border-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs min-h-[46px]"
                        >
                          <span className="material-symbols-outlined text-base text-primary group-hover:text-white">call</span>
                          <span>{phone}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions: Go to Hospital Page (Doctors & Features) */}
                <div className="pt-4 border-t border-surface-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
                  <p className="text-xs text-on-surface-variant">
                    {isTelugu
                      ? 'డాక్టర్ల వివరాలు మరియు హాస్పిటల్ సౌకర్యాలను హాస్పిటల్ పేజీలో చూడండి.'
                      : 'Doctor profiles, available slots, and clinical facilities are available on the Hospital page.'}
                  </p>

                  <button
                    onClick={() => {
                      onSelectHospital(hospital);
                      onNavigate('hospitals');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-teal-deep text-on-primary rounded-2xl font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 shrink-0 min-h-[48px]"
                  >
                    <span>{isTelugu ? 'హాస్పిటల్ పేజీ చూడండి (వైద్యులు & సౌకర్యాలు)' : 'View Hospital Page (Doctors & Features)'}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};


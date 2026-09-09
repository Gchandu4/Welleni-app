import React from 'react';
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
  const primaryHospital = hospitals[0];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-r from-teal-deep via-primary to-primary-container p-8 md:p-12 text-on-primary overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 bg-teal-mist/30 text-teal-mist text-xs font-bold rounded-full border border-teal-mist/40">
              🏥 {t.hospitalPartnerBadge}
            </span>
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-200 text-xs font-bold rounded-full border border-amber-300/30">
              {t.emergencyCareBadge}
            </span>
          </div>

          <h1 className="font-bold text-3xl md:text-5xl tracking-tight font-sans leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xs md:text-sm text-teal-mist/80 font-mono tracking-wide">
            {t.heroSubTitle}
          </p>

          <p className="text-sm md:text-lg text-teal-mist/95 font-normal leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('hospitals')}
              className="bg-teal-mist text-teal-deep hover:bg-white px-6 py-3.5 rounded-full font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span>{t.bookDoctorBtn}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <a
              href="tel:7095330066"
              className="bg-white/15 hover:bg-white/25 text-on-primary border border-white/30 px-6 py-3.5 rounded-full font-semibold text-xs md:text-sm transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>{t.emergencyCallBtn}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 24/7 Emergency & Address Quick Strip */}
      <section className="bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-surface-variant shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-on-surface">
                {t.hospitalAddressTitle}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {t.hospitalAddressDetail}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="tel:7095330066"
              className="px-3 py-1.5 bg-teal-mist/30 hover:bg-primary hover:text-white text-primary rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">call</span>
              7095330066
            </a>
            <a
              href="tel:7095330077"
              className="px-3 py-1.5 bg-teal-mist/30 hover:bg-primary hover:text-white text-primary rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">call</span>
              7095330077
            </a>
            <a
              href="tel:8500139123"
              className="px-3 py-1.5 bg-teal-mist/30 hover:bg-primary hover:text-white text-primary rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">call</span>
              8500139123
            </a>
          </div>
        </div>
      </section>

      {/* Specialist Doctors Showcase */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-2xl text-on-surface font-sans">
              {t.specialistDoctorsTitle}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {t.specialistDoctorsSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('hospitals')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            {t.allServicesLink} <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {primaryHospital && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {primaryHospital.doctors.map((doc) => {
              const isDrSandhya = doc.id === 'doc-sandhya';
              const docName = isTelugu ? (isDrSandhya ? t.drSandhyaName : t.drVishwaName) : doc.name;
              const docSpec = isTelugu ? (isDrSandhya ? t.drSandhyaSpecialty : t.drVishwaSpecialty) : doc.specialty;
              const docBio = isTelugu ? (isDrSandhya ? t.drSandhyaBio : t.drVishwaBio) : doc.bio;

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectHospital(primaryHospital);
                    onNavigate('hospitals');
                  }}
                  className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-mist shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                          {docName}
                        </h3>
                        {doc.qualifications && (
                          <p className="text-xs font-semibold text-primary">
                            {doc.qualifications}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant font-medium">
                          {docSpec}
                        </p>
                        {doc.registrationNo && (
                          <p className="text-[11px] text-outline font-mono">
                            {t.regNo}: {doc.registrationNo}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                      {docBio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-surface-variant flex justify-between items-center text-xs">
                    <span className="font-bold text-primary">₹{doc.fee} {t.opdFee}</span>
                    <span className="font-semibold text-primary group-hover:underline flex items-center gap-1">
                      {t.bookOpdSlot} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Core Clinical Departments */}
      <section className="space-y-4">
        <h2 className="font-bold text-2xl text-on-surface font-sans">
          {t.departmentsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('hospitals')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 bg-teal-mist/40 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">female</span>
            </div>
            <h3 className="font-bold text-base text-on-surface">{t.gynecologyDeptTitle}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t.gynecologyDeptDesc}
            </p>
          </div>

          <div
            onClick={() => onNavigate('hospitals')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">healing</span>
            </div>
            <h3 className="font-bold text-base text-on-surface">{t.surgeryDeptTitle}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t.surgeryDeptDesc}
            </p>
          </div>

          <div
            onClick={() => onNavigate('hospitals')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </div>
            <h3 className="font-bold text-base text-on-surface">{t.emergencyDeptTitle}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t.emergencyDeptDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Services Grid */}
      <section className="space-y-4">
        <h2 className="font-bold text-2xl text-on-surface font-sans">
          {t.patientServicesTitle}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('hospitals')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center space-y-3"
          >
            <div className="w-12 h-12 bg-teal-mist/40 text-primary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">local_hospital</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">{t.serviceHospitalTitle}</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{t.serviceHospitalDesc}</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('bookings')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center space-y-3"
          >
            <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">{t.serviceBookingTitle}</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{t.serviceBookingDesc}</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('profile')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center space-y-3"
          >
            <div className="w-12 h-12 bg-sand-soft text-primary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">folder_shared</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">{t.serviceRecordsTitle}</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{t.serviceRecordsDesc}</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('support')}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center space-y-3"
          >
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">{t.serviceSupportTitle}</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{t.serviceSupportDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

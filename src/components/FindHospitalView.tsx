import React, { useState } from 'react';
import { Hospital, Doctor } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface FindHospitalViewProps {
  hospitals: Hospital[];
  onSelectDoctor: (hospital: Hospital, doctor: Doctor) => void;
  onOpenFilters: () => void;
  activeChip: string;
  setActiveChip: (chip: string) => void;
}

export const FindHospitalView: React.FC<FindHospitalViewProps> = ({
  hospitals,
  onSelectDoctor,
  onOpenFilters,
  activeChip,
  setActiveChip,
}) => {
  const { t, isTelugu } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospitalForDoctors, setSelectedHospitalForDoctors] = useState<Hospital | null>(null);
  const [activeServiceTab, setActiveServiceTab] = useState<number>(0);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const chips = [
    { id: 'All Services', label: t.filterAll },
    { id: 'Gynecology & PCOD', label: t.filterGynecology },
    { id: 'Laparoscopic Surgery', label: t.filterSurgery },
    { id: 'General Physician', label: t.filterPhysician },
    { id: '24/7 Emergency', label: t.filterEmergency },
    { id: 'Kodad, Telangana', label: t.filterKodad },
  ];

  // Filtering logic
  const filteredHospitals = hospitals.filter((h) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      (h.state && h.state.toLowerCase().includes(q)) ||
      h.specialties.some((s) => s.toLowerCase().includes(q)) ||
      h.doctors.some((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || (d.bio && d.bio.toLowerCase().includes(q))) ||
      (h.services && h.services.some((srv) => srv.title.toLowerCase().includes(q) || srv.items.some((it) => it.toLowerCase().includes(q))));

    if (!matchesSearch) return false;

    if (activeChip === 'Gynecology & PCOD') {
      return h.specialties.some((s) => s.toLowerCase().includes('gynecology') || s.toLowerCase().includes('pcod'));
    }
    if (activeChip === 'Laparoscopic Surgery') {
      return h.specialties.some((s) => s.toLowerCase().includes('surgery') || s.toLowerCase().includes('piles'));
    }
    if (activeChip === 'General Physician') {
      return h.specialties.some((s) => s.toLowerCase().includes('physician') || s.toLowerCase().includes('medicine'));
    }
    if (activeChip === '24/7 Emergency') {
      return h.open247 && h.emergencyServices;
    }
    if (activeChip === 'Kodad, Telangana') {
      return h.city.toLowerCase().includes('kodad') || (h.state && h.state.toLowerCase().includes('telangana'));
    }

    return true;
  });

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Header & Search */}
      <section className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-teal-mist/30 text-primary text-xs font-bold border border-primary/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span>
              {t.hospitalPartnerBadge}
            </span>
            <span className="px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-400/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">emergency</span>
              {t.emergency247Badge}
            </span>
          </div>
          <h1 className="font-bold text-3xl md:text-4xl text-primary font-sans tracking-tight">
            {t.collaboratedTitle}
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg font-normal">
            {t.collaboratedSubtitle}
          </p>
        </div>

        {/* Search Bar & Filter Button */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-10 py-3.5 rounded-full bg-sand-soft border border-transparent focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-base text-on-surface placeholder:text-outline-variant transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <button
            onClick={onOpenFilters}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-secondary text-secondary hover:bg-secondary/10 transition-colors font-medium text-sm shrink-0 active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            {t.filtersBtn}
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {chips.map((chip) => {
            const isActive = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveChip(chip.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border-transparent'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Hospital Feature Cards */}
      <section className="space-y-8">
        {filteredHospitals.map((hospital) => (
          <article
            key={hospital.id}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Hospital Main Header Banner */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-sand-soft/50 via-surface-container-lowest to-teal-mist/10 border-b border-surface-variant">
              <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-xs">local_hospital</span>
                      {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్స్ ప్రైవేట్ లిమిటెడ్' : 'Sri Sankalpa Hospitals Pvt. Ltd.'}
                    </span>
                    <span className="px-3 py-1 bg-teal-mist/40 text-teal-deep text-xs font-bold rounded-full border border-teal-mist/60 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {isTelugu ? 'అధికారిక భాగస్వామి' : 'Partner Facility'}
                    </span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-bold rounded-full border border-red-300 dark:border-red-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">emergency</span>
                      {t.emergencyCareBadge}
                    </span>
                  </div>

                  <h2 className="font-bold text-2xl md:text-3xl text-primary font-sans">
                    {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్' : hospital.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-on-surface-variant">
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
                    <span className="font-medium text-teal-deep">{hospital.distanceKm} km {isTelugu ? 'దూరంలో' : 'away'}</span>
                  </div>

                  {/* Address Box */}
                  <div className="p-3.5 bg-surface-container-lowest/90 rounded-2xl border border-surface-variant text-xs text-on-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-1">
                      <p className="font-semibold text-on-surface flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">place</span>
                        <span>{isTelugu ? 'హుజూర్‌నగర్ రోడ్, TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా, కోదాడ, తెలంగాణ 508206' : hospital.address}</span>
                      </p>
                      {hospital.landmark && (
                        <p className="text-[11px] text-outline pl-5">
                          {isTelugu ? 'గుర్తు: TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా' : `Landmark: ${hospital.landmark}`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopyAddress(hospital.address)}
                      className="px-3 py-1.5 bg-sand-soft hover:bg-teal-mist/30 text-primary rounded-xl font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedAddress ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedAddress ? t.copiedAddressBtn : t.copyAddressBtn}</span>
                    </button>
                  </div>

                  {/* Direct Contact Phone Numbers */}
                  {hospital.phoneNumbers && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">phone_in_talk</span>
                        {t.helplineTitle}:
                      </span>
                      {hospital.phoneNumbers.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="px-3 py-1 bg-surface-container hover:bg-teal-mist/40 text-primary border border-surface-variant hover:border-primary rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-xs">call</span>
                          <span>{phone}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Doctors Showcase Section */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-on-surface font-sans flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">stethoscope</span>
                    {t.specialistDoctorsTitle}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t.specialistDoctorsSubtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hospital.doctors.map((doctor) => {
                  const isDrSandhya = doctor.id === 'doc-sandhya';
                  const docName = isTelugu ? (isDrSandhya ? t.drSandhyaName : t.drVishwaName) : doctor.name;
                  const docSpec = isTelugu ? (isDrSandhya ? t.drSandhyaSpecialty : t.drVishwaSpecialty) : doctor.specialty;
                  const docBio = isTelugu ? (isDrSandhya ? t.drSandhyaBio : t.drVishwaBio) : doctor.bio;

                  return (
                    <div
                      key={doctor.id}
                      className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant hover:border-primary hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-mist shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <h4 className="font-bold text-base md:text-lg text-on-surface group-hover:text-primary transition-colors">
                                {docName}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full bg-teal-mist/30 text-teal-deep text-[11px] font-bold">
                                ₹{doctor.fee} OPD
                              </span>
                            </div>

                            {doctor.qualifications && (
                              <p className="text-xs font-semibold text-primary">
                                {doctor.qualifications}
                              </p>
                            )}

                            <p className="text-xs text-on-surface-variant font-medium">
                              {docSpec}
                            </p>

                            {doctor.registrationNo && (
                              <p className="text-[11px] text-outline font-mono">
                                {t.regNo}: <span className="font-semibold text-on-surface">{doctor.registrationNo}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Doctor Bio & Key Focus */}
                        <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-lowest p-3 rounded-xl border border-surface-variant/50">
                          {docBio}
                        </p>

                        {/* Available Slots */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                            {t.todaySlots}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {doctor.availability.map((slot) => (
                              <span
                                key={slot}
                                className="px-2.5 py-1 bg-surface-container-lowest text-on-surface border border-surface-variant rounded-lg text-xs font-medium"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-surface-variant flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-outline">
                          <span className="material-symbols-outlined text-sm text-primary fill">star</span>
                          <span className="font-bold text-on-surface">{doctor.rating}</span>
                          <span>({doctor.reviewsCount} {t.reviewsCount})</span>
                        </div>

                        <button
                          onClick={() => onSelectDoctor(hospital, doctor)}
                          className="px-5 py-2.5 bg-primary hover:bg-teal-deep text-on-primary rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                        >
                          <span>{t.bookAppointmentBtn}</span>
                          <span className="material-symbols-outlined text-sm">calendar_month</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department & Services Explorer */}
            {hospital.services && hospital.services.length > 0 && (
              <div className="p-6 md:p-8 bg-surface-container-lowest border-t border-surface-variant space-y-6">
                <div>
                  <h3 className="font-bold text-xl text-on-surface font-sans flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">medical_services</span>
                    {t.departmentsTitle}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t.departmentsSubtitle}
                  </p>
                </div>

                {/* Service Department Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {hospital.services.map((srv, idx) => {
                    const isSelected = activeServiceTab === idx;
                    let tabTitle = srv.title;
                    if (isTelugu) {
                      if (srv.title.includes('Gynecology')) tabTitle = 'ప్రసూతి & స్త్రీల వైద్యం';
                      else if (srv.title.includes('Surgical')) tabTitle = 'లాపరోస్కోపిక్ సర్జరీ';
                      else if (srv.title.includes('Physician')) tabTitle = 'జనరల్ ఫిజీషియన్ & ఎమర్జెన్సీ';
                    }

                    return (
                      <button
                        key={srv.title}
                        onClick={() => setActiveServiceTab(idx)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface-container text-on-surface hover:bg-surface-variant border-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{srv.icon}</span>
                        <span>{tabTitle}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Department Details Card */}
                {hospital.services[activeServiceTab] && (
                  <div className="p-5 md:p-6 bg-surface-container-low rounded-2xl border border-surface-variant space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-2xl text-primary">
                          {hospital.services[activeServiceTab].icon}
                        </span>
                        <h4 className="font-bold text-base md:text-lg text-primary">
                          {isTelugu
                            ? (activeServiceTab === 0
                                ? 'ప్రసూతి మరియు స్త్రీల వైద్య సేవలు'
                                : activeServiceTab === 1
                                ? 'జనరల్ మరియు లాపరోస్కోపిక్ శస్త్రచికిత్స సేవలు'
                                : 'జనరల్ మెడిసిన్ & 24/7 అత్యవసర సేవలు')
                            : hospital.services[activeServiceTab].title}
                        </h4>
                      </div>
                      {hospital.services[activeServiceTab].badge && (
                        <span className="px-3 py-1 bg-teal-mist/30 text-teal-deep text-xs font-bold rounded-full">
                          {isTelugu ? '24/7 స్పెషలిస్ట్ సేవలు' : hospital.services[activeServiceTab].badge}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {hospital.services[activeServiceTab].items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 bg-surface-container-lowest rounded-xl border border-surface-variant/60 flex items-start gap-2.5 text-xs text-on-surface"
                        >
                          <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="font-medium leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}

        {filteredHospitals.length === 0 && (
          <div className="py-12 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/40 p-8 space-y-3">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="font-semibold text-lg text-on-surface">{t.noResultsTitle}</h3>
            <p className="text-sm text-on-surface-variant">
              {t.noResultsDesc}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveChip('All Services');
              }}
              className="mt-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold"
            >
              {t.resetFilterBtn}
            </button>
          </div>
        )}
      </section>

      {/* Doctor Selection Modal (fallback/quick modal) */}
      {selectedHospitalForDoctors && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
              <div>
                <h3 className="font-bold text-lg text-primary">
                  {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్' : selectedHospitalForDoctors.name}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {t.specialistDoctorsSubtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedHospitalForDoctors(null)}
                className="p-1 rounded-full hover:bg-surface-variant text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedHospitalForDoctors.doctors.map((doctor) => {
                const isDrSandhya = doctor.id === 'doc-sandhya';
                const docName = isTelugu ? (isDrSandhya ? t.drSandhyaName : t.drVishwaName) : doctor.name;
                const docSpec = isTelugu ? (isDrSandhya ? t.drSandhyaSpecialty : t.drVishwaSpecialty) : doctor.specialty;

                return (
                  <div
                    key={doctor.id}
                    className="p-4 rounded-xl border border-surface-variant hover:border-primary hover:bg-teal-mist/10 transition-all flex items-center justify-between gap-4 group cursor-pointer"
                    onClick={() => {
                      onSelectDoctor(selectedHospitalForDoctors, doctor);
                      setSelectedHospitalForDoctors(null);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-full object-cover border border-teal-mist shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                          {docName}
                        </h4>
                        {doctor.qualifications && (
                          <p className="text-[11px] text-primary font-medium">
                            {doctor.qualifications}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant font-medium">
                          {docSpec}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-outline">
                          <span className="flex items-center text-primary font-bold">
                            <span className="material-symbols-outlined text-xs fill mr-0.5">star</span>
                            {doctor.rating}
                          </span>
                          <span>₹{doctor.fee} OPD</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold group-hover:bg-teal-deep transition-colors shrink-0">
                      {t.bookAppointmentBtn}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

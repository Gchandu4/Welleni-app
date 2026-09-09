import React, { useState } from 'react';
import { UserProfile, MedicalRecord, Booking, Patient, MedicationReminder } from '../types';
import { MedicationRemindersSection } from './MedicationRemindersSection';
import { exportBookingToIcs } from '../utils/calendarExport';
import { useLanguage } from '../i18n/LanguageContext';

interface ProfileRecordsViewProps {
  user: UserProfile;
  records: MedicalRecord[];
  onAddRecord: (newRecord: MedicalRecord) => void;
  upcomingBooking?: Booking | null;
  onNavigateToBookings: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  savedPatients: Patient[];
  onAddPatient: (patient) => void;
  onDeletePatient: (patientId: string) => void;
  onSetDefaultPatient: (patientId: string) => void;
  onNavigateToLogin: () => void;
  medicationReminders: MedicationReminder[];
  onAddMedicationReminder: (reminder: MedicationReminder) => void;
  onUpdateMedicationReminder: (reminder: MedicationReminder) => void;
  onDeleteMedicationReminder: (id: string) => void;
  onToggleMedicationReminder: (id: string) => void;
  onTriggerTestReminder: (reminder: MedicationReminder) => void;
  onShowToast?: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'calendar') => void;
}

export const ProfileRecordsView: React.FC<ProfileRecordsViewProps> = ({
  user,
  records,
  onAddRecord,
  upcomingBooking,
  onNavigateToBookings,
  isLoggedIn,
  onLogout,
  savedPatients,
  onAddPatient,
  onDeletePatient,
  onSetDefaultPatient,
  onNavigateToLogin,
  medicationReminders,
  onAddMedicationReminder,
  onUpdateMedicationReminder,
  onDeleteMedicationReminder,
  onToggleMedicationReminder,
  onTriggerTestReminder,
  onShowToast,
}) => {
  const { t, isTelugu } = useLanguage();
  const [activeTab, setActiveTab] = useState<'view' | 'upload'>('view');
  const [selectedRecordForPreview, setSelectedRecordForPreview] = useState<MedicalRecord | null>(null);
  const [exportedUpcomingId, setExportedUpcomingId] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [fileTitleInput, setFileTitleInput] = useState('');

  // Add family member/patient modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientRelation, setNewPatientRelation] = useState('Spouse');
  const [newPatientAge, setNewPatientAge] = useState(30);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newPatientPhone, setNewPatientPhone] = useState('+91 ');

  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsUploading(true);

      setTimeout(() => {
        const extension = (file.name.split('.').pop()?.toUpperCase() as 'PDF' | 'JPG' | 'PNG') || 'PDF';
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

        const newRec: MedicalRecord = {
          id: `rec-${Date.now()}`,
          title: fileTitleInput.trim() || file.name.replace(/\.[^/.]+$/, ''),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          fileType: ['PDF', 'JPG', 'PNG'].includes(extension) ? (extension as 'PDF' | 'JPG' | 'PNG') : 'PDF',
          fileSize: `${sizeMb} MB`,
          category: 'General',
        };

        onAddRecord(newRec);
        setIsUploading(false);
        setUploadSuccessMsg(isTelugu ? `"${newRec.title}" విజయవంతంగా అప్‌లోడ్ అయింది!` : `Successfully uploaded "${newRec.title}"!`);
        setFileTitleInput('');
        setTimeout(() => setUploadSuccessMsg(''), 4000);
        setActiveTab('view');
      }, 1000);
    }
  };

  const handleAddNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      name: newPatientName.trim(),
      relation: newPatientRelation,
      age: Number(newPatientAge) || 25,
      gender: newPatientGender,
      phone: newPatientPhone.trim() || user.phone,
    };

    onAddPatient(newPat);
    setNewPatientName('');
    setShowAddPatientModal(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto py-2 md:py-4 space-y-8 animate-in fade-in duration-300">
      {/* Logged Out Banner Warning */}
      {!isLoggedIn && (
        <div className="bg-sand-soft border border-primary/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-mist flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">{isTelugu ? 'మీరు ప్రస్తుతం లాగౌట్ అయి ఉన్నారు' : 'You are currently logged out'}</h3>
              <p className="text-xs text-on-surface-variant">
                {isTelugu ? 'మీ మెడికల్ రికార్డులు, సేవ్ చేసిన కుటుంబ వివరాలు మరియు అపాయింట్‌మెంట్‌లను యాక్సెస్ చేయడానికి లాగిన్ చేయండి.' : 'Log in or register to securely access your medical records, saved family patient details, and appointment bookings.'}
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToLogin}
            className="px-5 py-2.5 bg-primary hover:bg-teal-deep text-on-primary font-semibold text-xs rounded-xl transition-all shrink-0"
          >
            {isTelugu ? 'ఇప్పుడే లాగిన్ అవ్వండి' : 'Log In Now'}
          </button>
        </div>
      )}

      {/* User Details Section (Bento style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main User Profile Card */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-variant relative overflow-hidden group shadow-xs">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-mist/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-surface bg-sand-soft shrink-0 shadow-sm">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-2xl md:text-3xl text-on-surface font-sans">
                    {user.name}
                  </h2>
                  {isLoggedIn && (
                    <span className="bg-teal-mist/40 text-teal-deep text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {isTelugu ? 'లాగిన్ లో ఉంది' : 'Logged In'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">
                      calendar_month
                    </span>
                    <span>{isTelugu ? 'పుట్టిన తేదీ:' : 'DOB:'} {user.dob}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-primary">
                      bloodtype
                    </span>
                    <span>{isTelugu ? 'బ్లడ్ గ్రూప్:' : 'Type:'} {user.bloodType}</span>
                  </div>
                </div>
                <p className="text-xs text-outline pt-0.5">
                  {user.email} • {user.phone}
                </p>
              </div>
            </div>

            {/* Logout button */}
            {isLoggedIn && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 bg-error/10 hover:bg-error/20 text-error font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-center shrink-0"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                {t.logoutBtn}
              </button>
            )}
          </div>
        </div>

        {/* Upcoming Appointment Card */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant flex flex-col justify-between shadow-xs hover:border-primary transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-outline uppercase tracking-wider">
                {t.upcomingAppointmentTitle}
              </h3>
              <button
                onClick={onNavigateToBookings}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t.viewAllBtn}
              </button>
            </div>

            {upcomingBooking ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-mist/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">event_available</span>
                </div>
                <div>
                  <p className="font-bold text-base md:text-lg text-on-surface">
                    {upcomingBooking.doctorSpecialty} ({upcomingBooking.doctorName})
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    {upcomingBooking.date}, {upcomingBooking.timeSlot}
                  </p>
                  <p className="text-[11px] text-primary font-semibold mt-1">
                    {upcomingBooking.hospitalName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-mist/30 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl">spa</span>
                </div>
                <div>
                  <p className="font-bold text-base text-on-surface">
                    {isTelugu ? 'డాక్టర్ సంప్రదింపు సెషన్' : 'OPD Consultation'}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్, కోదాడ' : 'Sri Sankalpa Hospital, Kodad'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {upcomingBooking && (
            <div className="pt-3 mt-3 border-t border-surface-variant flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    const { filename } = exportBookingToIcs(upcomingBooking);
                    setExportedUpcomingId(upcomingBooking.id);
                    setTimeout(() => setExportedUpcomingId(null), 3000);
                    if (onShowToast) {
                      onShowToast(
                        isTelugu ? 'క్యాలెండర్ ఈవెంట్ డౌన్‌లోడ్ అయింది' : 'Calendar Exported',
                        isTelugu ? `${upcomingBooking.doctorName} కోసం ${filename} డౌన్‌లోడ్ చేయబడింది` : `Downloaded ${filename} for ${upcomingBooking.doctorName}`,
                        'calendar'
                      );
                    }
                  } catch {
                    alert('Could not export calendar event.');
                  }
                }}
                className="w-full py-2 bg-teal-mist/30 hover:bg-primary hover:text-white text-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-primary/30 active:scale-95"
                title="Download .ics calendar event"
              >
                <span className="material-symbols-outlined text-sm">
                  {exportedUpcomingId === upcomingBooking.id ? 'check' : 'calendar_add_on'}
                </span>
                <span>{exportedUpcomingId === upcomingBooking.id ? (isTelugu ? 'డౌన్‌లోడ్ అయింది' : 'Downloaded .ics') : t.exportCalendarBtn}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Medication Reminders Section */}
      <MedicationRemindersSection
        reminders={medicationReminders}
        patients={savedPatients}
        user={user}
        onAddReminder={onAddMedicationReminder}
        onUpdateReminder={onUpdateMedicationReminder}
        onDeleteReminder={onDeleteMedicationReminder}
        onToggleReminder={onToggleMedicationReminder}
        onTriggerTestReminder={onTriggerTestReminder}
      />

      {/* Saved Patients & Family Members Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl text-on-surface font-sans">
              {t.savedPatientsTitle}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {t.savedPatientsSubtitle}
            </p>
          </div>
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-4 py-2 bg-primary hover:bg-teal-deep text-on-primary font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            {t.addFamilyMemberBtn}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {savedPatients.map((patient) => (
            <div
              key={patient.id}
              className={`bg-surface-container-lowest rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-3 relative ${
                patient.isDefault ? 'border-primary shadow-xs ring-1 ring-primary/30' : 'border-surface-variant hover:border-outline-variant'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-base text-on-surface">{patient.name}</span>
                  <span className="bg-teal-mist/40 text-teal-deep text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {patient.relation}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {patient.age} {isTelugu ? 'సంవత్సరాలు' : 'yrs'} • {patient.gender}
                </p>
                <p className="text-xs text-outline">{patient.phone}</p>
              </div>

              <div className="pt-2 border-t border-surface-variant flex items-center justify-between">
                {patient.isDefault ? (
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {t.defaultPatientBadge}
                  </span>
                ) : (
                  <button
                    onClick={() => onSetDefaultPatient(patient.id)}
                    className="text-[11px] font-semibold text-outline hover:text-primary transition-colors"
                  >
                    {t.setDefaultPatientBtn}
                  </button>
                )}

                {savedPatients.length > 1 && (
                  <button
                    onClick={() => onDeletePatient(patient.id)}
                    className="p-1 rounded-full text-outline hover:text-error hover:bg-error/10 transition-colors"
                    title="Remove Patient"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Medical Records Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl md:text-3xl text-on-surface font-sans">
            {t.medicalRecordsTitle}
          </h2>
        </div>

        {uploadSuccessMsg && (
          <div className="bg-teal-mist/30 border border-teal-mist p-3 rounded-xl text-xs text-teal-deep font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {uploadSuccessMsg}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-xs">
          {/* Tabs */}
          <div className="flex border-b border-surface-variant bg-surface-bright/50">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-4 text-sm font-semibold text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'view'
                  ? 'tab-active bg-surface-container-lowest font-bold text-primary border-b-2 border-primary'
                  : 'tab-inactive text-on-surface-variant hover:bg-surface-variant/30'
              }`}
            >
              {t.viewRecordsTab} ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 text-sm font-semibold text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'upload'
                  ? 'tab-active bg-surface-container-lowest font-bold text-primary border-b-2 border-primary'
                  : 'tab-inactive text-on-surface-variant hover:bg-surface-variant/30'
              }`}
            >
              {t.uploadRecordsTab}
            </button>
          </div>

          <div className="p-6 min-h-[320px] relative">
            {/* View Records Panel */}
            {activeTab === 'view' && (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="group flex items-center justify-between p-4 rounded-xl border border-surface-variant hover:bg-teal-mist/10 hover:border-teal-mist transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-secondary shrink-0">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-on-surface">
                          {record.title}
                        </p>
                        <p className="text-xs text-outline mt-0.5">
                          {record.date} • {record.fileType} • {record.fileSize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRecordForPreview(record)}
                        aria-label="View Record"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-variant transition-colors"
                        title="View Record"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button
                        onClick={() => {
                          alert(`${record.title} ${isTelugu ? 'డౌన్‌లోడ్ అవుతోంది...' : 'Downloading...'}`);
                        }}
                        aria-label="Download Record"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-teal-mist/40 transition-colors"
                        title="Download"
                      >
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                    </div>
                  </div>
                ))}

                {records.length === 0 && (
                  <div className="text-center py-12 text-outline">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_off</span>
                    <p className="text-sm">{isTelugu ? 'ఇంకా ఎటువంటి మెడికల్ రికార్డులు అప్‌లోడ్ చేయలేదు.' : 'No medical records uploaded yet.'}</p>
                  </div>
                )}
              </div>
            )}

            {/* Upload Records Panel */}
            {activeTab === 'upload' && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full max-w-md border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center bg-sand-soft/30 hover:bg-teal-mist/10 hover:border-primary transition-all duration-300 group relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface shadow-xs flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">
                      {isUploading ? 'sync' : 'cloud_upload'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-on-surface mb-1">
                    {isUploading ? (isTelugu ? 'రికార్డ్ అప్‌లోడ్ అవుతోంది...' : 'Uploading Record...') : (isTelugu ? 'కొత్త మెడికల్ రికార్డ్ అప్‌లోడ్ చేయండి' : 'Upload New Record')}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4">
                    {isTelugu ? 'మీ PDF లేదా ఫోటో ఫైళ్లను ఇక్కడ డ్రాగ్ చేయండి లేదా క్లిక్ చేసి ఎంచుకోండి.' : 'Drag and drop your PDF or image files here, or click to browse.'}
                  </p>

                  <div className="mb-4">
                    <input
                      type="text"
                      value={fileTitleInput}
                      onChange={(e) => setFileTitleInput(e.target.value)}
                      placeholder={isTelugu ? 'డాక్యుమెంట్ పేరు (ఉదా: రక్త పరీక్ష అక్టోబర్ 2023)' : 'Optional record title (e.g., Blood Test Oct 2023)'}
                      className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <label className="inline-block bg-primary text-on-primary font-semibold text-xs px-6 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs">
                    <span>{isUploading ? (isTelugu ? 'అప్‌లోడ్ అవుతోంది...' : 'Uploading...') : (isTelugu ? 'ఫైళ్లను ఎంచుకోండి' : 'Select Files')}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleSimulatedFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <p className="text-[11px] text-outline mt-4">
                    {isTelugu ? 'మద్దతు ఇచ్చే ఫార్మాట్‌లు: PDF, JPG, PNG (గరిష్టంగా 10MB)' : 'Supported formats: PDF, JPG, PNG (Max 10MB)'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {selectedRecordForPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
              <div>
                <h3 className="font-bold text-base text-primary">
                  {selectedRecordForPreview.title}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {selectedRecordForPreview.date} • {selectedRecordForPreview.fileSize}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecordForPreview(null)}
                className="p-1 rounded-full hover:bg-surface-variant text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-sand-soft/50 rounded-xl p-8 text-center space-y-3 border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-5xl text-primary">description</span>
              <p className="text-xs font-semibold text-on-surface">
                {isTelugu ? 'మెడికల్ రికార్డ్ ప్రివ్యూ' : 'Medical Record Document Preview'}
              </p>
              <p className="text-[11px] text-outline max-w-xs mx-auto">
                {isTelugu ? 'ధృవీకరించబడిన డిజిటల్ రికార్డు. కేవలం అధీకృత వైద్యులతో మాత్రమే పంచుకోండి.' : `Verified digital copy for patient record #${selectedRecordForPreview.id}. Keep private and share only with certified physicians.`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRecordForPreview(null)}
                className="flex-1 py-2.5 rounded-lg border border-outline-variant text-xs font-semibold hover:bg-surface-container-low"
              >
                {isTelugu ? 'మూసివేయండి' : 'Close'}
              </button>
              <button
                onClick={() => {
                  alert(isTelugu ? `${selectedRecordForPreview.title} డౌన్‌లోడ్ అవుతోంది` : `Downloading ${selectedRecordForPreview.title}`);
                  setSelectedRecordForPreview(null);
                }}
                className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-teal-deep"
              >
                {isTelugu ? 'ఫైల్ డౌన్‌లోడ్' : 'Download File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient / Family Member Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">person_add</span>
                {t.addFamilyMemberBtn}
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1 rounded-full hover:bg-surface-variant text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewPatientSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  {t.fullNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder={isTelugu ? 'ఉదా: ప్రియ వర్మ' : 'e.g. Priya Verma'}
                  className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    {isTelugu ? 'సంబంధం' : 'Relationship'}
                  </label>
                  <select
                    value={newPatientRelation}
                    onChange={(e) => setNewPatientRelation(e.target.value)}
                    className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  >
                    <option value="Spouse">{isTelugu ? 'భార్య / భర్త' : 'Spouse'}</option>
                    <option value="Child">{isTelugu ? 'పిల్లలు' : 'Child'}</option>
                    <option value="Parent">{isTelugu ? 'తల్లి / తండ్రి' : 'Parent'}</option>
                    <option value="Self">{isTelugu ? 'స్వయంగా' : 'Self'}</option>
                    <option value="Other">{isTelugu ? 'ఇతర' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    {t.ageLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    {t.genderLabel}
                  </label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  >
                    <option value="Female">{isTelugu ? 'స్త్రీ' : 'Female'}</option>
                    <option value="Male">{isTelugu ? 'పురుషుడు' : 'Male'}</option>
                    <option value="Other">{isTelugu ? 'ఇతర' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="text"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    placeholder="+91 98765 12345"
                    className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-variant"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-teal-deep text-on-primary text-xs font-semibold transition-all shadow-xs"
                >
                  {isTelugu ? 'పేషెంట్‌ను సేవ్ చేయండి' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 text-center border border-outline-variant/30 shadow-2xl space-y-4">
            <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">logout</span>
            </div>

            <div>
              <h3 className="font-bold text-xl text-on-surface">{isTelugu ? 'లాగౌట్ చేయాలా?' : 'Log Out?'}</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {isTelugu ? 'మీరు మీ అకౌంట్ నుండి ఖచ్చితంగా లాగౌట్ చేయాలనుకుంటున్నారా?' : 'Are you sure you want to log out of your account?'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-variant"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-xs"
              >
                {t.logoutBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { MedicationReminder, Patient, UserProfile } from '../types';
import { formatTime24to12 } from '../utils/medicationScheduler';
import { useLanguage } from '../i18n/LanguageContext';

interface MedicationRemindersSectionProps {
  reminders: MedicationReminder[];
  patients: Patient[];
  user: UserProfile;
  onAddReminder: (reminder: MedicationReminder) => void;
  onUpdateReminder: (reminder: MedicationReminder) => void;
  onDeleteReminder: (id: string) => void;
  onToggleReminder: (id: string) => void;
  onTriggerTestReminder: (reminder: MedicationReminder) => void;
}

const COMMON_MEDICINES = [
  'Metformin HCl',
  'Atorvastatin',
  'Amlodipine',
  'Amoxicillin',
  'Omeprazole',
  'Paracetamol',
  'Vitamin D3',
  'Multivitamin',
  'Levothyroxine',
  'Cetirizine',
];

export const MedicationRemindersSection: React.FC<MedicationRemindersSectionProps> = ({
  reminders,
  patients,
  user,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onToggleReminder,
  onTriggerTestReminder,
}) => {
  const { isTelugu } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null);

  const daysOfWeekList = [
    { id: 0, label: isTelugu ? 'ఆది' : 'Sun' },
    { id: 1, label: isTelugu ? 'సోమ' : 'Mon' },
    { id: 2, label: isTelugu ? 'మంగళ' : 'Tue' },
    { id: 3, label: isTelugu ? 'బుధ' : 'Wed' },
    { id: 4, label: isTelugu ? 'గురు' : 'Thu' },
    { id: 5, label: isTelugu ? 'శుక్ర' : 'Fri' },
    { id: 6, label: isTelugu ? 'శని' : 'Sat' },
  ];

  // Form state
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [patientName, setPatientName] = useState(user.name || 'Self');
  const [frequency, setFrequency] = useState<'daily' | 'twice-daily' | 'thrice-daily' | 'weekly' | 'custom'>('daily');
  const [times, setTimes] = useState<string[]>(['08:30']);
  const [instructions, setInstructions] = useState(isTelugu ? 'భోజనం తర్వాత' : 'After food');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [notes, setNotes] = useState('');

  const activeRemindersCount = reminders.filter((r) => r.isActive).length;

  const resetForm = () => {
    setMedicineName('');
    setDosage('');
    setPatientName(user.name || 'Self');
    setFrequency('daily');
    setTimes(['08:30']);
    setInstructions(isTelugu ? 'భోజనం తర్వాత' : 'After food');
    setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    setNotes('');
    setEditingReminder(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (reminder: MedicationReminder) => {
    setEditingReminder(reminder);
    setMedicineName(reminder.medicineName);
    setDosage(reminder.dosage);
    setPatientName(reminder.patientName);
    setFrequency(reminder.frequency);
    setTimes(reminder.times && reminder.times.length > 0 ? reminder.times : ['08:30']);
    setInstructions(reminder.instructions || (isTelugu ? 'భోజనం తర్వాత' : 'After food'));
    setDaysOfWeek(reminder.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);
    setNotes(reminder.notes || '');
    setShowAddModal(true);
  };

  const handleFrequencyChange = (freq: 'daily' | 'twice-daily' | 'thrice-daily' | 'weekly' | 'custom') => {
    setFrequency(freq);
    if (freq === 'daily') {
      setTimes(['08:30']);
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    } else if (freq === 'twice-daily') {
      setTimes(['08:30', '20:30']);
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    } else if (freq === 'thrice-daily') {
      setTimes(['08:00', '14:00', '20:00']);
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    } else if (freq === 'weekly') {
      setTimes(['10:00']);
      setDaysOfWeek([0]); // Sunday
    }
  };

  const handleAddTimeSlot = () => {
    setTimes([...times, '12:00']);
  };

  const handleRemoveTimeSlot = (index: number) => {
    if (times.length <= 1) return;
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...times];
    updated[index] = val;
    setTimes(updated);
  };

  const handleToggleDay = (dayId: number) => {
    if (daysOfWeek.includes(dayId)) {
      if (daysOfWeek.length <= 1) return; // Keep at least one day
      setDaysOfWeek(daysOfWeek.filter((d) => d !== dayId));
    } else {
      setDaysOfWeek([...daysOfWeek, dayId].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim() || !dosage.trim() || times.length === 0) return;

    if (editingReminder) {
      const updated: MedicationReminder = {
        ...editingReminder,
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        patientName,
        frequency,
        times,
        instructions: instructions.trim(),
        daysOfWeek,
        notes: notes.trim(),
      };
      onUpdateReminder(updated);
    } else {
      const newReminder: MedicationReminder = {
        id: `med-${Date.now()}`,
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        patientName,
        frequency,
        times,
        instructions: instructions.trim(),
        daysOfWeek,
        notes: notes.trim(),
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddReminder(newReminder);
    }

    setShowAddModal(false);
    resetForm();
  };

  const formatFrequencyLabel = (freq: string) => {
    if (!isTelugu) return freq.replace('-', ' ');
    switch (freq) {
      case 'daily':
        return 'రోజుకు ఒకసారి';
      case 'twice-daily':
        return 'రోజుకు రెండుసార్లు';
      case 'thrice-daily':
        return 'రోజుకు మూడుసార్లు';
      case 'weekly':
        return 'వారానికి ఒకసారి';
      default:
        return freq;
    }
  };

  return (
    <section className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-2xl md:text-3xl text-on-surface font-sans">
              {isTelugu ? 'మందుల రిమైండర్లు (Medication Reminders)' : 'Medication Reminders'}
            </h2>
            <span className="bg-primary/15 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {activeRemindersCount} {isTelugu ? 'యాక్టివ్' : 'Active'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {isTelugu
              ? 'రోజువారీ లేదా వారపు అలారాలను సెట్ చేసుకోండి. యాప్ ఓపెన్ చేసి ఉన్నప్పుడు టోస్ట్ నోటిఫికేషన్‌లు వస్తాయి.'
              : 'Set recurring daily or weekly alarms with dosage and meal instructions. Real-time toast alerts trigger when the app is open.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-primary hover:bg-teal-deep text-on-primary font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-base">alarm_add</span>
            <span>{isTelugu ? '+ కొత్త రిమైండర్ జోడించండి' : '+ Set New Reminder'}</span>
          </button>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="bg-sand-soft dark:bg-surface-variant/30 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">notifications_active</span>
          </div>
          <div>
            <span className="font-bold text-on-surface">
              {isTelugu ? 'ప్రత్యక్ష యాప్ నోటిఫికేషన్ హెచ్చరికలు' : 'Live In-App Toast Alarms'}
            </span>
            <p className="text-on-surface-variant text-[11px] mt-0.5">
              {isTelugu
                ? 'మీరు నిర్ణయించిన సమయానికి టోస్ట్ అలర్ట్ వస్తుంది. "తీసుకున్నాను" లేదా "స్నూజ్" ఎంపికలను ఉపయోగించవచ్చు.'
                : 'The reminder engine checks your schedule every minute and pops up interactive toast alerts with single-click "Mark as Taken" and snooze options.'}
            </p>
          </div>
        </div>
        {reminders.length > 0 && (
          <button
            onClick={() => onTriggerTestReminder(reminders[0])}
            className="bg-sand-soft hover:bg-teal-mist/30 text-primary font-semibold text-[11px] px-3 py-1.5 rounded-lg border border-primary/30 shrink-0 transition-colors flex items-center gap-1"
            title="Preview how a reminder toast looks"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span>{isTelugu ? 'టెస్ట్ అలర్ట్ చూడండి' : 'Test Toast Alert'}</span>
          </button>
        )}
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((reminder) => {
          return (
            <div
              key={reminder.id}
              className={`bg-surface-container-lowest rounded-2xl p-5 border transition-all space-y-3.5 relative shadow-xs flex flex-col justify-between ${
                reminder.isActive
                  ? 'border-surface-variant hover:border-primary/50'
                  : 'border-surface-variant/40 opacity-70 bg-surface/40'
              }`}
            >
              <div className="space-y-2.5">
                {/* Top Row: Title, Dosage, Toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        reminder.isActive ? 'bg-teal-mist/40 text-primary' : 'bg-surface-variant text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">pill</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-on-surface">
                          {reminder.medicineName}
                        </h3>
                        <span className="bg-sand-soft dark:bg-surface-variant text-on-surface text-[11px] font-bold px-2 py-0.5 rounded-md border border-outline-variant/40">
                          {reminder.dosage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-primary">person</span>
                          {reminder.patientName}
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium text-teal-deep dark:text-teal-mist">
                          {formatFrequencyLabel(reminder.frequency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={reminder.isActive}
                      onChange={() => onToggleReminder(reminder.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Instructions & Timing Chips */}
                <div className="space-y-2 pt-1">
                  {/* Scheduled Times */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-outline uppercase tracking-wider mr-1">
                      {isTelugu ? 'సమయాలు:' : 'Times:'}
                    </span>
                    {reminder.times.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/10 text-primary font-bold text-xs px-2.5 py-1 rounded-lg border border-primary/20 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {formatTime24to12(t)}
                      </span>
                    ))}
                  </div>

                  {/* Instructions */}
                  {reminder.instructions && (
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-sand-soft/50 dark:bg-surface-variant/30 px-3 py-1.5 rounded-xl border border-outline-variant/20">
                      <span className="material-symbols-outlined text-sm text-primary">restaurant</span>
                      <span>{reminder.instructions}</span>
                    </div>
                  )}

                  {/* Days of week indicator */}
                  {reminder.daysOfWeek && reminder.daysOfWeek.length < 7 && (
                    <div className="flex items-center gap-1 text-[10px] pt-0.5">
                      <span className="text-outline mr-1 font-semibold">{isTelugu ? 'రోజులు:' : 'Days:'}</span>
                      {daysOfWeekList.map((d) => {
                        const isDayActive = reminder.daysOfWeek?.includes(d.id);
                        return (
                          <span
                            key={d.id}
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                              isDayActive
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-variant text-outline opacity-40'
                            }`}
                          >
                            {d.label[0]}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {reminder.notes && (
                    <p className="text-[11px] text-outline italic line-clamp-1">
                      "{reminder.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-surface-variant flex items-center justify-between">
                <button
                  onClick={() => onTriggerTestReminder(reminder)}
                  className="text-[11px] font-semibold text-primary hover:text-teal-deep flex items-center gap-1 transition-colors"
                  title="Trigger instant preview alert"
                >
                  <span className="material-symbols-outlined text-sm">notifications</span>
                  <span>{isTelugu ? 'పరీక్ష అలర్ట్' : 'Test Alert'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(reminder)}
                    className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-sand-soft transition-colors"
                    title="Edit reminder"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(isTelugu ? `${reminder.medicineName} రిమైండర్‌ను తొలగించాలా?` : `Delete reminder for ${reminder.medicineName}?`)) {
                        onDeleteReminder(reminder.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors"
                    title="Delete reminder"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {reminders.length === 0 && (
          <div className="md:col-span-2 text-center py-12 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant p-8 space-y-3">
            <span className="material-symbols-outlined text-5xl text-outline">alarm_off</span>
            <h3 className="font-bold text-lg text-on-surface">
              {isTelugu ? 'రిమైండర్లు ఏవీ సెట్ చేయలేదు' : 'No medication reminders set'}
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              {isTelugu
                ? 'ఏ డోస్ మిస్ అవ్వకుండా ఉండటానికి రోజూ లేదా వారపు మందుల అలారాలను సెట్ చేసుకోండి.'
                : 'Never miss a dose. Set recurring medication reminders with meal instructions and get toast alerts.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-2 bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-teal-deep transition-all shadow-xs"
            >
              {isTelugu ? '+ మొదటి రిమైండర్‌ను సెట్ చేయండి' : '+ Create First Reminder'}
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">
                  {editingReminder ? 'edit_calendar' : 'alarm_add'}
                </span>
                <span>
                  {editingReminder
                    ? (isTelugu ? 'మందుల రిమైండర్‌ను సవరించండి' : 'Edit Medication Reminder')
                    : (isTelugu ? 'మందుల రిమైండర్ సెట్ చేయండి' : 'Set Medication Reminder')}
                </span>
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1 rounded-full hover:bg-surface-variant text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Medicine Name */}
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  {isTelugu ? 'మందు పేరు *' : 'Medicine Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder={isTelugu ? 'ఉదా: Metformin, Paracetamol' : 'e.g. Metformin, Atorvastatin, Amoxicillin'}
                  className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                />

                {/* Quick autocomplete chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-outline self-center mr-1">
                    {isTelugu ? 'త్వరిత ఎంపికలు:' : 'Quick picks:'}
                  </span>
                  {COMMON_MEDICINES.slice(0, 5).map((med) => (
                    <button
                      type="button"
                      key={med}
                      onClick={() => setMedicineName(med)}
                      className="text-[10px] bg-surface-variant/40 hover:bg-primary/20 hover:text-primary px-2 py-0.5 rounded-md transition-colors"
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dosage & Patient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    {isTelugu ? 'మోతాదు (Dosage) *' : 'Dosage & Unit *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500 mg (1 Tab), 10 ml"
                    className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    {isTelugu ? 'పేషెంట్ / కుటుంబ సభ్యులు' : 'Patient / Family Member'}
                  </label>
                  <select
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-sand-soft px-3.5 py-2.5 rounded-xl font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  >
                    <option value={user.name}>{user.name} ({isTelugu ? 'స్వయంగా' : 'Self'})</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.relation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  {isTelugu ? 'పునరావృత ఫ్రీక్వెన్సీ' : 'Recurrence Frequency'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'daily', label: isTelugu ? 'రోజుకు ఒకసారి' : 'Once Daily' },
                    { id: 'twice-daily', label: isTelugu ? 'రోజుకు 2 సార్లు' : 'Twice Daily' },
                    { id: 'thrice-daily', label: isTelugu ? 'రోజుకు 3 సార్లు' : 'Thrice Daily' },
                    { id: 'weekly', label: isTelugu ? 'వారానికి ఒకసారి' : 'Weekly' },
                  ].map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => handleFrequencyChange(f.id as any)}
                      className={`py-2 px-2.5 rounded-xl font-semibold text-center transition-all border ${
                        frequency === f.id
                          ? 'bg-primary text-on-primary border-primary shadow-2xs'
                          : 'bg-sand-soft text-on-surface-variant border-outline-variant hover:border-primary/50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-on-surface-variant">
                    {isTelugu ? 'రిమైండర్ సమయాలు *' : 'Reminder Time Slots *'}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="text-primary hover:underline font-bold text-[11px] flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>{isTelugu ? 'సమయాన్ని జోడించండి' : 'Add Time Slot'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {times.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-sand-soft p-2 rounded-xl border border-outline-variant">
                      <span className="material-symbols-outlined text-base text-primary">schedule</span>
                      <input
                        type="time"
                        required
                        value={t}
                        onChange={(e) => handleTimeChange(idx, e.target.value)}
                        className="bg-transparent font-semibold text-on-surface flex-1 outline-none text-xs"
                      />
                      <span className="text-[11px] text-outline font-semibold">
                        {formatTime24to12(t)}
                      </span>
                      {times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimeSlot(idx)}
                          className="p-1 text-outline hover:text-error rounded-md"
                          title="Remove time slot"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal Instructions */}
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  {isTelugu ? 'భోజనం / మందుల సూచనలు' : 'Meal / Dosage Instructions'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {(isTelugu
                    ? ['భోజనం తర్వాత', 'భోజనానికి ముందు', 'భోజనంతో పాటు', 'పడుకునే ముందు', 'ఖాళీ కడుపుతో', 'గోరువెచ్చని నీటితో']
                    : ['After food', 'Before food', 'With food', 'At bedtime', 'Empty stomach', 'With warm water']
                  ).map((inst) => (
                    <button
                      type="button"
                      key={inst}
                      onClick={() => setInstructions(inst)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                        instructions === inst
                          ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                          : 'bg-sand-soft text-on-surface-variant border-outline-variant hover:border-primary/40'
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder={isTelugu ? 'ప్రత్యేక సూచన (ఉదా: పాలలో కలుపుకొని)' : 'Custom instruction (e.g. Take with warm milk)'}
                  className="w-full bg-sand-soft px-3.5 py-2 rounded-xl font-medium text-on-surface border border-outline-variant outline-none focus:border-primary"
                />
              </div>

              {/* Days of Week */}
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1.5">
                  {isTelugu ? 'వారపు రోజులు' : 'Active Days of the Week'}
                </label>
                <div className="flex items-center gap-1.5 justify-between">
                  {daysOfWeekList.map((d) => {
                    const isSelected = daysOfWeek.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => handleToggleDay(d.id)}
                        className={`flex-1 py-2 rounded-xl font-bold text-center transition-all ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-2xs'
                            : 'bg-sand-soft text-outline hover:bg-surface-variant'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  {isTelugu ? 'డాక్టర్ / ప్రిస్క్రిప్షన్ నోట్స్ (ఐచ్ఛికం)' : 'Doctor / Prescription Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isTelugu ? 'ఉదా: డాక్టర్ ఆదప సంధ్య ప్రిస్క్రిప్షన్' : 'e.g. Prescribed by Dr. Adapa Sandhya'}
                  className="w-full bg-sand-soft px-3.5 py-2 rounded-xl font-medium text-on-surface border border-outline-variant outline-none focus:border-primary"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-surface-variant flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant font-semibold text-on-surface hover:bg-surface-variant"
                >
                  {isTelugu ? 'రద్దు చేయండి' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-teal-deep text-on-primary font-semibold transition-all shadow-xs"
                >
                  {editingReminder
                    ? (isTelugu ? 'మార్పులను సేవ్ చేయండి' : 'Save Changes')
                    : (isTelugu ? 'రిమైండర్‌ను సేవ్ చేయండి' : 'Save Reminder')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

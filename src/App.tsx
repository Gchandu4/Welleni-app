import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ViewMode, UserProfile, MedicalRecord, Booking, Hospital, Doctor, Patient, MedicationReminder, MedicationToastAlert } from './types';
import { INITIAL_USER, INITIAL_HOSPITALS, INITIAL_RECORDS, INITIAL_BOOKINGS, INITIAL_PATIENTS } from './data/mockData';
import { getUpcoming24hAppointments } from './utils/appointmentAlerts';
import {
  getStoredReminders,
  saveStoredReminders,
  checkDueReminders,
  playChimeSound,
  logMedicationTaken,
  formatTime24to12,
} from './utils/medicationScheduler';
import {
  fetchUserProfileFromSupabase,
  saveUserProfileToSupabase,
  fetchPatientsFromSupabase,
  savePatientToSupabase,
  deletePatientFromSupabase,
  fetchBookingsFromSupabase,
  saveBookingToSupabase,
  fetchMedicalRecordsFromSupabase,
  saveMedicalRecordToSupabase,
} from './supabase/services';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { FindHospitalView } from './components/FindHospitalView';
import { CheckoutView } from './components/CheckoutView';
import { ProfileRecordsView } from './components/ProfileRecordsView';
import { LoginView } from './components/LoginView';
import { SignUpView } from './components/SignUpView';
import { SupportView } from './components/SupportView';
import { BookingsView } from './components/BookingsView';
import { FilterModal } from './components/FilterModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ToastContainer, AppToast } from './components/ToastContainer';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [savedPatients, setSavedPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Medication reminders state
  const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>(() => getStoredReminders());
  const [medicationAlerts, setMedicationAlerts] = useState<MedicationToastAlert[]>([]);
  const [generalToasts, setGeneralToasts] = useState<AppToast[]>([]);
  const alreadyNotifiedKeysRef = useRef<Set<string>>(new Set());

  // Selected checkout doctor and hospital
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(INITIAL_HOSPITALS[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(INITIAL_HOSPITALS[0].doctors[0]);

  // Modals & Filters
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [activeChip, setActiveChip] = useState('All Distances');

  // Compute 24-hour upcoming appointment alerts dynamically
  const upcomingAlerts = useMemo(() => {
    return getUpcoming24hAppointments(bookings);
  }, [bookings]);

  // Toast Helper
  const handleShowToast = (
    title: string,
    message?: string,
    type: 'info' | 'success' | 'warning' | 'calendar' = 'info'
  ) => {
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: AppToast = { id: toastId, type, title, message };
    setGeneralToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setGeneralToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 5000);
  };

  const handleDismissGeneralToast = (toastId: string) => {
    setGeneralToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  // Medication Reminders Background Ticker (checks schedule every 30 seconds)
  useEffect(() => {
    const runReminderCheck = () => {
      const dueAlerts = checkDueReminders(medicationReminders, alreadyNotifiedKeysRef.current);
      if (dueAlerts.length > 0) {
        setMedicationAlerts((prev) => [...prev, ...dueAlerts]);
        playChimeSound();
      }
    };

    // Run immediate check and then periodic ticker
    runReminderCheck();
    const interval = setInterval(runReminderCheck, 30000);
    return () => clearInterval(interval);
  }, [medicationReminders]);

  // Medication Reminders CRUD handlers
  const handleAddMedicationReminder = (newReminder: MedicationReminder) => {
    const updated = [newReminder, ...medicationReminders];
    setMedicationReminders(updated);
    saveStoredReminders(updated);
    handleShowToast(
      'Medication Reminder Added',
      `Reminder set for "${newReminder.medicineName}" (${newReminder.dosage}) at ${newReminder.times.map(formatTime24to12).join(', ')}.`,
      'success'
    );
  };

  const handleUpdateMedicationReminder = (updatedReminder: MedicationReminder) => {
    const updated = medicationReminders.map((r) => (r.id === updatedReminder.id ? updatedReminder : r));
    setMedicationReminders(updated);
    saveStoredReminders(updated);
    handleShowToast(
      'Reminder Updated',
      `Changes saved for "${updatedReminder.medicineName}".`,
      'success'
    );
  };

  const handleDeleteMedicationReminder = (id: string) => {
    const target = medicationReminders.find((r) => r.id === id);
    const updated = medicationReminders.filter((r) => r.id !== id);
    setMedicationReminders(updated);
    saveStoredReminders(updated);
    if (target) {
      handleShowToast('Reminder Removed', `Removed reminder for "${target.medicineName}".`, 'info');
    }
  };

  const handleToggleMedicationReminder = (id: string) => {
    const updated = medicationReminders.map((r) => {
      if (r.id === id) {
        const nextState = !r.isActive;
        handleShowToast(
          nextState ? 'Reminder Activated' : 'Reminder Paused',
          `${r.medicineName} is now ${nextState ? 'active' : 'paused'}.`,
          nextState ? 'success' : 'info'
        );
        return { ...r, isActive: nextState };
      }
      return r;
    });
    setMedicationReminders(updated);
    saveStoredReminders(updated);
  };

  const handleTriggerTestReminder = (reminder: MedicationReminder) => {
    const testAlert: MedicationToastAlert = {
      id: `test-toast-${Date.now()}`,
      reminderId: reminder.id,
      medicineName: reminder.medicineName,
      dosage: reminder.dosage,
      instructions: reminder.instructions,
      patientName: reminder.patientName,
      scheduledTime: formatTime24to12(reminder.times[0] || '08:30'),
      timestamp: Date.now(),
    };
    setMedicationAlerts((prev) => [testAlert, ...prev]);
    playChimeSound();
  };

  const handleDismissMedicationAlert = (alertId: string) => {
    setMedicationAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleMarkMedicationTaken = (alert: MedicationToastAlert) => {
    logMedicationTaken(alert);
    setMedicationAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    handleShowToast(
      'Dose Logged as Taken',
      `Marked ${alert.medicineName} (${alert.dosage}) for ${alert.patientName} as taken. Great job!`,
      'success'
    );
  };

  const handleSnoozeMedication = (alert: MedicationToastAlert, minutes: number = 5) => {
    setMedicationAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    handleShowToast(
      'Reminder Snoozed',
      `We will remind you to take ${alert.medicineName} in ${minutes} minutes.`,
      'info'
    );

    setTimeout(() => {
      const snoozedAlert: MedicationToastAlert = {
        ...alert,
        id: `snoozed-${Date.now()}`,
        scheduledTime: `Snoozed (+${minutes}m)`,
        timestamp: Date.now(),
      };
      setMedicationAlerts((prev) => [snoozedAlert, ...prev]);
      playChimeSound();
    }, minutes * 60 * 1000);
  };

  // Load and seed Supabase data on mount
  useEffect(() => {
    let isMounted = true;
    async function initSupabaseData() {
      // 1. User profile
      const remoteUser = await fetchUserProfileFromSupabase();
      if (remoteUser && isMounted) {
        setUser(remoteUser);
      } else {
        saveUserProfileToSupabase(INITIAL_USER);
      }

      // 2. Saved Patients
      const remotePatients = await fetchPatientsFromSupabase();
      if (remotePatients && remotePatients.length > 0 && isMounted) {
        setSavedPatients(remotePatients);
      } else {
        INITIAL_PATIENTS.forEach((p) => savePatientToSupabase(p));
      }

      // 3. Bookings
      const remoteBookings = await fetchBookingsFromSupabase();
      if (remoteBookings && remoteBookings.length > 0 && isMounted) {
        setBookings(remoteBookings);
      } else {
        INITIAL_BOOKINGS.forEach((b) => saveBookingToSupabase(b));
      }

      // 4. Medical Records
      const remoteRecords = await fetchMedicalRecordsFromSupabase();
      if (remoteRecords && remoteRecords.length > 0 && isMounted) {
        setRecords(remoteRecords);
      } else {
        INITIAL_RECORDS.forEach((r) => saveMedicalRecordToSupabase(r));
      }
    }

    initSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Saved Patients management
  const handleSavePatient = (newPatient: Patient) => {
    savePatientToSupabase(newPatient);
    setSavedPatients((prev) => {
      const exists = prev.some((p) => p.id === newPatient.id);
      if (exists) {
        return prev.map((p) => (p.id === newPatient.id ? newPatient : p));
      }
      return [...prev, newPatient];
    });
  };

  const handleDeletePatient = (patientId: string) => {
    deletePatientFromSupabase(patientId);
    setSavedPatients((prev) => prev.filter((p) => p.id !== patientId));
  };

  const handleSetDefaultPatient = (patientId: string) => {
    setSavedPatients((prev) => {
      const updated = prev.map((p) => ({
        ...p,
        isDefault: p.id === patientId,
      }));
      updated.forEach((p) => savePatientToSupabase(p));
      return updated;
    });
  };

  // Handle selecting doctor from hospital list or modal
  const handleSelectDoctor = (hospital: Hospital, doctor: Doctor) => {
    setSelectedHospital(hospital);
    setSelectedDoctor(doctor);
    setCurrentView('checkout');
  };

  // Handle successful checkout payment
  const handlePaymentSuccess = (newBooking: Booking) => {
    saveBookingToSupabase(newBooking);
    setBookings((prev) => [newBooking, ...prev]);
    setCurrentView('bookings');
  };

  // Add new uploaded medical record
  const handleAddRecord = (newRecord: MedicalRecord) => {
    saveMedicalRecordToSupabase(newRecord);
    setRecords((prev) => [newRecord, ...prev]);
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, status: 'Cancelled' as const };
          saveBookingToSupabase(updated);
          return updated;
        }
        return b;
      })
    );
  };

  // Handle login
  const handleLoginSuccess = (identifier: string) => {
    setIsLoggedIn(true);
    const updatedUser: UserProfile = {
      ...user,
      email: identifier.includes('@') ? identifier : user.email,
      phone: !identifier.includes('@') ? identifier : user.phone,
    };
    setUser(updatedUser);
    saveUserProfileToSupabase(updatedUser);
    setCurrentView('profile');
  };

  // Handle signup
  const handleSignUpSuccess = (name: string, email: string, mobile: string) => {
    setIsLoggedIn(true);
    const updatedUser: UserProfile = {
      name,
      email,
      phone: mobile ? `+91 ${mobile}` : '+91 98765 43210',
      dob: '12 May 1985',
      bloodType: 'O+',
      avatarUrl: INITIAL_USER.avatarUrl,
    };
    setUser(updatedUser);
    saveUserProfileToSupabase(updatedUser);
    setCurrentView('profile');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  // Filter application
  const handleApplyFilters = (filters: {
    city: string;
    maxDistance: number;
    minRating: number;
    open247Only: boolean;
    emergencyOnly: boolean;
  }) => {
    let filtered = [...INITIAL_HOSPITALS];
    if (filters.city !== 'All') {
      filtered = filtered.filter((h) => h.city.toLowerCase() === filters.city.toLowerCase());
    }
    filtered = filtered.filter((h) => h.distanceKm <= filters.maxDistance);
    filtered = filtered.filter((h) => h.rating >= filters.minRating);
    if (filters.open247Only) {
      filtered = filtered.filter((h) => h.open247);
    }
    if (filters.emergencyOnly) {
      filtered = filtered.filter((h) => h.emergencyServices);
    }
    setHospitals(filtered);
  };

  const upcomingBooking = bookings.find((b) => b.status === 'Confirmed');

  return (
    <div className="min-h-screen bg-[#f9f9f8] text-[#191c1c] flex flex-col font-sans pb-24 md:pb-6">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        unreadCount={1}
        upcomingAlerts={upcomingAlerts}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Canvas Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-3 sm:px-4 md:px-10 pt-3 md:pt-6 pb-24 md:pb-8">
        {currentView === 'home' && (
          <HomeView
            hospitals={hospitals}
            onNavigate={setCurrentView}
            onSelectHospital={(h) => {
              setSelectedHospital(h);
              if (h.doctors.length > 0) setSelectedDoctor(h.doctors[0]);
            }}
          />
        )}

        {currentView === 'hospitals' && (
          <FindHospitalView
            hospitals={hospitals}
            onSelectDoctor={handleSelectDoctor}
            onOpenFilters={() => setIsFilterModalOpen(true)}
            activeChip={activeChip}
            setActiveChip={setActiveChip}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            doctor={selectedDoctor}
            hospital={selectedHospital}
            savedPatients={savedPatients}
            onSavePatient={handleSavePatient}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentView('hospitals')}
          />
        )}

        {currentView === 'profile' && (
          <ProfileRecordsView
            user={user}
            records={records}
            onAddRecord={handleAddRecord}
            upcomingBooking={upcomingBooking}
            onNavigateToBookings={() => setCurrentView('bookings')}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            savedPatients={savedPatients}
            onAddPatient={handleSavePatient}
            onDeletePatient={handleDeletePatient}
            onSetDefaultPatient={handleSetDefaultPatient}
            onNavigateToLogin={() => setCurrentView('login')}
            medicationReminders={medicationReminders}
            onAddMedicationReminder={handleAddMedicationReminder}
            onUpdateMedicationReminder={handleUpdateMedicationReminder}
            onDeleteMedicationReminder={handleDeleteMedicationReminder}
            onToggleMedicationReminder={handleToggleMedicationReminder}
            onTriggerTestReminder={handleTriggerTestReminder}
            onShowToast={handleShowToast}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignUp={() => setCurrentView('signup')}
          />
        )}

        {currentView === 'signup' && (
          <SignUpView
            onSignUpSuccess={handleSignUpSuccess}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'support' && (
          <SupportView onOpenLiveChat={() => setIsAIChatOpen(true)} />
        )}

        {currentView === 'bookings' && (
          <BookingsView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onNavigateToHospitals={() => setCurrentView('hospitals')}
            onShowToast={handleShowToast}
          />
        )}
      </main>

      {/* Floating In-App Toast Container (Medication Alerts & System Actions) */}
      <ToastContainer
        medicationAlerts={medicationAlerts}
        generalToasts={generalToasts}
        onDismissMedicationAlert={handleDismissMedicationAlert}
        onMarkMedicationTaken={handleMarkMedicationTaken}
        onSnoozeMedication={handleSnoozeMedication}
        onDismissGeneralToast={handleDismissGeneralToast}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        upcomingCount={upcomingAlerts.length}
      />

      {/* Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <AIAssistantModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}


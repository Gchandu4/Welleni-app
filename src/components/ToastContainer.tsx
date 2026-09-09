import React from 'react';
import { MedicationToastAlert } from '../types';

export interface AppToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'calendar';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContainerProps {
  medicationAlerts: MedicationToastAlert[];
  generalToasts: AppToast[];
  onDismissMedicationAlert: (alertId: string) => void;
  onMarkMedicationTaken: (alert: MedicationToastAlert) => void;
  onSnoozeMedication: (alert: MedicationToastAlert, minutes?: number) => void;
  onDismissGeneralToast: (toastId: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  medicationAlerts,
  generalToasts,
  onDismissMedicationAlert,
  onMarkMedicationTaken,
  onSnoozeMedication,
  onDismissGeneralToast,
}) => {
  if (medicationAlerts.length === 0 && generalToasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 md:right-6 z-[100] flex flex-col gap-3 max-w-sm md:max-w-md w-full pointer-events-none"
    >
      {/* Medication Reminder Toasts */}
      {medicationAlerts.map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto bg-surface-container-lowest dark:bg-surface-dim border-2 border-primary/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300 transition-all hover:border-primary ring-2 ring-primary/20"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/30 relative">
              <span className="material-symbols-outlined text-2xl animate-pulse">medication</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-primary/15 text-primary font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Medication Reminder
                  </span>
                  <span className="text-[11px] font-semibold text-outline">
                    {alert.scheduledTime}
                  </span>
                </div>
                <button
                  onClick={() => onDismissMedicationAlert(alert.id)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Dismiss medication reminder"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-sm text-on-surface leading-tight">
                  {alert.medicineName}
                </h4>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  Dosage: {alert.dosage}
                </p>
              </div>

              {alert.instructions && (
                <p className="text-xs text-on-surface-variant bg-sand-soft/80 dark:bg-surface-variant/40 p-2 rounded-lg border border-outline-variant/30 flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">info</span>
                  <span>{alert.instructions}</span>
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                <span>Patient: <strong className="text-on-surface font-semibold">{alert.patientName}</strong></span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-surface-variant">
                <button
                  onClick={() => onMarkMedicationTaken(alert)}
                  className="flex-1 bg-primary hover:bg-teal-deep text-on-primary font-semibold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Taken</span>
                </button>
                <button
                  onClick={() => onSnoozeMedication(alert, 5)}
                  className="px-3 py-2 bg-sand-soft hover:bg-surface-variant text-on-surface font-semibold text-xs rounded-xl transition-all flex items-center gap-1 border border-outline-variant active:scale-95"
                  title="Remind in 5 minutes"
                >
                  <span className="material-symbols-outlined text-sm">snooze</span>
                  <span>5m</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* General / Calendar Export Toasts */}
      {generalToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-surface-container-lowest dark:bg-surface-dim border border-primary/30 rounded-2xl p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-mist/40 text-teal-deep flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">
                {toast.type === 'calendar' ? 'event_upcoming' : 'check_circle'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-on-surface">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismissGeneralToast(toast.id)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

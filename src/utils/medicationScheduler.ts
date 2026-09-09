import { MedicationReminder, MedicationToastAlert } from '../types';

export const INITIAL_MEDICATION_REMINDERS: MedicationReminder[] = [
  {
    id: 'med-1',
    medicineName: 'Metformin Hydrochloride',
    dosage: '500 mg (1 Tablet)',
    times: ['08:30', '20:30'],
    frequency: 'twice-daily',
    instructions: 'Take after meal with a full glass of water',
    patientName: 'Rahul Verma',
    isActive: true,
    startDate: '2026-08-01',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    notes: 'Prescribed by Dr. Aanya Sharma for blood glucose regulation.',
    createdAt: '2026-08-01',
  },
  {
    id: 'med-2',
    medicineName: 'Atorvastatin',
    dosage: '10 mg (1 Tablet)',
    times: ['21:00'],
    frequency: 'daily',
    instructions: 'Take at bedtime with water',
    patientName: 'Rahul Verma',
    isActive: true,
    startDate: '2026-08-15',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    notes: 'Cholesterol management routine.',
    createdAt: '2026-08-15',
  },
  {
    id: 'med-3',
    medicineName: 'Vitamin D3 Cholecalciferol',
    dosage: '60,000 IU (1 Capsule)',
    times: ['10:00'],
    frequency: 'weekly',
    instructions: 'Take with breakfast (with milk or fatty meal)',
    patientName: 'Rahul Verma',
    isActive: true,
    startDate: '2026-08-01',
    daysOfWeek: [0], // Sunday
    notes: 'Weekly bone & immune strength booster.',
    createdAt: '2026-08-01',
  },
  {
    id: 'med-4',
    medicineName: 'Calcium Carbonate + D3',
    dosage: '500 mg (1 Chewable Tab)',
    times: ['14:00'],
    frequency: 'daily',
    instructions: 'Take after lunch',
    patientName: 'Priya Verma',
    isActive: true,
    startDate: '2026-08-10',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    notes: 'Daily mineral supplement.',
    createdAt: '2026-08-10',
  },
];

const STORAGE_KEY = 'welleni_medication_reminders_v2';
const LOG_STORAGE_KEY = 'welleni_medication_taken_log_v2';

export function getStoredReminders(): MedicationReminder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return INITIAL_MEDICATION_REMINDERS;
}

export function saveStoredReminders(reminders: MedicationReminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch {
    // ignore
  }
}

export interface MedicationTakenLog {
  id: string;
  reminderId: string;
  medicineName: string;
  dosage: string;
  patientName: string;
  takenAt: string;
  timestamp: number;
}

export function getMedicationTakenLogs(): MedicationTakenLog[] {
  try {
    const data = localStorage.getItem(LOG_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return [];
}

export function logMedicationTaken(reminder: MedicationReminder | MedicationToastAlert): void {
  try {
    const logs = getMedicationTakenLogs();
    const newLog: MedicationTakenLog = {
      id: `log-${Date.now()}`,
      reminderId: 'reminderId' in reminder ? reminder.reminderId : reminder.id,
      medicineName: reminder.medicineName,
      dosage: reminder.dosage,
      patientName: reminder.patientName,
      takenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp: Date.now(),
    };
    logs.unshift(newLog);
    // Keep last 50 logs
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch {
    // ignore
  }
}

/**
 * Formats "08:30" (24h) to "08:30 AM" (12h)
 */
export function formatTime24to12(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let hours = parseInt(hStr, 10);
  const minutes = mStr || '00';
  if (isNaN(hours)) return time24;
  const meridian = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${meridian}`;
}

/**
 * Checks if any active reminders match the current time.
 */
export function checkDueReminders(
  reminders: MedicationReminder[],
  alreadyNotifiedKeys: Set<string>
): MedicationToastAlert[] {
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime24 = `${currentHours}:${currentMinutes}`;
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat
  const currentDateKey = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

  const alerts: MedicationToastAlert[] = [];

  for (const reminder of reminders) {
    if (!reminder.isActive) continue;

    // Check day of week if specified
    if (reminder.daysOfWeek && reminder.daysOfWeek.length > 0) {
      if (!reminder.daysOfWeek.includes(currentDayOfWeek)) {
        continue;
      }
    }

    // Check times
    for (const time of reminder.times) {
      if (time === currentTime24) {
        const uniqueKey = `${reminder.id}-${currentDateKey}-${time}`;
        if (!alreadyNotifiedKeys.has(uniqueKey)) {
          alreadyNotifiedKeys.add(uniqueKey);
          alerts.push({
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            reminderId: reminder.id,
            medicineName: reminder.medicineName,
            dosage: reminder.dosage,
            instructions: reminder.instructions,
            patientName: reminder.patientName,
            scheduledTime: formatTime24to12(time),
            timestamp: Date.now(),
          });
        }
      }
    }
  }

  return alerts;
}

/**
 * Plays a pleasant, subtle reminder chime using Web Audio API.
 */
export function playChimeSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Note 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.001, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Note 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.001, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.7);
  } catch {
    // Audio might be blocked by autoplay policies; fail silently
  }
}

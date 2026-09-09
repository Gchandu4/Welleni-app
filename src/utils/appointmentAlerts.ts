import { Booking } from '../types';

export interface UpcomingAppointmentAlert {
  booking: Booking;
  appointmentDate: Date;
  diffMinutes: number;
  diffHours: number;
  isWithin24Hours: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  timeRemainingFormatted: string;
}

/**
 * Parses appointment date and time strings into a valid JavaScript Date.
 * Supports formats:
 * - 'Today', 'Tomorrow'
 * - ISO strings: '2026-09-02', '2026-09-03T10:30:00'
 * - Formats like 'Oct 24, 2026', 'Sep 02, 2026', '24 Oct 2026'
 * - Time slots: '10:30 AM', '02:00 PM', '4:30 PM', '14:00'
 */
export function parseAppointmentDateTime(dateStr?: string, timeSlotStr?: string): Date | null {
  if (!dateStr) return null;

  const now = new Date();
  let baseDate = new Date();

  const cleanDate = dateStr.trim().toLowerCase();

  if (cleanDate === 'today') {
    baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (cleanDate === 'tomorrow') {
    baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else {
    // Attempt standard parsing
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    } else {
      // Try to parse 'Oct 24, 2023' or '24 Oct 2023'
      const parts = dateStr.replace(/,/g, '').split(' ');
      if (parts.length >= 3) {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const mIndex = monthNames.findIndex((m) => parts[0].toLowerCase().startsWith(m) || parts[1].toLowerCase().startsWith(m));
        if (mIndex !== -1) {
          const day = parseInt(parts.find((p) => /^\d{1,2}$/.test(p)) || '1', 10);
          const year = parseInt(parts.find((p) => /^\d{4}$/.test(p)) || String(now.getFullYear()), 10);
          baseDate = new Date(year, mIndex, day);
        }
      }
    }
  }

  // Parse time slot if available (e.g. "10:30 AM", "02:00 PM", "16:00")
  let hours = 10;
  let minutes = 30;

  if (timeSlotStr) {
    const timeMatch = timeSlotStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const meridian = timeMatch[3] ? timeMatch[3].toUpperCase() : null;

      if (meridian === 'PM' && h < 12) {
        h += 12;
      } else if (meridian === 'AM' && h === 12) {
        h = 0;
      }
      hours = h;
      minutes = m;
    }
  }

  const finalDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    0,
    0
  );

  return finalDate;
}

/**
 * Formats time remaining until an appointment.
 */
export function formatTimeRemaining(diffMinutes: number): string {
  if (diffMinutes < 0) {
    if (diffMinutes > -60) return 'Happening now';
    return 'Recently passed';
  }
  if (diffMinutes < 60) {
    return `in ${Math.max(1, Math.round(diffMinutes))} mins`;
  }
  const hours = Math.floor(diffMinutes / 60);
  const mins = Math.round(diffMinutes % 60);
  if (mins === 0) {
    return `in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `in ${hours}h ${mins}m`;
}

/**
 * Analyzes all confirmed bookings and returns upcoming appointments scheduled within the next 24 hours.
 */
export function getUpcoming24hAppointments(bookings: Booking[]): UpcomingAppointmentAlert[] {
  const now = new Date();
  const alerts: UpcomingAppointmentAlert[] = [];

  for (const booking of bookings) {
    if (booking.status !== 'Confirmed') continue;

    const aptDate = parseAppointmentDateTime(booking.date, booking.timeSlot);
    if (!aptDate) continue;

    const diffMs = aptDate.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = diffMinutes / 60;

    // Window: From -45 minutes (ongoing consultation) up to 24 hours (1440 minutes) ahead
    const isWithin24Hours = diffMinutes >= -45 && diffMinutes <= 24 * 60;

    if (isWithin24Hours) {
      const isToday =
        aptDate.getDate() === now.getDate() &&
        aptDate.getMonth() === now.getMonth() &&
        aptDate.getFullYear() === now.getFullYear();

      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const isTomorrow =
        aptDate.getDate() === tomorrow.getDate() &&
        aptDate.getMonth() === tomorrow.getMonth() &&
        aptDate.getFullYear() === tomorrow.getFullYear();

      alerts.push({
        booking,
        appointmentDate: aptDate,
        diffMinutes,
        diffHours,
        isWithin24Hours: true,
        isToday,
        isTomorrow,
        timeRemainingFormatted: formatTimeRemaining(diffMinutes),
      });
    }
  }

  // Sort earliest appointment first
  return alerts.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());
}

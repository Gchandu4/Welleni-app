import { Booking } from '../types';
import { parseAppointmentDateTime } from './appointmentAlerts';

/**
 * Formats a Date object into iCalendar timestamp string (UTC format: YYYYMMDDTHHMMSSZ).
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escapes characters for iCalendar format string.
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates and triggers a .ics file download for a confirmed booking.
 * Compatible with Apple Calendar, Google Calendar, Microsoft Outlook, and Yahoo Calendar.
 */
export function exportBookingToIcs(booking: Booking): { success: boolean; filename: string } {
  // Parse appointment start date
  const parsedStartDate = parseAppointmentDateTime(booking.date, booking.timeSlot) || new Date();
  
  // Default appointment duration is 45 minutes
  const parsedEndDate = new Date(parsedStartDate.getTime() + 45 * 60 * 1000);
  const now = new Date();

  const summary = `Doctor Consultation: ${booking.doctorName} (${booking.doctorSpecialty})`;
  const description = `Doctor Appointment with ${booking.doctorName} (${booking.doctorSpecialty})\n\n` +
    `Patient: ${booking.patientName}${booking.patientRelation ? ` (${booking.patientRelation})` : ''}\n` +
    `Hospital: ${booking.hospitalName}\n` +
    `Date & Time: ${booking.date} at ${booking.timeSlot} (${booking.sessionType || 'Consultation'})\n` +
    `Booking ID: ${booking.id}\n` +
    `Status: ${booking.status}\n` +
    `Consultation Fee: ₹${booking.consultationFee}\n\n` +
    `Please arrive 15 minutes before your scheduled slot. Carry any prior medical records or prescriptions.`;

  const location = booking.hospitalName;
  const uid = `welleni-booking-${booking.id}-${Date.now()}@welleni.health`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Welleni Healthcare//Doctor Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Welleni Appointments',
    'X-WR-TIMEZONE:UTC',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(parsedStartDate)}`,
    `DTEND:${formatIcsDate(parsedEndDate)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'STATUS:CONFIRMED',
    'CATEGORIES:APPOINTMENT,HEALTHCARE,MEDICAL',
    'BEGIN:VALARM',
    'TRIGGER:-PT1440M', // 24 hours before
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Appointment tomorrow with ${escapeIcsText(booking.doctorName)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT60M', // 1 hour before
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Appointment with ${escapeIcsText(booking.doctorName)} in 1 hour`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsContent = icsLines.join('\r\n');
  const sanitizedDoctor = booking.doctorName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `appointment_${booking.id}_${sanitizedDoctor}.ics`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return { success: true, filename };
}

/**
 * Generates a direct Google Calendar web event URL for convenience.
 */
export function getGoogleCalendarUrl(booking: Booking): string {
  const parsedStartDate = parseAppointmentDateTime(booking.date, booking.timeSlot) || new Date();
  const parsedEndDate = new Date(parsedStartDate.getTime() + 45 * 60 * 1000);

  const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const startIso = formatGCalDate(parsedStartDate);
  const endIso = formatGCalDate(parsedEndDate);
  const title = encodeURIComponent(`Doctor Appointment: ${booking.doctorName} (${booking.doctorSpecialty})`);
  const details = encodeURIComponent(
    `Doctor Appointment with ${booking.doctorName} (${booking.doctorSpecialty})\n` +
    `Patient: ${booking.patientName}\nHospital: ${booking.hospitalName}\nBooking ID: ${booking.id}\nTime: ${booking.timeSlot}`
  );
  const location = encodeURIComponent(booking.hospitalName);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

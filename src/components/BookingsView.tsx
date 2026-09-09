import React, { useState } from 'react';
import { Booking } from '../types';
import { getUpcoming24hAppointments } from '../utils/appointmentAlerts';
import { exportBookingToIcs, getGoogleCalendarUrl } from '../utils/calendarExport';
import { useLanguage } from '../i18n/LanguageContext';

interface BookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onNavigateToHospitals: () => void;
  onShowToast?: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'calendar') => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onCancelBooking,
  onNavigateToHospitals,
  onShowToast,
}) => {
  const { t, isTelugu } = useLanguage();
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [exportedBookingId, setExportedBookingId] = useState<string | null>(null);

  const upcoming24hList = getUpcoming24hAppointments(bookings);
  const upcoming24hMap = new Map(upcoming24hList.map((item) => [item.booking.id, item]));

  const handleExportCalendar = (booking: Booking, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const { filename } = exportBookingToIcs(booking);
      setExportedBookingId(booking.id);
      setTimeout(() => setExportedBookingId(null), 3000);

      if (onShowToast) {
        onShowToast(
          isTelugu ? 'క్యాలెండర్ ఈవెంట్ డౌన్‌లోడ్ అయింది' : 'Calendar Event Downloaded',
          isTelugu
            ? `${booking.doctorName} అపాయింట్‌మెంట్ కోసం "${filename}" డౌన్‌లోడ్ చేయబడింది. గూగుల్/ఆపిల్ క్యాలెండర్‌లో జోడించండి.`
            : `Downloaded "${filename}" for ${booking.doctorName}. Open to add to Apple Calendar, Outlook, or Google Calendar.`,
          'calendar'
        );
      }
    } catch {
      alert(isTelugu ? 'క్యాలెండర్ ఫైల్ డౌన్‌లోడ్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Could not export calendar file. Please try again.');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-4 md:py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl md:text-3xl text-primary font-sans">
            {t.myBookingsTitle}
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant">
            {t.myBookingsSubtitle}
          </p>
        </div>
        <button
          onClick={onNavigateToHospitals}
          className="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-teal-deep transition-all shadow-xs flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>{t.bookNewBtn}</span>
        </button>
      </div>

      {/* 24h Alert Highlight Callout */}
      {upcoming24hList.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-amber-500/15 border border-amber-400/50 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40">
              <span className="material-symbols-outlined text-2xl animate-pulse">alarm</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm md:text-base text-on-surface">
                  {t.appointmentAlertTitle}
                </h3>
                <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {t.next24HoursBadge}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {t.appointmentAlertDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => {
          const alertInfo = upcoming24hMap.get(booking.id);
          const isUrgent24h = Boolean(alertInfo);

          return (
            <div
              key={booking.id}
              className={`bg-surface-container-lowest rounded-2xl p-6 border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                isUrgent24h
                  ? 'border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                  : 'border-surface-variant shadow-xs hover:border-teal-mist'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={booking.doctorPhoto}
                    alt={booking.doctorName}
                    className={`w-14 h-14 rounded-full object-cover shrink-0 ${
                      isUrgent24h ? 'border-2 border-amber-500' : 'border border-teal-mist'
                    }`}
                  />
                  {isUrgent24h && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border border-white dark:border-surface">
                      <span className="material-symbols-outlined text-[12px] block">schedule</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-on-surface">
                      {booking.doctorName}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        booking.status === 'Confirmed'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : booking.status === 'Completed'
                          ? 'bg-surface-variant text-on-surface-variant'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {isTelugu
                        ? (booking.status === 'Confirmed' ? 'ధృవీకరించబడింది' : booking.status === 'Completed' ? 'పూర్తయింది' : 'రద్దు చేయబడింది')
                        : booking.status}
                    </span>
                    {isUrgent24h && alertInfo && (
                      <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-400/60 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {isTelugu ? 'సమయం మిగిలి ఉంది: ' : 'Scheduled '}{alertInfo.timeRemainingFormatted}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant font-medium">
                    {booking.doctorSpecialty} • {booking.hospitalName}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs text-on-surface">{isTelugu ? 'పేషెంట్:' : 'Patient:'} <strong className="font-semibold">{booking.patientName}</strong></span>
                    {booking.patientRelation && (
                      <span className="bg-teal-mist/40 text-teal-deep text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                        {booking.patientRelation}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-primary font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      {booking.date} ({booking.dayOfWeek})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {booking.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-surface-variant">
                {booking.status === 'Confirmed' && (
                  <button
                    onClick={(e) => handleExportCalendar(booking, e)}
                    className="flex-1 md:flex-initial px-3.5 py-2 bg-teal-mist/30 hover:bg-primary hover:text-white text-primary font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 border border-primary/30"
                    title="Download .ics calendar event file"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {exportedBookingId === booking.id ? 'check' : 'calendar_add_on'}
                    </span>
                    <span>{exportedBookingId === booking.id ? (isTelugu ? 'డౌన్‌లోడ్ అయింది' : 'Downloaded .ics') : t.exportCalendarBtn}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBookingForDetails(booking)}
                  className="flex-1 md:flex-initial px-3.5 py-2 bg-sand-soft hover:bg-teal-mist/30 text-primary font-semibold text-xs rounded-xl transition-all"
                >
                  {t.viewDetailsBtn}
                </button>

                {booking.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      if (confirm(isTelugu ? 'ఈ అపాయింట్‌మెంట్‌ను రద్దు చేయాలనుకుంటున్నారా?' : 'Are you sure you want to cancel this booking?')) {
                        onCancelBooking(booking.id);
                      }
                    }}
                    className="px-3 py-2 text-error hover:bg-error-container/30 font-semibold text-xs rounded-xl transition-all"
                  >
                    {t.cancelBtn}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {bookings.length === 0 && (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant p-8 space-y-3">
            <span className="material-symbols-outlined text-5xl text-outline">event_busy</span>
            <h3 className="font-bold text-lg text-on-surface">{t.noBookingsTitle}</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              {t.noBookingsDesc}
            </p>
            <button
              onClick={onNavigateToHospitals}
              className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-full text-xs font-semibold"
            >
              {t.bookDoctorBtn}
            </button>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
              <div>
                <h3 className="font-bold text-lg text-primary">
                  {isTelugu ? 'బుకింగ్ రసీదు' : 'Booking Receipt'} #{selectedBookingForDetails.id}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {isTelugu ? 'స్టేటస్: ' : 'Status: '}{selectedBookingForDetails.status}
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="p-1 rounded-full hover:bg-surface-variant text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 bg-sand-soft/50 p-3 rounded-xl">
                <img
                  src={selectedBookingForDetails.doctorPhoto}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-on-surface text-sm">
                    {selectedBookingForDetails.doctorName}
                  </p>
                  <p className="text-on-surface-variant">
                    {selectedBookingForDetails.doctorSpecialty}
                  </p>
                  <p className="text-primary font-semibold">
                    {selectedBookingForDetails.hospitalName}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-surface-variant">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isTelugu ? 'పేషెంట్ పేరు:' : 'Patient Name:'}</span>
                  <span className="font-semibold text-on-surface">{selectedBookingForDetails.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isTelugu ? 'ఫోన్ నంబర్:' : 'Phone:'}</span>
                  <span className="font-semibold text-on-surface">{selectedBookingForDetails.patientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isTelugu ? 'తేదీ:' : 'Date:'}</span>
                  <span className="font-semibold text-on-surface">{selectedBookingForDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isTelugu ? 'సమయం:' : 'Time Slot:'}</span>
                  <span className="font-semibold text-on-surface">{selectedBookingForDetails.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{isTelugu ? 'చెల్లింపు విధానం:' : 'Payment Method:'}</span>
                  <span className="font-semibold text-on-surface uppercase">{selectedBookingForDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-surface-variant font-bold text-sm text-primary">
                  <span>{isTelugu ? 'చెల్లించిన మొత్తం:' : 'Total Amount Paid:'}</span>
                  <span>₹ {selectedBookingForDetails.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Calendar & Export Actions */}
            {selectedBookingForDetails.status === 'Confirmed' && (
              <div className="pt-2 border-t border-surface-variant space-y-2">
                <button
                  onClick={() => handleExportCalendar(selectedBookingForDetails)}
                  className="w-full py-2.5 bg-primary hover:bg-teal-deep text-on-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">calendar_add_on</span>
                  <span>{t.exportCalendarBtn} (.ics)</span>
                </button>

                <a
                  href={getGoogleCalendarUrl(selectedBookingForDetails)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-sand-soft hover:bg-teal-mist/30 text-primary border border-primary/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  <span>{t.addGoogleCalendarOnline}</span>
                </a>
              </div>
            )}

            <button
              onClick={() => setSelectedBookingForDetails(null)}
              className="w-full py-2 bg-surface-variant/50 text-on-surface hover:bg-surface-variant rounded-xl text-xs font-semibold transition-colors"
            >
              {isTelugu ? 'రసీదు మూసివేయండి' : 'Close Receipt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Doctor, Hospital, Booking, PaymentMethodType, Patient } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface CheckoutViewProps {
  doctor: Doctor;
  hospital: Hospital;
  savedPatients: Patient[];
  onSavePatient: (patient: Patient) => void;
  onPaymentSuccess: (booking: Booking) => void;
  onBack: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  doctor,
  hospital,
  savedPatients,
  onSavePatient,
  onPaymentSuccess,
  onBack,
}) => {
  const { t, isTelugu } = useLanguage();
  const defaultPat = savedPatients.find((p) => p.isDefault) || savedPatients[0];

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    defaultPat ? defaultPat.id : 'new'
  );

  // New or edited patient state
  const [patientName, setPatientName] = useState(defaultPat ? defaultPat.name : 'Rahul Verma');
  const [patientRelation, setPatientRelation] = useState(defaultPat ? defaultPat.relation : 'Self');
  const [patientAge, setPatientAge] = useState<number>(defaultPat ? defaultPat.age : 38);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(
    defaultPat ? defaultPat.gender : 'Male'
  );
  const [patientPhone, setPatientPhone] = useState(defaultPat ? defaultPat.phone : '+91 98765 43210');
  const [shouldSaveNewPatient, setShouldSaveNewPatient] = useState(true);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    setPatientName(patient.name);
    setPatientRelation(patient.relation);
    setPatientAge(patient.age);
    setPatientGender(patient.gender);
    setPatientPhone(patient.phone);
  };

  const handleSelectAddNew = () => {
    setSelectedPatientId('new');
    setPatientName('');
    setPatientRelation('Self');
    setPatientAge(30);
    setPatientGender('Male');
    setPatientPhone('+91 ');
  };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const consultationFee = doctor.fee || 1500;
  const platformFee = 50;
  const totalAmount = consultationFee + platformFee;

  const isDrSandhya = doctor.id === 'doc-sandhya';
  const doctorDisplayName = isTelugu ? (isDrSandhya ? t.drSandhyaName : t.drVishwaName) : doctor.name;
  const doctorDisplaySpecialty = isTelugu ? (isDrSandhya ? t.drSandhyaSpecialty : t.drVishwaSpecialty) : doctor.specialty;

  const handleConfirmPay = () => {
    if (!patientName.trim()) {
      alert(isTelugu ? 'దయచేసి పేషెంట్ పేరు నమోదు చేయండి.' : 'Please enter patient name.');
      return;
    }

    setIsProcessing(true);

    if (selectedPatientId === 'new' && shouldSaveNewPatient && patientName.trim()) {
      const newPat: Patient = {
        id: `pat-${Date.now()}`,
        name: patientName.trim(),
        relation: patientRelation,
        age: Number(patientAge) || 30,
        gender: patientGender,
        phone: patientPhone.trim(),
      };
      onSavePatient(newPat);
    }

    setTimeout(() => {
      const newBooking: Booking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorName: doctorDisplayName,
        doctorSpecialty: doctorDisplaySpecialty,
        doctorPhoto: doctor.photo,
        hospitalName: isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్' : (doctor.hospitalName || hospital.name),
        date: 'Oct 24, 2023',
        dayOfWeek: isTelugu ? 'గురువారం' : 'Thursday',
        timeSlot: doctor.availability[0] || '10:30 AM',
        sessionType: isTelugu ? 'ఉదయం సమయం' : 'Morning Session',
        consultationFee,
        platformFee,
        totalAmount,
        patientName,
        patientPhone,
        patientRelation,
        patientAge: Number(patientAge),
        patientGender,
        status: 'Confirmed',
        paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId || 'patient@upi' : undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setConfirmedBooking(newBooking);
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  const handleFinish = () => {
    if (confirmedBooking) {
      onPaymentSuccess(confirmedBooking);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-4 md:py-6 space-y-6 animate-in fade-in duration-300">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-bold text-2xl md:text-3xl text-primary font-sans">
            {t.bookingHeading}
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base">
            {t.bookingSubheading}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Summary & Patient Details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Booking Summary Card */}
          <article className="bg-surface-container-lowest rounded-2xl p-6 border border-tertiary-fixed shadow-xs space-y-6">
            <h3 className="font-bold text-lg md:text-xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl fill">assignment</span>
              {t.summaryTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Doctor Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-teal-mist overflow-hidden shrink-0 border border-teal-mist">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-on-surface">
                    {doctorDisplayName}
                  </h4>
                  <p className="text-xs text-on-surface-variant">{doctorDisplaySpecialty}</p>
                  <p className="text-xs font-semibold text-primary mt-1">
                    {isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్ (కోదాడ)' : (doctor.hospitalName || hospital.name)}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex flex-col gap-3 sm:border-l sm:border-surface-variant sm:pl-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-sand-soft text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">calendar_month</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">24 Oct, 2023</p>
                    <p className="text-xs text-on-surface-variant">{isTelugu ? 'గురువారం' : 'Thursday'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-sand-soft text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">
                      {doctor.availability[0] || '10:30 AM'}
                    </p>
                    <p className="text-xs text-on-surface-variant">{isTelugu ? 'ఉదయం ఓపీడీ' : 'Morning Session'}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-surface-variant my-4" />

            {/* Fee Breakdown */}
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>{t.consultationFeeLabel}</span>
                <span className="text-on-surface font-medium">₹ {consultationFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>{t.platformFeeLabel}</span>
                <span className="text-on-surface font-medium">₹ {platformFee}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-surface-variant mt-1">
                <span className="font-bold text-lg text-primary">{t.totalPayableLabel}</span>
                <span className="font-bold text-xl text-primary">
                  ₹ {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </article>

          {/* Patient Details Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-tertiary-fixed shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl fill">person</span>
                {t.patientInfoTitle}
              </h3>
              <span className="text-xs text-outline font-medium">{t.savedFamilyMembers}</span>
            </div>

            {/* Saved Patients Selection Chips */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {savedPatients.map((pat) => {
                  const isSelected = selectedPatientId === pat.id;
                  return (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => handleSelectPatient(pat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border text-left transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-sand-soft text-on-surface border-outline-variant/50 hover:bg-surface-variant'
                      }`}
                    >
                      <span>{pat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                        isSelected ? 'bg-on-primary/20 text-on-primary' : 'bg-teal-mist/40 text-teal-deep'
                      }`}>
                        {pat.relation}
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleSelectAddNew}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    selectedPatientId === 'new'
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : 'bg-surface text-primary border-primary/40 hover:bg-teal-mist/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  {isTelugu ? 'కొత్త పేషెంట్ వివరాలు' : 'Add New Patient'}
                </button>
              </div>
            </div>

            {/* Selected or New Patient Form Inputs */}
            <div className="pt-2 border-t border-surface-variant space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    {t.fullNameLabel} *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={isTelugu ? 'ఉదా: రాహుల్ వర్మ' : 'e.g. Rahul Verma'}
                    className="w-full bg-sand-soft px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    {isTelugu ? 'సంబంధం' : 'Relationship'}
                  </label>
                  <select
                    value={patientRelation}
                    onChange={(e) => setPatientRelation(e.target.value)}
                    className="w-full bg-sand-soft px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  >
                    <option value="Self">{isTelugu ? 'స్వయంగా (Self)' : 'Self'}</option>
                    <option value="Spouse">{isTelugu ? 'భార్య / భర్త (Spouse)' : 'Spouse'}</option>
                    <option value="Parent">{isTelugu ? 'తల్లి / తండ్రి (Parent)' : 'Parent'}</option>
                    <option value="Child">{isTelugu ? 'పిల్లలు (Child)' : 'Child'}</option>
                    <option value="Other">{isTelugu ? 'ఇతర (Other)' : 'Other'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    {t.ageLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full bg-sand-soft px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    {t.genderLabel}
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full bg-sand-soft px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  >
                    <option value="Male">{isTelugu ? 'పురుషుడు (Male)' : 'Male'}</option>
                    <option value="Female">{isTelugu ? 'స్త్రీ (Female)' : 'Female'}</option>
                    <option value="Other">{isTelugu ? 'ఇతర (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-sand-soft px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface border border-outline-variant outline-none focus:border-primary"
                  />
                </div>
              </div>

              {selectedPatientId === 'new' && (
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="save_patient_cb"
                    checked={shouldSaveNewPatient}
                    onChange={(e) => setShouldSaveNewPatient(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor="save_patient_cb" className="text-xs text-on-surface cursor-pointer select-none">
                    {isTelugu ? 'భవిష్యత్ బుకింగ్ల కోసం ఈ పేషెంట్‌ను ప్రొఫైల్ లో సేవ్ చేయండి' : 'Save this patient to profile for future bookings'}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method Selection */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-tertiary-fixed shadow-xs flex flex-col gap-6">
            <h3 className="font-bold text-lg md:text-xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl fill">
                account_balance_wallet
              </span>
              {t.paymentMethodTitle}
            </h3>

            {/* Payment Options Radio Group */}
            <div className="flex flex-col gap-3.5">
              {/* UPI Option */}
              <label
                className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-2 border-primary bg-teal-mist/10'
                    : 'border border-outline-variant/60 hover:bg-surface-container-low opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-primary focus:ring-primary h-4 w-4 border-outline"
                    />
                    <span className="font-bold text-on-surface text-base">UPI (GPay / PhonePe / Paytm)</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-8 h-7 bg-surface rounded-full shadow-xs flex items-center justify-center text-[10px] font-bold text-gray-700 border border-surface-variant">
                      GPay
                    </span>
                    <span className="w-8 h-7 bg-surface rounded-full shadow-xs flex items-center justify-center text-[10px] font-bold text-purple-700 border border-surface-variant">
                      PhPe
                    </span>
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="pl-7 mt-2 space-y-2">
                    <p className="text-xs text-on-surface-variant">
                      {isTelugu ? 'మీ UPI యాప్ ద్వారా సురక్షితంగా చెల్లించండి.' : 'Pay securely using your preferred UPI app.'}
                    </p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g., name@okaxis)"
                      className="w-full bg-sand-soft border border-outline-variant/80 rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>
                )}
              </label>

              {/* Credit / Debit Card Option */}
              <label
                className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-2 border-primary bg-teal-mist/10'
                    : 'border border-outline-variant/60 hover:bg-surface-container-low opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-primary focus:ring-primary h-4 w-4 border-outline"
                    />
                    <div>
                      <span className="font-bold text-on-surface text-sm block">
                        {t.payCard}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Visa, Mastercard, RuPay
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">credit_card</span>
                </div>

                {paymentMethod === 'card' && (
                  <div className="pl-7 mt-3 space-y-2.5">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (4532 •••• •••• 8892)"
                      className="w-full bg-sand-soft border border-outline-variant/80 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-1/2 bg-sand-soft border border-outline-variant/80 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-1/2 bg-sand-soft border border-outline-variant/80 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Pay at Hospital Option */}
              <label
                className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-2 border-primary bg-teal-mist/10'
                    : 'border border-outline-variant/60 hover:bg-surface-container-low opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-primary focus:ring-primary h-4 w-4 border-outline"
                    />
                    <div>
                      <span className="font-bold text-on-surface text-sm block">
                        {t.payAtHospital}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {isTelugu ? 'ఆసుపత్రి రిసెప్షన్ వద్ద నేరుగా చెల్లించండి' : 'Pay at Sri Sankalpa Hospital reception counter'}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">
                    local_atm
                  </span>
                </div>
              </label>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 py-2 text-outline border-t border-surface-variant mt-1">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="text-[10px] font-semibold uppercase">{isTelugu ? '100% సురక్షితమైనది' : '100% Secure'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="text-[10px] font-semibold uppercase">{isTelugu ? 'శ్రీ సంకల్ప హాస్పిటల్ ధృవీకరణ' : 'Sri Sankalpa Verified'}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleConfirmPay}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-teal-deep text-on-primary font-semibold text-sm py-4 px-6 rounded-xl transition-all flex justify-between items-center group shadow-sm active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              <span>{isProcessing ? t.processingPayment : `${t.confirmBookingBtn} (₹${totalAmount.toLocaleString()})`}</span>
              <span className="flex items-center gap-2">
                {isProcessing ? (
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                ) : (
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                )}
              </span>
            </button>
          </section>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && confirmedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 md:p-8 text-center space-y-5 border border-outline-variant/30 shadow-2xl">
            <div className="w-16 h-16 bg-teal-mist/50 text-primary rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl fill">check_circle</span>
            </div>

            <div>
              <h3 className="font-bold text-2xl text-primary font-sans">
                {t.bookingSuccessTitle}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {t.bookingIdLabel}: <span className="font-bold text-on-surface">{confirmedBooking.id}</span>
              </p>
            </div>

            <div className="bg-sand-soft/60 rounded-xl p-4 text-left text-xs space-y-2 border border-surface-variant">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isTelugu ? 'పేషెంట్:' : 'Patient:'}</span>
                <span className="font-semibold text-on-surface">
                  {confirmedBooking.patientName} ({confirmedBooking.patientRelation || 'Self'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isTelugu ? 'డాక్టర్:' : 'Doctor:'}</span>
                <span className="font-semibold text-on-surface">{confirmedBooking.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isTelugu ? 'హాస్పిటల్:' : 'Hospital:'}</span>
                <span className="font-semibold text-on-surface">{confirmedBooking.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{isTelugu ? 'తేదీ & సమయం:' : 'Date & Time:'}</span>
                <span className="font-semibold text-on-surface">
                  {confirmedBooking.date} @ {confirmedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between border-t border-surface-variant pt-2">
                <span className="text-on-surface-variant font-medium">{t.totalPayableLabel}:</span>
                <span className="font-bold text-primary">₹ {confirmedBooking.totalAmount}</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant">
              {isTelugu ? `${confirmedBooking.patientPhone} కు SMS ద్వారా వివరాలు పంపబడ్డాయి.` : `An SMS confirmation has been sent to ${confirmedBooking.patientPhone}.`}
            </p>

            <button
              onClick={handleFinish}
              className="w-full bg-primary hover:bg-teal-deep text-on-primary py-3 rounded-xl font-semibold text-sm transition-all shadow-xs"
            >
              {t.viewMyBookingsBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

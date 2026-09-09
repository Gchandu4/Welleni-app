import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te';

export interface Translations {
  // Navigation
  navHome: string;
  navServices: string;
  navBookings: string;
  navProfile: string;
  navSupport: string;
  navLogIn: string;
  navSignUp: string;
  navLogOut: string;
  langSwitchLabel: string;
  currentLangName: string;

  // Header & Alerts
  hospitalPartnerBadge: string;
  emergency247Badge: string;
  emergencyCareBadge: string;
  alert24h: string;
  upcomingAppointment: string;
  upcomingAppointmentTitle: string;
  viewDetails: string;
  viewDetailsBtn: string;
  today: string;
  tomorrow: string;
  notifications: string;
  actionNeeded: string;
  close: string;
  noNotifications: string;
  appointmentAlertTitle: string;
  next24HoursBadge: string;
  appointmentAlertDesc: string;

  // Hero Section
  heroTitle: string;
  heroSubTitle: string;
  heroDesc: string;
  bookDoctorBtn: string;
  emergencyCallBtn: string;
  emergencyPhoneLine: string;

  // Address Bar
  hospitalAddressTitle: string;
  hospitalAddressDetail: string;
  landmarkLabel: string;
  copyAddressBtn: string;
  copiedAddressBtn: string;
  helplineTitle: string;
  hospitalHelplineTitle: string;
  emergency247OpdBooking: string;
  hospitalLocationTitle: string;
  hospitalLocationDetail: string;

  // Specialist Doctors Section
  specialistDoctorsTitle: string;
  specialistDoctorsSubtitle: string;
  allServicesLink: string;
  opdFee: string;
  regNo: string;
  experienceYears: string;
  reviewsCount: string;
  todaySlots: string;
  bookOpdSlot: string;
  bookAppointmentBtn: string;

  // Departments
  departmentsTitle: string;
  departmentsSubtitle: string;
  gynecologyDeptTitle: string;
  gynecologyDeptDesc: string;
  surgeryDeptTitle: string;
  surgeryDeptDesc: string;
  emergencyDeptTitle: string;
  emergencyDeptDesc: string;

  // Patient Services Grid
  patientServicesTitle: string;
  serviceHospitalTitle: string;
  serviceHospitalDesc: string;
  serviceBookingTitle: string;
  serviceBookingDesc: string;
  serviceRecordsTitle: string;
  serviceRecordsDesc: string;
  serviceSupportTitle: string;
  serviceSupportDesc: string;

  // Find Hospital / Services View
  collaboratedTitle: string;
  collaboratedSubtitle: string;
  searchPlaceholder: string;
  filtersBtn: string;
  filterAll: string;
  filterGynecology: string;
  filterSurgery: string;
  filterPhysician: string;
  filterEmergency: string;
  filterKodad: string;
  resetFilterBtn: string;
  noResultsTitle: string;
  noResultsDesc: string;

  // Checkout & Booking Flow
  bookingHeading: string;
  bookingSubheading: string;
  selectDateTitle: string;
  selectSlotTitle: string;
  patientInfoTitle: string;
  savedFamilyMembers: string;
  addNewPatient: string;
  fullNameLabel: string;
  ageLabel: string;
  genderLabel: string;
  phoneLabel: string;
  symptomsLabel: string;
  emergencyWarningTitle: string;
  emergencyWarningDesc: string;
  summaryTitle: string;
  consultationFeeLabel: string;
  platformFeeLabel: string;
  totalPayableLabel: string;
  paymentMethodTitle: string;
  payUPI: string;
  payCard: string;
  payAtHospital: string;
  confirmBookingBtn: string;
  processingPayment: string;
  bookingSuccessTitle: string;
  bookingSuccessDesc: string;
  bookingIdLabel: string;
  downloadReceiptBtn: string;
  addToCalendarBtn: string;
  exportCalendarBtn: string;
  addGoogleCalendarOnline: string;
  viewMyBookingsBtn: string;

  // Bookings View
  myBookingsTitle: string;
  myBookingsSubtitle: string;
  upcomingTab: string;
  pastTab: string;
  confirmedBadge: string;
  cancelledBadge: string;
  completedBadge: string;
  cancelBookingBtn: string;
  cancelBtn: string;
  cancelConfirmPrompt: string;
  noBookingsTitle: string;
  noBookingsDesc: string;
  bookNewAppointmentBtn: string;
  bookNewBtn: string;

  // Profile & Medical Records
  myProfileTitle: string;
  myProfileSubtitle: string;
  personalInfoTab: string;
  medicalRecordsTab: string;
  medicalRecordsTitle: string;
  viewRecordsTab: string;
  uploadRecordsTab: string;
  familyMembersTab: string;
  medicationRemindersTab: string;
  uploadRecordBtn: string;
  addFamilyMemberBtn: string;
  addMedicationReminderBtn: string;
  takeDoseBtn: string;
  snoozeBtn: string;
  testChimeBtn: string;
  logoutBtn: string;
  viewAllBtn: string;
  savedPatientsTitle: string;
  savedPatientsSubtitle: string;
  defaultPatientBadge: string;
  setDefaultPatientBtn: string;

  // Support & AI Assistant
  supportTitle: string;
  supportSubtitle: string;
  supportHeading: string;
  supportSubheading: string;
  sendMessageTitle: string;
  replyTimeDesc: string;
  messageSentSuccess: string;
  sendMessageBtn: string;
  liveChatTitle: string;
  liveChatDesc: string;
  startChatBtn: string;
  helpCenterTitle: string;
  helpCenterDesc: string;
  faqsTitle: string;
  aiDoctorAssistantTitle: string;
  aiDoctorAssistantDesc: string;
  openAiChatBtn: string;
  callHospitalDirectly: string;
  aiChatWelcome: string;
  aiChatPlaceholder: string;
  sendBtn: string;
  quickQuestionsTitle: string;
  quickQ1: string;
  quickQ2: string;
  quickQ3: string;
  quickQ4: string;

  // Doctor Specific
  drSandhyaName: string;
  drSandhyaSpecialty: string;
  drSandhyaBio: string;
  drVishwaName: string;
  drVishwaSpecialty: string;
  drVishwaBio: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    navHome: 'Home',
    navServices: 'Services / Doctors',
    navBookings: 'Bookings',
    navProfile: 'Profile & Records',
    navSupport: 'Help & Support',
    navLogIn: 'Log In',
    navSignUp: 'Sign Up',
    navLogOut: 'Log Out',
    langSwitchLabel: 'Language',
    currentLangName: 'English',

    // Header & Alerts
    hospitalPartnerBadge: 'Official Hospital Partner',
    emergency247Badge: '24/7 Emergency Care',
    emergencyCareBadge: '24/7 Emergency & Surgical Services',
    alert24h: '24h Alert',
    upcomingAppointment: 'Upcoming Appointment',
    upcomingAppointmentTitle: 'Upcoming Appointment',
    viewDetails: 'View Details',
    viewDetailsBtn: 'View Details',
    today: 'Today',
    tomorrow: 'Tomorrow',
    notifications: 'Notifications',
    actionNeeded: 'Action Needed',
    close: 'Close',
    noNotifications: 'No unread notifications',
    appointmentAlertTitle: 'Upcoming Consultation Alert',
    next24HoursBadge: 'Next 24 Hours',
    appointmentAlertDesc: 'You have a confirmed medical appointment scheduled in the next 24 hours at Sri Sankalpa Hospital.',

    // Hero Section
    heroTitle: 'Sri Sankalpa Hospital',
    heroSubTitle: 'Sri Sankalpa Hospitals Pvt. Ltd. • Kodad, Telangana',
    heroDesc: 'Advanced Gynecology & Obstetrics, Laparoscopic Surgery, and 24/7 Emergency Physician Care. Trusted healthcare expertise serving Kodad and surrounding regions.',
    bookDoctorBtn: 'Book Doctor Appointment',
    emergencyCallBtn: 'Emergency: 7095330066',
    emergencyPhoneLine: '24/7 Emergency & Ambulance',

    // Address Bar
    hospitalAddressTitle: 'Huzurnagar Road, Kodad (Telangana 508206)',
    hospitalAddressDetail: 'Beside TTD Kalyana Mandapam, Opp. Pasuvula Santha • 24/7 Emergency Trauma & Ambulance',
    landmarkLabel: 'Landmark: Beside TTD Kalyana Mandapam, Opp. Pasuvula Santha',
    copyAddressBtn: 'Copy Address',
    copiedAddressBtn: 'Copied Address',
    helplineTitle: '24/7 Helpline & Appointments',
    hospitalHelplineTitle: 'Sri Sankalpa 24/7 Helplines',
    emergency247OpdBooking: '24/7 Emergency, Ambulance & OPD Bookings',
    hospitalLocationTitle: 'Hospital Location & Address',
    hospitalLocationDetail: 'Huzurnagar Road, beside TTD Kalyana Mandapam, Opp. Pasuvula Santha, Kodad, Telangana 508206',

    // Specialist Doctors Section
    specialistDoctorsTitle: 'Specialist Doctors',
    specialistDoctorsSubtitle: 'Certified medical practitioners available at Sri Sankalpa Hospital',
    allServicesLink: 'All Services',
    opdFee: 'OPD Consultation Fee',
    regNo: 'Reg. No',
    experienceYears: 'yrs experience',
    reviewsCount: 'patient reviews',
    todaySlots: "Today's Consultation Slots:",
    bookOpdSlot: 'Book OPD Slot',
    bookAppointmentBtn: 'Book Appointment',

    // Departments
    departmentsTitle: 'Core Healthcare Departments',
    departmentsSubtitle: 'Comprehensive healthcare, advanced laparoscopic surgical care, and 24/7 emergencies',
    gynecologyDeptTitle: 'Obstetrics & Gynecology',
    gynecologyDeptDesc: 'Period problems, PCOD/PCOS care, Infertility evaluation, Pregnancy care, Fibroids, Tubectomy & Laparoscopic gynecology.',
    surgeryDeptTitle: 'General & Laparoscopic Surgery',
    surgeryDeptDesc: 'Hernia operations, 24-hr emergency abdominal surgery, Piles, Fissure & Fistula treatment, Gallbladder surgery, Diabetic wounds care.',
    emergencyDeptTitle: 'General Medicine & 24/7 Emergency',
    emergencyDeptDesc: 'Snake/scorpion bites, Poisoning cases, Diabetes, Blood Pressure (BP), Fevers (Dengue/Malaria), Fits, UTI, Kidney stones & Geriatric health.',

    // Patient Services Grid
    patientServicesTitle: 'Patient Portal & Services',
    serviceHospitalTitle: 'Hospital & Doctors',
    serviceHospitalDesc: 'Sri Sankalpa services',
    serviceBookingTitle: 'Book OPD Slots',
    serviceBookingDesc: 'Instant appointment',
    serviceRecordsTitle: 'Medical Records',
    serviceRecordsDesc: 'Upload & reminders',
    serviceSupportTitle: 'Hospital Help & AI',
    serviceSupportDesc: '24/7 instant guidance',

    // Find Hospital / Services View
    collaboratedTitle: 'Collaborated Hospital & Specialist Doctors',
    collaboratedSubtitle: 'Book certified consultations with specialist doctors at Sri Sankalpa Hospital, Kodad.',
    searchPlaceholder: 'Search by doctor, condition (e.g. PCOD, Hernia, BP, Fever) or specialty...',
    filtersBtn: 'Filters',
    filterAll: 'All Services',
    filterGynecology: 'Gynecology & PCOD',
    filterSurgery: 'Laparoscopic Surgery',
    filterPhysician: 'General Physician',
    filterEmergency: '24/7 Emergency',
    filterKodad: 'Kodad, Telangana',
    resetFilterBtn: 'Reset Search Filter',
    noResultsTitle: 'No hospitals match your search',
    noResultsDesc: 'Try searching for "Sri Sankalpa", "Gynecology", "Dr. Sandhya", "PCOD", "Hernia", "Emergency", or "Kodad".',

    // Checkout & Booking Flow
    bookingHeading: 'Book Doctor Consultation',
    bookingSubheading: 'Select a preferred time slot and confirm patient details for OPD visit.',
    selectDateTitle: '1. Select Consultation Date',
    selectSlotTitle: '2. Select Available Time Slot',
    patientInfoTitle: '3. Patient Information',
    savedFamilyMembers: 'Select from Saved Family Profiles',
    addNewPatient: 'Or enter patient details below',
    fullNameLabel: 'Patient Full Name',
    ageLabel: 'Age (Years)',
    genderLabel: 'Gender',
    phoneLabel: 'Mobile Number',
    symptomsLabel: 'Reason for Visit / Symptoms (Optional)',
    emergencyWarningTitle: 'Emergency Notice',
    emergencyWarningDesc: 'If the patient is experiencing severe poisoning, snake/scorpion bite, or breathing distress, please visit Sri Sankalpa Hospital 24/7 casualty immediately or call 7095330066.',
    summaryTitle: 'Booking Summary',
    consultationFeeLabel: 'Doctor Consultation Fee',
    platformFeeLabel: 'Booking & Platform Fee',
    totalPayableLabel: 'Total Amount',
    paymentMethodTitle: '4. Choose Payment Method',
    payUPI: 'Pay via UPI (GPay, PhonePe, Paytm)',
    payCard: 'Credit / Debit Card / NetBanking',
    payAtHospital: 'Pay at Hospital Counter (Cash/UPI)',
    confirmBookingBtn: 'Confirm & Book Appointment',
    processingPayment: 'Confirming your booking...',
    bookingSuccessTitle: 'Appointment Confirmed Successfully!',
    bookingSuccessDesc: 'Your OPD appointment has been registered at Sri Sankalpa Hospital.',
    bookingIdLabel: 'Booking Reference ID',
    downloadReceiptBtn: 'Download Booking Slip',
    addToCalendarBtn: 'Add to Calendar',
    exportCalendarBtn: 'Export to Calendar (.ics)',
    addGoogleCalendarOnline: 'Add to Google Calendar',
    viewMyBookingsBtn: 'View in My Bookings',

    // Bookings View
    myBookingsTitle: 'My Appointments & Bookings',
    myBookingsSubtitle: 'View and manage your upcoming consultations at Sri Sankalpa Hospital.',
    upcomingTab: 'Upcoming Visits',
    pastTab: 'Past History',
    confirmedBadge: 'Confirmed',
    cancelledBadge: 'Cancelled',
    completedBadge: 'Completed',
    cancelBookingBtn: 'Cancel Appointment',
    cancelBtn: 'Cancel',
    cancelConfirmPrompt: 'Are you sure you want to cancel this appointment?',
    noBookingsTitle: 'No Appointments Found',
    noBookingsDesc: 'You do not have any scheduled consultations at the moment.',
    bookNewAppointmentBtn: 'Book New Appointment',
    bookNewBtn: 'Book New Appointment',

    // Profile & Medical Records
    myProfileTitle: 'Health Profile & Records',
    myProfileSubtitle: 'Manage your patient profiles, uploaded lab reports, and daily medication reminders.',
    personalInfoTab: 'Personal Info',
    medicalRecordsTab: 'Medical Records',
    medicalRecordsTitle: 'Medical Records & Prescriptions',
    viewRecordsTab: 'View Stored Records',
    uploadRecordsTab: 'Upload New Record',
    familyMembersTab: 'Family Members',
    medicationRemindersTab: 'Medication Reminders',
    uploadRecordBtn: 'Upload Lab Report / Scan',
    addFamilyMemberBtn: 'Add Family Member',
    addMedicationReminderBtn: 'Add Medication Reminder',
    takeDoseBtn: 'Mark as Taken',
    snoozeBtn: 'Snooze (5 min)',
    testChimeBtn: 'Test Sound',
    logoutBtn: 'Log Out',
    viewAllBtn: 'View All',
    savedPatientsTitle: 'Saved Family & Patient Profiles',
    savedPatientsSubtitle: 'Easily select patient profiles when booking appointments',
    defaultPatientBadge: 'Primary Patient',
    setDefaultPatientBtn: 'Set as Primary',

    // Support & AI Assistant
    supportTitle: 'Hospital Help & Support',
    supportSubtitle: '24/7 assistance for doctor consultations, directions, emergency care, and medical guidance.',
    supportHeading: 'Hospital Support & Contact',
    supportSubheading: 'Have questions or need assistance? Reach out to Sri Sankalpa Hospital directly or consult our live AI assistant.',
    sendMessageTitle: 'Send a Message / Query',
    replyTimeDesc: 'We usually respond within 15–30 minutes during OPD hours.',
    messageSentSuccess: 'Thank you! Your message has been received. Our hospital staff will contact you shortly.',
    sendMessageBtn: 'Submit Query',
    liveChatTitle: 'Live AI Health Assistant',
    liveChatDesc: 'Instant answers on doctor availability, PCOD, surgical procedures, and emergency guidance.',
    startChatBtn: 'Open AI Assistant',
    helpCenterTitle: '24/7 Hospital Helplines',
    helpCenterDesc: 'Direct phone lines for immediate emergency care, casualty ambulance, and appointment booking assistance.',
    faqsTitle: 'Frequently Asked Questions (FAQ)',
    aiDoctorAssistantTitle: 'Sri Sankalpa AI Health Assistant',
    aiDoctorAssistantDesc: 'Ask questions about doctor availability, treatment specialties, PCOD, laparoscopic surgeries, fevers, or hospital directions.',
    openAiChatBtn: 'Open AI Assistant',
    callHospitalDirectly: 'Direct Hospital Phone Numbers',
    aiChatWelcome: 'Hello! I am Sri Sankalpa Hospital’s AI Health & Support Assistant. How can I help you today?',
    aiChatPlaceholder: 'Ask in English or Telugu (e.g. డాక్టర్ సంధ్య గారి టైమింగ్స్ ఏమిటి?)...',
    sendBtn: 'Send',
    quickQuestionsTitle: 'Frequently Asked Questions',
    quickQ1: 'What treatments does Dr. Adapa Sandhya provide for PCOD & Infertility?',
    quickQ2: 'What 24/7 emergency services are available for snake bites & poisoning?',
    quickQ3: 'Where is Sri Sankalpa Hospital located in Kodad?',
    quickQ4: 'What laparoscopic surgeries are performed at the hospital?',

    // Doctor Specific
    drSandhyaName: 'Dr. Adapa Sandhya',
    drSandhyaSpecialty: 'Obstetrics & Gynecology Specialist',
    drSandhyaBio: 'Senior Obstetrician & Gynecologist (Yashoda Alumna, FMAS). Specialist in PCOD/PCOS, high-risk pregnancy, infertility evaluation, endometriosis, uterine fibroids, abnormal bleeding, tubectomy, and laparoscopic gynecological care.',
    drVishwaName: 'Dr. Vishwa Kiran Sai',
    drVishwaSpecialty: 'General Physician & Emergency Specialist',
    drVishwaBio: 'Consultant General Physician & Emergency Care Specialist. Expert in diabetes (sugar), hypertension (BP), snake/scorpion bites & poisoning management, dengue, malaria, fits/seizures, UTI, kidney stones, and elderly care.',
  },

  te: {
    // Navigation
    navHome: 'హోమ్',
    navServices: 'సేవలు / డాక్టర్లు',
    navBookings: 'అపాయింట్‌మెంట్లు',
    navProfile: 'ప్రొఫైల్ & రికార్డులు',
    navSupport: 'సహాయం & AI',
    navLogIn: 'లాగిన్',
    navSignUp: 'రిజిస్టర్',
    navLogOut: 'లాగ్ అవుట్',
    langSwitchLabel: 'భాష',
    currentLangName: 'తెలుగు',

    // Header & Alerts
    hospitalPartnerBadge: 'అధికారిక ఆసుపత్రి భాగస్వామి',
    emergency247Badge: '24/7 అత్యవసర సేవలు',
    emergencyCareBadge: '24/7 అత్యవసర & శస్త్రచికిత్స సేవలు',
    alert24h: '24 గంటల అలర్ట్',
    upcomingAppointment: 'రాబోయే అపాయింట్‌మెంట్',
    upcomingAppointmentTitle: 'రాబోయే అపాయింట్‌మెంట్',
    viewDetails: 'వివరాలు చూడండి',
    viewDetailsBtn: 'వివరాలు చూడండి',
    today: 'ఈరోజు',
    tomorrow: 'రేపు',
    notifications: 'నోటిఫికేషన్లు',
    actionNeeded: 'శ్రద్ధ అవసరం',
    close: 'మూసివేయి',
    noNotifications: 'కొత్త నోటిఫికేషన్లు లేవు',
    appointmentAlertTitle: 'రాబోయే కన్సల్టేషన్ అలర్ట్',
    next24HoursBadge: 'తదుపరి 24 గంటల్లో',
    appointmentAlertDesc: 'శ్రీ సంకల్ప హాస్పిటల్ లో తదుపరి 24 గంటల్లో మీకు అపాయింట్‌మెంట్ షెడ్యూల్ చేయబడింది.',

    // Hero Section
    heroTitle: 'శ్రీ సంకల్ప హాస్పిటల్',
    heroSubTitle: 'శ్రీ సంకల్ప హాస్పిటల్స్ ప్రైవేట్ లిమిటెడ్ • కోదాడ, తెలంగాణ',
    heroDesc: 'అధునాతన స్త్రీల & ప్రసూతి వైద్యం, లాపరోస్కోపిక్ సర్జరీ మరియు 24 గంటల జనరల్ ఫిజీషియన్ అత్యవసర సేవలు. కోదాడ మరియు చుట్టుపక్కల ప్రాంత ప్రజలకు నమ్మకమైన నిపుణుల వైద్య సేవలు.',
    bookDoctorBtn: 'డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయండి',
    emergencyCallBtn: 'అత్యవసరం: 7095330066',
    emergencyPhoneLine: '24/7 అత్యవసర & అంబులెన్స్ సేవలు',

    // Address Bar
    hospitalAddressTitle: 'హుజూర్‌నగర్ రోడ్, కోదాడ (తెలంగాణ 508206)',
    hospitalAddressDetail: 'TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా • 24/7 అత్యవసర ప్రమాదాలు & అంబులెన్స్',
    landmarkLabel: 'గుర్తు: TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా',
    copyAddressBtn: 'చిరునామా కాపీ చేయండి',
    copiedAddressBtn: 'చిరునామా కాపీ చేయబడింది',
    helplineTitle: '24/7 హెల్ప్‌లైన్ & అపాయింట్‌మెంట్లు',
    hospitalHelplineTitle: 'శ్రీ సంకల్ప 24/7 హెల్ప్‌లైన్లు',
    emergency247OpdBooking: '24/7 ఎమర్జెన్సీ, అంబులెన్స్ & ఓపీడీ బుకింగ్స్',
    hospitalLocationTitle: 'హాస్పిటల్ చిరునామా & లొకేషన్',
    hospitalLocationDetail: 'హుజూర్‌నగర్ రోడ్, TTD కళ్యాణ మండపం పక్కన, పశువుల సంత ఎదురుగా, కోదాడ, తెలంగాణ 508206',

    // Specialist Doctors Section
    specialistDoctorsTitle: 'ప్రత్యేక నిపుణులైన డాక్టర్లు',
    specialistDoctorsSubtitle: 'శ్రీ సంకల్ప హాస్పిటల్ లో అందుబాటులో ఉన్న అనుభవజ్ఞులైన వైద్యులు',
    allServicesLink: 'అన్ని సేవలు',
    opdFee: 'ఓపీడీ కన్సల్టేషన్ ఫీజు',
    regNo: 'రిజిస్ట్రేషన్ సంఖ్య',
    experienceYears: 'సంవత్సరాల అనుభవం',
    reviewsCount: 'పేషెంట్ రివ్యూలు',
    todaySlots: 'ఈరోజు కన్సల్టేషన్ సమయాలు:',
    bookOpdSlot: 'ఓపీడీ స్లాట్ బుక్ చేయండి',
    bookAppointmentBtn: 'అపాయింట్‌మెంట్ బుక్ చేసుకోండి',

    // Departments
    departmentsTitle: 'ప్రధాన వైద్య విభాగాలు',
    departmentsSubtitle: 'సమగ్ర వైద్యం, అత్యాధునిక లాపరోస్కోపిక్ శస్త్రచికిత్సలు మరియు 24/7 ఎమర్జెన్సీ సేవలు',
    gynecologyDeptTitle: 'ప్రసూతి మరియు స్త్రీల వైద్యం (గైనకాలజీ)',
    gynecologyDeptDesc: 'పీరియడ్స్ సమస్యలు, PCOD/PCOS చికిత్స, సంతానలేమి సమస్యలు, ప్రసవాలు, గర్భాశయ గడ్డలు, ట్యూబెక్టమీ మరియు లాపరోస్కోపిక్ గైనకాలజీ.',
    surgeryDeptTitle: 'జనరల్ మరియు లాపరోస్కోపిక్ సర్జరీ',
    surgeryDeptDesc: 'హెర్నియా ఆపరేషన్లు, 24 గంటల అత్యవసర కడుపు ఆపరేషన్లు, పైల్స్, ఫిషర్, ఫిస్టులా చికిత్స, పిత్తాశయ ఆపరేషన్లు, షుగర్ పుండ్ల చికిత్స.',
    emergencyDeptTitle: 'జనరల్ మెడిసిన్ & 24/7 అత్యవసర సేవలు',
    emergencyDeptDesc: 'పాము కాటు, తేలు కాటు, విషప్రయోగాలు, షుగర్ (డయాబెటిస్), బీపీ, జ్వరాలు (డెంగ్యూ/మలేరియా), ఫిట్స్, మూత్ర సమస్యలు, కిడ్నీ రాళ్లు మరియు వృద్ధుల వైద్యం.',

    // Patient Services Grid
    patientServicesTitle: 'పేషెంట్ సేవలు & పోర్టల్',
    serviceHospitalTitle: 'హాస్పిటల్ & డాక్టర్లు',
    serviceHospitalDesc: 'శ్రీ సంకల్ప సేవలు',
    serviceBookingTitle: 'ఓపీడీ స్లాట్స్ బుకింగ్',
    serviceBookingDesc: 'సులభంగా బుక్ చేయండి',
    serviceRecordsTitle: 'వైద్య రికార్డులు',
    serviceRecordsDesc: 'రిపోర్టులు & రిమైండర్లు',
    serviceSupportTitle: 'హాస్పిటల్ సహాయం & AI',
    serviceSupportDesc: '24/7 తక్షణ సమాచారం',

    // Find Hospital / Services View
    collaboratedTitle: 'అనుబంధ హాస్పిటల్ & స్పెషలిస్ట్ డాక్టర్లు',
    collaboratedSubtitle: 'కోదాడ శ్రీ సంకల్ప హాస్పిటల్ లో నిపుణులైన డాక్టర్ల వద్ద అపాయింట్‌మెంట్ పొందండి.',
    searchPlaceholder: 'డాక్టర్ పేరు, సమస్య (ఉదా: PCOD, హెర్నియా, బీపీ, జ్వరం) లేదా విభాగాన్ని వెతకండి...',
    filtersBtn: 'ఫిల్టర్లు',
    filterAll: 'అన్ని సేవలు',
    filterGynecology: 'గైనకాలజీ & PCOD',
    filterSurgery: 'లాపరోస్కోపిక్ సర్జరీ',
    filterPhysician: 'జనరల్ ఫిజీషియన్',
    filterEmergency: '24/7 అత్యవసర సేవలు',
    filterKodad: 'కోదాడ, తెలంగాణ',
    resetFilterBtn: 'ఫిల్టర్ రీసెట్ చేయండి',
    noResultsTitle: 'ఎలాంటి ఫలితాలు కనిపించలేదు',
    noResultsDesc: '"శ్రీ సంకల్ప", "గైనకాలజీ", "డాక్టర్ సంధ్య", "PCOD", "హెర్నియా", "ఎమర్జెన్సీ", లేదా "కోదాడ" అని వెతకండి.',

    // Checkout & Booking Flow
    bookingHeading: 'డాక్టర్ కన్సల్టేషన్ బుకింగ్',
    bookingSubheading: 'ఓపీడీ సమయాన్ని ఎంచుకుని పేషెంట్ వివరాలను నిర్ధారించండి.',
    selectDateTitle: '1. కన్సల్టేషన్ తేదీని ఎంచుకోండి',
    selectSlotTitle: '2. అందుబాటులో ఉన్న సమయాన్ని (స్లాట్) ఎంచుకోండి',
    patientInfoTitle: '3. పేషెంట్ వివరాలు',
    savedFamilyMembers: 'సేవ్ చేసిన కుటుంబ సభ్యుల వివరాలు',
    addNewPatient: 'లేదా పేషెంట్ వివరాలను కింద నమోదు చేయండి',
    fullNameLabel: 'పేషెంట్ పూర్తి పేరు',
    ageLabel: 'వయస్సు (సంవత్సరాలు)',
    genderLabel: 'లింగం',
    phoneLabel: 'మొబైల్ నంబర్',
    symptomsLabel: 'సమస్య లేదా లక్షణాలు (ఐచ్ఛికం)',
    emergencyWarningTitle: 'అత్యవసర హెచ్చరిక',
    emergencyWarningDesc: 'తీవ్రమైన విషప్రయోగం, పాము/తేలు కాటు లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది ఉంటే వెంటనే శ్రీ సంకల్ప హాస్పిటల్ ఎమర్జెన్సీ విభాగానికి రండి లేదా 7095330066 కు కాల్ చేయండి.',
    summaryTitle: 'బుకింగ్ వివరాల సారాంశం',
    consultationFeeLabel: 'డాక్టర్ కన్సల్టేషన్ ఫీజు',
    platformFeeLabel: 'బుకింగ్ సర్వీస్ ఛార్జ్',
    totalPayableLabel: 'మొత్తం చెల్లించవలసినది',
    paymentMethodTitle: '4. చెల్లింపు విధానాన్ని ఎంచుకోండి',
    payUPI: 'UPI ద్వారా చెల్లించండి (GPay, PhonePe, Paytm)',
    payCard: 'క్రెడిట్ / డెబిట్ కార్డ్ / నెట్ బ్యాంకింగ్',
    payAtHospital: 'హాస్పిటల్ కౌంటర్ వద్ద చెల్లించండి (నగదు / UPI)',
    confirmBookingBtn: 'అపాయింట్‌మెంట్‌ను నిర్ధారించండి',
    processingPayment: 'మీ అపాయింట్‌మెంట్ ప్రాసెస్ అవుతోంది...',
    bookingSuccessTitle: 'అపాయింట్‌మెంట్ విజయవంతంగా బుక్ అయింది!',
    bookingSuccessDesc: 'శ్రీ సంకల్ప హాస్పిటల్ లో మీ ఓపీడీ అపాయింట్‌మెంట్ నమోదైంది.',
    bookingIdLabel: 'బుకింగ్ రిఫరెన్స్ నంబర్',
    downloadReceiptBtn: 'బుకింగ్ రసీదు డౌన్‌లోడ్ చేయండి',
    addToCalendarBtn: 'క్యాలెండర్‌కు జోడించండి',
    exportCalendarBtn: 'క్యాలెండర్‌కు ఎగుమతి చేయండి (.ics)',
    addGoogleCalendarOnline: 'గూగుల్ క్యాలెండర్‌కు జోడించండి',
    viewMyBookingsBtn: 'నా అపాయింట్‌మెంట్లలో చూడండి',

    // Bookings View
    myBookingsTitle: 'నా అపాయింట్‌మెంట్లు',
    myBookingsSubtitle: 'శ్రీ సంకల్ప హాస్పిటల్ లో మీ రాబోయే మరియు మునుపటి కన్సల్టేషన్లను చూడండి.',
    upcomingTab: 'రాబోయే అపాయింట్‌మెంట్లు',
    pastTab: 'మునుపటి చరిత్ర',
    confirmedBadge: 'ఖరారైనది',
    cancelledBadge: 'రద్దైనది',
    completedBadge: 'పూర్తయినది',
    cancelBookingBtn: 'అపాయింట్‌మెంట్ రద్దు చేయండి',
    cancelBtn: 'రద్దు',
    cancelConfirmPrompt: 'మీరు ఖచ్చితంగా ఈ అపాయింట్‌మెంట్‌ను రద్దు చేయాలనుకుంటున్నారా?',
    noBookingsTitle: 'అపాయింట్‌మెంట్లు ఏవీ లేవు',
    noBookingsDesc: 'ప్రస్తుతం మీకు ఎలాంటి షెడ్యూల్ చేయబడిన అపాయింట్‌మెంట్లు లేవు.',
    bookNewAppointmentBtn: 'కొత్త అపాయింట్‌మెంట్ బుక్ చేయండి',
    bookNewBtn: 'కొత్త అపాయింట్‌మెంట్ బుక్ చేయండి',

    // Profile & Medical Records
    myProfileTitle: 'ఆరోగ్య ప్రొఫైల్ & రికార్డులు',
    myProfileSubtitle: 'పేషెంట్ ప్రొఫైళ్లు, ల్యాబ్ టెస్ట్ రిపోర్టులు మరియు రోజువారీ మందుల రిమైండర్లను నిర్వహించండి.',
    personalInfoTab: 'వ్యక్తిగత వివరాలు',
    medicalRecordsTab: 'వైద్య రికార్డులు',
    medicalRecordsTitle: 'వైద్య రికార్డులు & ప్రిస్క్రిప్షన్లు',
    viewRecordsTab: 'సేవ్ చేసిన రికార్డులు',
    uploadRecordsTab: 'కొత్త రికార్డును అప్‌లోడ్ చేయండి',
    familyMembersTab: 'కుటుంబ సభ్యులు',
    medicationRemindersTab: 'మందుల రిమైండర్లు',
    uploadRecordBtn: 'ల్యాబ్ రిపోర్ట్ / స్కాన్ అప్‌లోడ్ చేయండి',
    addFamilyMemberBtn: 'కుటుంబ సభ్యుడిని జోడించండి',
    addMedicationReminderBtn: 'కొత్త మందుల రిమైండర్ జోడించండి',
    takeDoseBtn: 'తీసుకున్నట్లు గుర్తించండి',
    snoozeBtn: '5 నిమిషాలు వాయిదా (స్నూజ్)',
    testChimeBtn: 'శబ్దం పరీక్షించండి',
    logoutBtn: 'లాగ్ అవుట్',
    viewAllBtn: 'అన్నీ చూడండి',
    savedPatientsTitle: 'సేవ్ చేసిన కుటుంబ ప్రొఫైళ్లు',
    savedPatientsSubtitle: 'బుకింగ్ సమయంలో సులభంగా పేషెంట్ వివరాలను ఎంచుకోండి',
    defaultPatientBadge: 'ప్రధాన పేషెంట్',
    setDefaultPatientBtn: 'ప్రధాన పేషెంట్‌గా సెట్ చేయండి',

    // Support & AI Assistant
    supportTitle: 'హాస్పిటల్ సహాయం & మద్దతు',
    supportSubtitle: 'డాక్టర్ కన్సల్టేషన్లు, దిశలు, అత్యవసర వైద్యం మరియు సలహాల కోసం 24/7 సహాయం.',
    supportHeading: 'హాస్పిటల్ సహాయం & సంప్రదింపులు',
    supportSubheading: 'ఏదైనా ప్రశ్న ఉందా? శ్రీ సంకల్ప హాస్పిటల్ ను నేరుగా సంప్రదించండి లేదా లైవ్ AI సహాయకుడిని అడగండి.',
    sendMessageTitle: 'సందేశం / ప్రశ్నను పంపండి',
    replyTimeDesc: 'ఓపీడీ సమయంలో సాధారణంగా 15-30 నిమిషాల్లో సమాధానం ఇవ్వబడుతుంది.',
    messageSentSuccess: 'ధన్యవాదాలు! మీ సందేశం అందింది. మా ఆసుపత్రి బృందం త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది.',
    sendMessageBtn: 'ప్రశ్నను పంపండి',
    liveChatTitle: 'లైవ్ AI ఆరోగ్య సహాయకుడు',
    liveChatDesc: 'డాక్టర్ల లభ్యత, PCOD, శస్త్రచికిత్సలు మరియు అత్యవసర సేవలపై తక్షణ సమాచారం.',
    startChatBtn: 'AI సహాయకుడిని సంప్రదించండి',
    helpCenterTitle: '24/7 హాస్పిటల్ హెల్ప్‌లైన్లు',
    helpCenterDesc: 'అత్యవసర వైద్యం, అంబులెన్స్ మరియు అపాయింట్‌మెంట్ బుకింగ్ కోసం ప్రత్యక్ష ఫోన్ నంబర్లు.',
    faqsTitle: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    aiDoctorAssistantTitle: 'శ్రీ సంకల్ప AI ఆరోగ్య సహాయకుడు',
    aiDoctorAssistantDesc: 'డాక్టర్ల లభ్యత, PCOD, లాపరోస్కోపిక్ సర్జరీలు, జ్వరాలు లేదా ఆసుపత్రి చిరునామా గురించి ఏదైనా అడగండి.',
    openAiChatBtn: 'AI సహాయకుడిని సంప్రదించండి',
    callHospitalDirectly: 'ఆసుపత్రి ప్రత్యక్ష ఫోన్ నంబర్లు',
    aiChatWelcome: 'నమస్కారం! నేను శ్రీ సంకల్ప హాస్పిటల్ AI ఆరోగ్య సహాయకుడిని. మీకు నేను ఎలా సహాయపడగలను?',
    aiChatPlaceholder: 'తెలుగు లేదా ఇంగ్లీషులో అడగండి (ఉదా: డాక్టర్ సంధ్య గారి టైమింగ్స్ ఏమిటి?)...',
    sendBtn: 'పంపండి',
    quickQuestionsTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    quickQ1: 'డాక్టర్ ఆడప సంధ్య గారు PCOD మరియు సంతానలేమికి ఎలాంటి చికిత్స అందిస్తారు?',
    quickQ2: 'పాము కాటు మరియు విషప్రయోగాలకు 24/7 ఎలాంటి ఎమర్జెన్సీ సేవలు ఉన్నాయి?',
    quickQ3: 'కోదాడలో శ్రీ సంకల్ప హాస్పిటల్ ఎక్కడ ఉంది?',
    quickQ4: 'హాస్పిటల్ లో ఎలాంటి లాపరోస్కోపిక్ సర్జరీలు చేస్తారు?',

    // Doctor Specific
    drSandhyaName: 'డాక్టర్ ఆడప సంధ్య',
    drSandhyaSpecialty: 'స్త్రీల మరియు ప్రసూతి వైద్య నిపుణులు (గైనకాలజిస్ట్)',
    drSandhyaBio: 'సీనియర్ ప్రసూతి & స్త్రీల వ్యాధుల నిపుణులు (యశోద, FMAS). పిసిఒడి/పిసిఒఎస్, అధిక ప్రమాద ప్రసవాలు, సంతానలేమి పరీక్షలు & చికిత్స, ఎండోమెట్రియోసిస్, గర్భాశయ గడ్డలు, అసాధారణ రక్తస్రావం, ట్యూబెక్టమీ మరియు లాపరోస్కోపిక్ గైనకాలజీ వైద్యంలో ప్రత్యేక నిపుణులు.',
    drVishwaName: 'డాక్టర్ విశ్వ కిరణ్ సాయి',
    drVishwaSpecialty: 'జనరల్ ఫిజీషియన్ & 24/7 ఎమర్జెన్సీ స్పెషలిస్ట్',
    drVishwaBio: 'కన్సల్టెంట్ జనరల్ ఫిజీషియన్ & ఎమర్జెన్సీ కేర్ స్పెషలిస్ట్. షుగర్ (డయాబెటిస్), బీపీ (రక్తపోటు), పాము కాటు/తేలు కాటు & విషప్రయోగాల అత్యవసర చికిత్స, డెంగ్యూ, మలేరియా, ఫిట్స్/మూర్ఛ, కిడ్నీ రాళ్లు, మూత్ర సమస్యలు మరియు వృద్ధుల ఆరోగ్య సమస్యల చికిత్సా నిపుణులు.',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isTelugu: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'welleni_sri_sankalpa_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'te') {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'te' : 'en';
    setLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.lang = language === 'te' ? 'te' : 'en';
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
    isTelugu: language === 'te',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

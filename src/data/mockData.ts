import { Hospital, UserProfile, MedicalRecord, Booking, Patient } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Rahul Verma',
  dob: '12 May 1985',
  bloodType: 'O+',
  email: 'rahul.verma@example.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Rahul Verma',
    relation: 'Self',
    age: 38,
    gender: 'Male',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'pat-2',
    name: 'Priya Verma',
    relation: 'Spouse',
    age: 35,
    gender: 'Female',
    phone: '+91 98765 12345',
  },
  {
    id: 'pat-3',
    name: 'Ramesh Verma',
    relation: 'Parent',
    age: 68,
    gender: 'Male',
    phone: '+91 98765 99887',
  },
  {
    id: 'pat-4',
    name: 'Anish Verma',
    relation: 'Child',
    age: 8,
    gender: 'Male',
    phone: '+91 98765 43210',
  },
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'sri-sankalpa-hospital',
    name: 'Sri Sankalpa Hospital',
    location: 'Huzurnagar Road, Kodad, Telangana',
    city: 'Kodad',
    state: 'Telangana',
    pincode: '508206',
    landmark: 'Beside TTD Kalyana Mandapam, Opp. Pasuvula Santha',
    address: 'Huzurnagar Road, beside TTD Kalyana Mandapam, opp. santha (pasuvula santha), Kodad, Telangana 508206',
    phoneNumbers: ['7095330066', '7095330077', '8500139123'],
    emergencyPhones: ['7095330066', '7095330077', '8500139123'],
    rating: 4.9,
    reviewsCount: 248,
    distanceKm: 0.8,
    open247: true,
    emergencyServices: true,
    specialties: [
      'Obstetrics & Gynecology',
      'General & Laparoscopic Surgery',
      'General Physician & Medicine',
      '24/7 Emergency & Poisoning Care',
      'PCOD / PCOS & Infertility',
      'Piles, Fissure & Fistula',
      'Diabetes, BP & Kidney Stones'
    ],
    doctors: [
      {
        id: 'doc-sandhya',
        name: 'Dr. Adapa Sandhya',
        specialty: 'Obstetrics & Gynecology Specialist',
        qualifications: 'M.B.B.S., DNB (OBGY) (Yashoda), FMAS',
        registrationNo: 'TSMC/FMR/44255',
        department: 'Obstetrics & Gynecology',
        hospitalId: 'sri-sankalpa-hospital',
        hospitalName: 'Sri Sankalpa Hospital, Kodad',
        experienceYears: 12,
        fee: 400,
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 168,
        availability: ['09:30 AM', '11:30 AM', '02:30 PM', '05:00 PM', '07:00 PM'],
        bio: 'Senior Obstetrician & Gynecologist (Yashoda Alumna, FMAS). Specialist in PCOD/PCOS, high-risk pregnancy, infertility evaluation, endometriosis, uterine fibroids, abnormal bleeding, tubectomy, and laparoscopic gynecological care.'
      },
      {
        id: 'doc-vishwa-kiran',
        name: 'Dr. Vishwa Kiran Sai',
        specialty: 'General Physician & Emergency Specialist',
        qualifications: 'M.B.B.S., FMG (General Physician)',
        registrationNo: 'TSMC/FMR/42614',
        department: 'General Medicine & 24/7 Emergency',
        hospitalId: 'sri-sankalpa-hospital',
        hospitalName: 'Sri Sankalpa Hospital, Kodad',
        experienceYears: 10,
        fee: 350,
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        reviewsCount: 142,
        availability: ['09:00 AM', '11:00 AM', '03:00 PM', '06:00 PM', '08:00 PM'],
        bio: 'Consultant General Physician & Emergency Care Specialist. Expert in diabetes (sugar), hypertension (BP), snake/scorpion bites & poisoning management, dengue, malaria, fits/seizures, UTI, kidney stones, and elderly care.'
      }
    ],
    services: [
      {
        title: 'Obstetrics & Gynecology Services',
        icon: 'female',
        badge: 'Women Health',
        items: [
          'Period-related problems & hormonal disorders',
          'PCOD / PCOS comprehensive treatment',
          'Infertility treatment & difficulty conceiving',
          'Pregnancy care & high-risk deliveries',
          'Endometriosis & chronic pelvic pain',
          'Uterine fibroids & ovarian conditions',
          'Ectopic pregnancy management',
          'Abnormal / heavy menstrual bleeding',
          'Tubectomy & family planning services',
          'Laparoscopic gynecological procedures'
        ]
      },
      {
        title: 'General & Laparoscopic Surgical Services',
        icon: 'healing',
        badge: '24/7 Surgical Care',
        items: [
          'Hernia operations (laparoscopic & open)',
          '24-Hour emergency abdominal surgery',
          'Piles, fissures & fistula procedures',
          'Gallbladder-related operations',
          'Surgery for abdominal lumps & masses',
          'Surgery for diabetic wounds & ulcers',
          'General abdominal surgical procedures'
        ]
      },
      {
        title: 'General Physician & Emergency Services',
        icon: 'emergency',
        badge: '24/7 Emergency Care',
        items: [
          'Snake bites & scorpion bites anti-venom care',
          'Poisoning cases & emergency stabilization',
          'Blood pressure (BP) & heart problems',
          'Diabetes / Sugar management',
          'Thyroid disorders & metabolic care',
          'Malaria, Dengue fever, Jaundice & Filariasis',
          'Fits / seizures & paralysis care',
          'Gastric trouble, ulcers & chest burning',
          'Cough & breathing difficulties',
          'Urinary Tract Infections (UTI) & Kidney stones',
          'Health problems in elderly / geriatric care'
        ]
      }
    ]
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    title: 'Blood Sugar & Lipid Profile',
    date: 'Oct 15, 2023',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    category: 'Lab Report'
  },
  {
    id: 'rec-2',
    title: 'Gynecological Ultrasound Scan',
    date: 'Sep 02, 2023',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    category: 'Ultrasound'
  }
];

const formatMockDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
};

const getMockDayOfWeek = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

// Calculate time slot for today/tomorrow that falls within 24 hours
const getUpcomingTimeSlot = () => {
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour < 14) {
    return { dateOffset: 0, slot: '05:00 PM', session: 'Evening Session' };
  }
  return { dateOffset: 1, slot: '11:30 AM', session: 'Morning Session' };
};

const upcomingInfo = getUpcomingTimeSlot();

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-8942',
    doctorName: 'Dr. Adapa Sandhya',
    doctorSpecialty: 'Obstetrics & Gynecology Specialist',
    doctorPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    hospitalName: 'Sri Sankalpa Hospital, Kodad',
    date: formatMockDate(upcomingInfo.dateOffset),
    dayOfWeek: getMockDayOfWeek(upcomingInfo.dateOffset),
    timeSlot: upcomingInfo.slot,
    sessionType: upcomingInfo.session,
    consultationFee: 400,
    platformFee: 50,
    totalAmount: 450,
    patientName: 'Priya Verma',
    patientPhone: '+91 98765 12345',
    status: 'Confirmed',
    paymentMethod: 'upi',
    upiId: 'priya@okaxis',
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'BK-4120',
    doctorName: 'Dr. Vishwa Kiran Sai',
    doctorSpecialty: 'General Physician & Emergency Specialist',
    doctorPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    hospitalName: 'Sri Sankalpa Hospital, Kodad',
    date: formatMockDate(5),
    dayOfWeek: getMockDayOfWeek(5),
    timeSlot: '11:00 AM',
    sessionType: 'Morning Session',
    consultationFee: 350,
    platformFee: 50,
    totalAmount: 400,
    patientName: 'Rahul Verma',
    patientPhone: '+91 98765 43210',
    status: 'Confirmed',
    paymentMethod: 'card',
    createdAt: new Date().toISOString().split('T')[0],
  },
];


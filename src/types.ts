export type ViewMode = 
  | 'home' 
  | 'hospitals' 
  | 'checkout' 
  | 'profile' 
  | 'login' 
  | 'signup' 
  | 'support' 
  | 'bookings'
  | 'playstore';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications?: string;
  registrationNo?: string;
  hospitalId: string;
  hospitalName: string;
  experienceYears: number;
  fee: number;
  photo: string;
  rating: number;
  reviewsCount: number;
  availability: string[];
  bio: string;
  department?: string;
}

export interface HospitalServiceCategory {
  title: string;
  icon: string;
  badge?: string;
  items: string[];
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  address: string;
  phoneNumbers?: string[];
  emergencyPhones?: string[];
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  open247: boolean;
  emergencyServices: boolean;
  specialties: string[];
  doctors: Doctor[];
  services?: HospitalServiceCategory[];
  image?: string;
}

export interface Patient {
  id: string;
  name: string;
  relation: string; // 'Self' | 'Spouse' | 'Parent' | 'Child' | 'Other'
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  isDefault?: boolean;
}

export interface Booking {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhoto: string;
  hospitalName: string;
  date: string;
  dayOfWeek: string;
  timeSlot: string;
  sessionType: string;
  consultationFee: number;
  platformFee: number;
  totalAmount: number;
  patientName: string;
  patientPhone: string;
  patientRelation?: string;
  patientAge?: number;
  patientGender?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  paymentMethod: 'upi' | 'card' | 'netbanking';
  upiId?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  fileType: 'PDF' | 'JPG' | 'PNG';
  fileSize: string;
  category: 'General' | 'Lab Report' | 'Physiotherapy' | 'Cardiology' | 'Prescription' | 'Ultrasound' | 'Scan' | 'Gynecology';
  fileUrl?: string;
}

export interface UserProfile {
  name: string;
  dob: string;
  bloodType: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking';

export interface MedicationReminder {
  id: string;
  medicineName: string;
  dosage: string;
  times: string[]; // ['08:30', '20:30'] in 24-hr format
  frequency: 'daily' | 'twice-daily' | 'thrice-daily' | 'weekly' | 'custom';
  instructions: string; // e.g. 'After food', 'Before food', 'With warm water', 'At bedtime'
  patientName: string;
  patientId?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[]; // [0,1,2,3,4,5,6] (0 = Sunday, 1 = Monday, etc.)
  notes?: string;
  createdAt: string;
  lastTakenAt?: string;
}

export interface MedicationToastAlert {
  id: string;
  reminderId: string;
  medicineName: string;
  dosage: string;
  instructions: string;
  patientName: string;
  scheduledTime: string;
  timestamp: number;
}

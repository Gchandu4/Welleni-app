import { supabase, isSupabaseConfigured } from './config';
import { UserProfile, Patient, Booking, MedicalRecord } from '../types';

// Helper for local storage backup when Supabase is not configured
const STORAGE_KEYS = {
  USER: 'welleni_supabase_user',
  PATIENTS: 'welleni_supabase_patients',
  BOOKINGS: 'welleni_supabase_bookings',
  RECORDS: 'welleni_supabase_records',
};

function handleSupabaseError(context: string, error: any) {
  if (!error) return;
  const msg = error.message || String(error);
  if (
    msg.includes('Could not find the table') ||
    msg.includes('schema cache') ||
    msg.includes('relation') ||
    msg.includes('does not exist')
  ) {
    console.warn(
      `[Supabase Notice] ${context}: Table not found in Supabase schema. Please run 'supabase_schema.sql' in your Supabase SQL Editor to create the required tables.`
    );
  } else {
    console.warn(`[Supabase Warning] ${context}:`, msg);
  }
}

// --- USER PROFILE ---
export async function saveUserProfileToSupabase(user: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload = {
      id: 'current_user',
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      blood_type: user.bloodType,
      avatar_url: user.avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'id' });

    if (error) handleSupabaseError('Saving user profile', error);
  } catch (err) {
    handleSupabaseError('Error in saveUserProfileToSupabase', err);
  }
}

export async function fetchUserProfileFromSupabase(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(STORAGE_KEYS.USER);
    return local ? JSON.parse(local) : null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'current_user')
      .maybeSingle();

    if (error) {
      handleSupabaseError('Fetching user profile', error);
      const local = localStorage.getItem(STORAGE_KEYS.USER);
      return local ? JSON.parse(local) : null;
    }

    if (data) {
      return {
        name: data.name || 'Rahul Verma',
        dob: data.dob || '12 May 1985',
        bloodType: data.blood_type || 'O+',
        email: data.email || 'rahul.verma@example.com',
        phone: data.phone || '+91 98765 43210',
        avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      };
    }
  } catch (err) {
    handleSupabaseError('Error fetching user profile from Supabase', err);
  }

  const local = localStorage.getItem(STORAGE_KEYS.USER);
  return local ? JSON.parse(local) : null;
}

// --- PATIENTS ---
export async function fetchPatientsFromSupabase(): Promise<Patient[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return local ? JSON.parse(local) : [];
  }

  try {
    const { data, error } = await supabase.from('patients').select('*');
    if (error) {
      handleSupabaseError('Fetching patients', error);
      const local = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return local ? JSON.parse(local) : [];
    }

    if (data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        name: d.name,
        relation: d.relation,
        age: d.age,
        gender: d.gender,
        phone: d.phone,
        isDefault: Boolean(d.is_default),
      }));
    }
  } catch (err) {
    handleSupabaseError('Error fetching patients from Supabase', err);
  }

  const local = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return local ? JSON.parse(local) : [];
}

export async function savePatientToSupabase(patient: Patient) {
  // Update local storage cache
  const currentLocal: Patient[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  const index = currentLocal.findIndex((p) => p.id === patient.id);
  if (index >= 0) currentLocal[index] = patient;
  else currentLocal.push(patient);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(currentLocal));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload = {
      id: patient.id,
      user_id: (patient as any).userId || 'current_user',
      name: patient.name,
      relation: patient.relation,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone || '',
      is_default: Boolean(patient.isDefault),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('patients')
      .upsert(payload, { onConflict: 'id' });

    if (error) handleSupabaseError('Saving patient', error);
  } catch (err) {
    handleSupabaseError('Error saving patient to Supabase', err);
  }
}

export async function deletePatientFromSupabase(patientId: string) {
  const currentLocal: Patient[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  const updated = currentLocal.filter((p) => p.id !== patientId);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updated));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { error } = await supabase.from('patients').delete().eq('id', patientId);
    if (error) handleSupabaseError('Deleting patient', error);
  } catch (err) {
    handleSupabaseError('Error deleting patient from Supabase', err);
  }
}

// --- BOOKINGS ---
export async function fetchBookingsFromSupabase(): Promise<Booking[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return local ? JSON.parse(local) : [];
  }

  try {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) {
      handleSupabaseError('Fetching bookings', error);
      const local = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return local ? JSON.parse(local) : [];
    }

    if (data && data.length > 0) {
      return data.map((d: any): Booking => ({
        id: d.id,
        doctorName: d.doctor_name || '',
        doctorSpecialty: d.doctor_specialty || '',
        doctorPhoto: d.doctor_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        hospitalName: d.hospital_name || '',
        date: d.date || '',
        dayOfWeek: d.day_of_week || 'Today',
        timeSlot: d.time_slot || '',
        sessionType: d.session_type || 'In-Person Consultation',
        consultationFee: Number(d.consultation_fee) || Number(d.total_amount) || 0,
        platformFee: Number(d.platform_fee) || 49,
        totalAmount: Number(d.total_amount) || 0,
        patientName: d.patient_name || '',
        patientPhone: d.patient_phone || '',
        patientRelation: d.patient_relation,
        patientAge: d.patient_age,
        patientGender: d.patient_gender,
        status: d.status || 'Confirmed',
        paymentMethod: d.payment_method || 'upi',
        upiId: d.upi_id,
        createdAt: d.created_at || new Date().toISOString(),
      }));
    }
  } catch (err) {
    handleSupabaseError('Error fetching bookings from Supabase', err);
  }

  const local = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return local ? JSON.parse(local) : [];
}

export async function saveBookingToSupabase(booking: Booking) {
  const currentLocal: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const index = currentLocal.findIndex((b) => b.id === booking.id);
  if (index >= 0) currentLocal[index] = booking;
  else currentLocal.unshift(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(currentLocal));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload = {
      id: booking.id,
      user_id: (booking as any).userId || 'current_user',
      doctor_name: booking.doctorName,
      doctor_specialty: booking.doctorSpecialty,
      doctor_photo: booking.doctorPhoto,
      hospital_name: booking.hospitalName,
      hospital_address: (booking as any).hospitalAddress || '',
      date: booking.date,
      day_of_week: booking.dayOfWeek,
      time_slot: booking.timeSlot,
      session_type: booking.sessionType,
      consultation_fee: booking.consultationFee,
      platform_fee: booking.platformFee,
      total_amount: booking.totalAmount,
      patient_name: booking.patientName,
      patient_phone: booking.patientPhone,
      patient_relation: booking.patientRelation,
      patient_age: booking.patientAge,
      patient_gender: booking.patientGender,
      status: booking.status,
      payment_method: booking.paymentMethod,
      upi_id: booking.upiId,
      created_at: booking.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase
      .from('bookings')
      .upsert(payload, { onConflict: 'id' });

    if (error) handleSupabaseError('Saving booking', error);
  } catch (err) {
    handleSupabaseError('Error saving booking to Supabase', err);
  }
}

// --- MEDICAL RECORDS ---
export async function fetchMedicalRecordsFromSupabase(): Promise<MedicalRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return local ? JSON.parse(local) : [];
  }

  try {
    const { data, error } = await supabase.from('medical_records').select('*').order('created_at', { ascending: false });
    if (error) {
      handleSupabaseError('Fetching medical records', error);
      const local = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return local ? JSON.parse(local) : [];
    }

    if (data && data.length > 0) {
      return data.map((d: any): MedicalRecord => ({
        id: d.id,
        title: d.title,
        date: d.date,
        fileType: d.file_type,
        fileSize: d.file_size,
        category: d.category,
        fileUrl: d.file_url,
      }));
    }
  } catch (err) {
    handleSupabaseError('Error fetching medical records from Supabase', err);
  }

  const local = localStorage.getItem(STORAGE_KEYS.RECORDS);
  return local ? JSON.parse(local) : [];
}

export async function saveMedicalRecordToSupabase(record: MedicalRecord) {
  const currentLocal: MedicalRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS) || '[]');
  const index = currentLocal.findIndex((r) => r.id === record.id);
  if (index >= 0) currentLocal[index] = record;
  else currentLocal.unshift(record);
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(currentLocal));

  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload = {
      id: record.id,
      user_id: (record as any).userId || 'current_user',
      title: record.title,
      date: record.date,
      file_type: record.fileType,
      file_size: record.fileSize,
      category: record.category,
      file_url: record.fileUrl,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('medical_records')
      .upsert(payload, { onConflict: 'id' });

    if (error) handleSupabaseError('Saving medical record', error);
  } catch (err) {
    handleSupabaseError('Error saving medical record to Supabase', err);
  }
}

-- Welleni Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  dob TEXT,
  blood_type TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  relation TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  doctor_name TEXT NOT NULL,
  doctor_specialty TEXT,
  doctor_photo TEXT,
  hospital_name TEXT NOT NULL,
  hospital_address TEXT,
  date TEXT NOT NULL,
  day_of_week TEXT,
  time_slot TEXT NOT NULL,
  session_type TEXT,
  consultation_fee NUMERIC,
  platform_fee NUMERIC,
  total_amount NUMERIC NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  patient_relation TEXT,
  patient_age INT,
  patient_gender TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  payment_method TEXT,
  upi_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Medical Records Table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  category TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Create public access policies for development/anonymous client access
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete users" ON public.users FOR DELETE USING (true);

CREATE POLICY "Allow public read patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update patients" ON public.patients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete patients" ON public.patients FOR DELETE USING (true);

CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete bookings" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read medical_records" ON public.medical_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert medical_records" ON public.medical_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update medical_records" ON public.medical_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete medical_records" ON public.medical_records FOR DELETE USING (true);

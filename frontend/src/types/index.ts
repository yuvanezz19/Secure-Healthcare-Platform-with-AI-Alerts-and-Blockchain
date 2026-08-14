export type Role = 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
}

export interface PatientProfile {
  patient_id: string;
  user_id: string;
  full_name: string;
  email: string;
  dob: string;
  gender: string;
  blood_group: string;
  emergency_contact: string;
  eco_score: number;
  allergies: Allergy[];
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MILD';
  reaction: string;
}

export interface Medicine {
  id?: string;
  medicine_name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  is_active?: boolean;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_name: string;
  hospital_name: string;
  prescription_date: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'DISPENSED';
  ocr_raw_text?: string;
  blockchain_tx_hash?: string;
  created_at: string;
  verified_at?: string;
  medicines: Medicine[];
}

export interface OCRExtraction {
  patient_name: string;
  patient_id?: string;
  doctor_name: string;
  hospital_name: string;
  prescription_date: string;
  confidence: number;
  raw_ocr_text: string;
  extracted_medicines: Medicine[];
}

export interface AIAlert {
  id: string;
  patient_id: string;
  prescription_id?: string;
  alert_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  details: string;
  affected_item: string;
  recommended_action: string;
  is_resolved: boolean;
  disclaimer: string;
  created_at: string;
}

export interface LabReport {
  id: string;
  patient_id: string;
  test_name: string;
  category: string;
  test_date: string;
  doctor_name: string;
  result_summary?: string;
  status: string;
  is_duplicate_flagged: boolean;
  repeat_window_days: number;
  created_at: string;
}

export interface DuplicateTestResult {
  is_duplicate: boolean;
  previous_test_date?: string;
  test_name: string;
  message: string;
  waste_prevented_est_inr: number;
  co2_saved_kg: number;
  disclaimer: string;
}

export interface InventoryItem {
  id: string;
  medicine_name: string;
  generic_name?: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  reorder_level: number;
  location: string;
  supplier: string;
  unit_price: number;
  expiry_status: 'CRITICAL' | 'NEAR_EXPIRY' | 'NORMAL' | 'EXPIRED';
  days_to_expiry: number;
}

export interface DemandForecast {
  medicine_id: string;
  medicine_name: string;
  current_stock: number;
  forecast_30_days: number;
  confidence_interval: string;
  recommended_reorder: number;
  trend: 'UP' | 'STABLE' | 'DOWN';
}

export interface Consent {
  id: string;
  patient_id: string;
  granted_to_name: string;
  granted_to_role: string;
  purpose: string;
  requested_data: string;
  start_time: string;
  expiration_time: string;
  is_active: boolean;
  blockchain_tx_hash: string;
}

export interface SustainabilityMetrics {
  eco_score: number;
  tests_avoided: number;
  medicine_waste_prevented_inr: number;
  teleconsultations_count: number;
  patient_travel_avoided_km: number;
  co2_emissions_saved_kg: number;
  sustainability_grade: string;
  disclaimer: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_name: string;
  role: string;
  action: string;
  resource: string;
  status: string;
  details?: string;
  blockchain_tx_hash?: string;
}

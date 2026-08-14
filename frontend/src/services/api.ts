import {
  User, PatientProfile, Prescription, OCRExtraction, Medicine,
  AIAlert, LabReport, DuplicateTestResult, InventoryItem,
  DemandForecast, Consent, SustainabilityMetrics, AuditLog
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vortexa_token') : null;
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`Backend fetch failed for ${endpoint}, using local simulation:`, err?.message || err);
    return getFallbackData<T>(endpoint, options?.body ? JSON.parse(options.body as string) : undefined);
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) => fetchJSON<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (data: any) => fetchJSON<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Patient Vault
  getMyPatientProfile: (userId: string) => fetchJSON<PatientProfile>(`/patients/me?user_id=${userId}`),
  getPatientById: (patientId: string) => fetchJSON<PatientProfile>(`/patients/${patientId}`),
  listPatients: () => fetchJSON<any[]>('/patients/list'),

  // Doctor
  getDoctorProfile: () => fetchJSON<any>('/doctors/me'),
  getDoctorStats: () => fetchJSON<any>('/doctors/dashboard-stats'),

  // Prescriptions & OCR
  getPrescriptions: (patientId?: string) => fetchJSON<Prescription[]>(`/prescriptions${patientId ? `?patient_id=${patientId}` : ''}`),
  getPrescriptionById: (id: string) => fetchJSON<Prescription>(`/prescriptions/${id}`),
  uploadPrescriptionFile: async (file: File): Promise<OCRExtraction> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/prescriptions/upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      return await res.json();
    } catch {
      return getFallbackData<OCRExtraction>('/prescriptions/upload');
    }
  },
  verifyPrescription: (prescriptionId: string, doctorName: string, hospitalName: string, date: string, medicines: Medicine[], patientId?: string) =>
    fetchJSON<Prescription>(`/prescriptions/${prescriptionId}/verify?patient_id=${patientId || 'DEMO-PAT-101'}`, {
      method: 'POST',
      body: JSON.stringify({
        doctor_name: doctorName,
        hospital_name: hospitalName,
        prescription_date: date,
        medicines: medicines
      })
    }),

  // AI Safety
  getAIAlerts: (patientId?: string) => fetchJSON<AIAlert[]>(`/ai/alerts${patientId ? `?patient_id=${patientId}` : ''}`),
  resolveAIAlert: (alertId: string) => fetchJSON<any>(`/ai/alerts/${alertId}/resolve`, { method: 'POST' }),

  // Labs & Duplicate Check
  getLabReports: (patientId?: string) => fetchJSON<LabReport[]>(`/labs${patientId ? `?patient_id=${patientId}` : ''}`),
  checkDuplicateTest: (patientId: string, testName: string) => fetchJSON<DuplicateTestResult>('/labs/check-duplicate', {
    method: 'POST',
    body: JSON.stringify({ patient_id: patientId, test_name: testName })
  }),

  // Pharmacy Inventory & Forecast
  getInventory: () => fetchJSON<InventoryItem[]>('/inventory'),
  addInventoryItem: (item: any) => fetchJSON<InventoryItem>('/inventory', { method: 'POST', body: JSON.stringify(item) }),
  getAllForecasts: () => fetchJSON<DemandForecast[]>('/forecast/all'),

  // Sustainability & Blockchain Audit
  getSustainabilityDashboard: () => fetchJSON<SustainabilityMetrics>('/sustainability/dashboard'),
  getConsents: (patientId?: string) => fetchJSON<Consent[]>(`/consents${patientId ? `?patient_id=${patientId}` : ''}`),
  grantConsent: (grantedToName: string, grantedToRole: string, purpose: string, durationDays: number = 30) => fetchJSON<Consent>('/consents', {
    method: 'POST',
    body: JSON.stringify({ granted_to_name: grantedToName, granted_to_role: grantedToRole, purpose: purpose, duration_days: durationDays })
  }),
  revokeConsent: (consentId: string) => fetchJSON<any>(`/consents/${consentId}/revoke`, { method: 'POST' }),
  getAuditLogs: () => fetchJSON<AuditLog[]>('/audit-logs')
};

function getFallbackData<T>(endpoint: string, payload?: any): T {
  if (endpoint.includes('/auth/login')) {
    const email = payload?.email?.toLowerCase() || '';
    const storedUsers = JSON.parse(localStorage.getItem('vortexa_registered_users') || '[]');
    const matchedUser = storedUsers.find((u: any) => u.email?.toLowerCase() === email);

    if (matchedUser) {
      return {
        access_token: `mock-jwt-token-${Date.now()}`,
        user_id: matchedUser.id,
        full_name: matchedUser.full_name,
        role: matchedUser.role,
        email: matchedUser.email
      } as unknown as T;
    }

    if (email.includes('doctor')) {
      return {
        access_token: `mock-jwt-token-${Date.now()}`,
        user_id: "DEMO-DOC-101",
        full_name: "Dr. Sarah Jenkins, MD",
        role: "DOCTOR",
        email: email || "demo.doctor@vortexa.org"
      } as unknown as T;
    }
    if (email.includes('pharm')) {
      return {
        access_token: `mock-jwt-token-${Date.now()}`,
        user_id: "DEMO-PHARM-101",
        full_name: "Metro Central Pharmacy",
        role: "PHARMACY",
        email: email || "demo.pharmacy@vortexa.org"
      } as unknown as T;
    }
    if (email.includes('admin')) {
      return {
        access_token: `mock-jwt-token-${Date.now()}`,
        user_id: "DEMO-ADMIN-101",
        full_name: "Hospital Administrator",
        role: "ADMIN",
        email: email || "demo.admin@vortexa.org"
      } as unknown as T;
    }

    // Default patient fallback
    return {
      access_token: `mock-jwt-token-${Date.now()}`,
      user_id: "DEMO-PAT-101",
      full_name: email ? email.split('@')[0].replace('.', ' ').toUpperCase() : "Alex Mercer",
      role: "PATIENT",
      email: email || "demo.patient@vortexa.org"
    } as unknown as T;
  }

  if (endpoint.includes('/auth/register')) {
    const newUser = {
      id: `USR-${Date.now()}`,
      email: payload?.email || "new.user@vortexa.org",
      full_name: payload?.full_name || "New User",
      role: payload?.role || "PATIENT",
      dob: payload?.dob,
      blood_group: payload?.blood_group,
      specialization: payload?.specialization,
      hospital_name: payload?.hospital_name
    };
    try {
      const storedUsers = JSON.parse(localStorage.getItem('vortexa_registered_users') || '[]');
      storedUsers.push(newUser);
      localStorage.setItem('vortexa_registered_users', JSON.stringify(storedUsers));
    } catch (e) {
      console.warn("Could not write to localStorage:", e);
    }
    return {
      access_token: `mock-jwt-token-${Date.now()}`,
      user_id: newUser.id,
      full_name: newUser.full_name,
      role: newUser.role,
      email: newUser.email
    } as unknown as T;
  }

  if (endpoint.includes('/sustainability/dashboard')) {
    return {
      eco_score: 88,
      tests_avoided: 14,
      medicine_waste_prevented_inr: 18400.0,
      teleconsultations_count: 28,
      patient_travel_avoided_km: 406.0,
      co2_emissions_saved_kg: 42.8,
      sustainability_grade: "A+ (Excellent Zero-Waste Practice)",
      disclaimer: "Environmental metrics are calculated estimates based on standard clinical baseline models."
    } as unknown as T;
  }
  if (endpoint.includes('/patients/me')) {
    return {
      patient_id: "DEMO-PAT-101",
      user_id: "u-1",
      full_name: "Alex Mercer",
      email: "demo.patient@vortexa.org",
      dob: "1994-05-18",
      gender: "Male",
      blood_group: "O+",
      emergency_contact: "+1-555-0192",
      eco_score: 88,
      allergies: [
        { id: "a1", allergen: "Penicillin", severity: "HIGH", reaction: "Urticaria and severe broncho-constriction" },
        { id: "a2", allergen: "Sulfa Drugs", severity: "MODERATE", reaction: "Cutaneous rash" }
      ]
    } as unknown as T;
  }
  if (endpoint.includes('/prescriptions/upload')) {
    return {
      patient_name: "Alex Mercer",
      patient_id: "DEMO-PAT-101",
      doctor_name: "Dr. Sarah Jenkins, MD",
      hospital_name: "Metro Health Medical Center",
      prescription_date: new Date().toISOString().split('T')[0],
      confidence: 0.96,
      raw_ocr_text: "VORTEXA OCR ENGINE EXTRACTED TEXT:\nHOSPITAL: Metro Health Medical Center\nDOCTOR: Dr. Sarah Jenkins, MD\nPATIENT: Alex Mercer\nPRESCRIPTION:\n- Amoxicillin 500mg TID 7 days\n- Paracetamol 650mg PRN 5 days\n- Pantoprazole 40mg QD 14 days",
      extracted_medicines: [
        { medicine_name: "Amoxicillin", generic_name: "Amoxicillin Trihydrate", dosage: "500mg", frequency: "Three times daily (TID)", duration: "7 days", instructions: "Take after meals" },
        { medicine_name: "Paracetamol", generic_name: "Acetaminophen", dosage: "650mg", frequency: "As needed (PRN)", duration: "5 days", instructions: "For fever or discomfort" },
        { medicine_name: "Pantoprazole", generic_name: "Pantoprazole Sodium", dosage: "40mg", frequency: "Once daily in morning", duration: "14 days", instructions: "30 mins before breakfast" }
      ]
    } as unknown as T;
  }
  if (endpoint.includes('/inventory')) {
    return [
      { id: "inv-1", medicine_name: "Amoxicillin 500mg", batch_number: "BAT-2026-091", quantity: 140, expiry_date: "2026-08-30", reorder_level: 50, location: "Shelf A1", supplier: "Apex Pharma", unit_price: 8.5, expiry_status: "CRITICAL", days_to_expiry: 22 },
      { id: "inv-2", medicine_name: "Paracetamol 650mg", batch_number: "BAT-2026-114", quantity: 380, expiry_date: "2026-10-15", reorder_level: 100, location: "Shelf B3", supplier: "Global Health", unit_price: 4.2, expiry_status: "NEAR_EXPIRY", days_to_expiry: 68 },
      { id: "inv-3", medicine_name: "Atorvastatin 20mg", batch_number: "BAT-2026-208", quantity: 45, expiry_date: "2027-04-10", reorder_level: 60, location: "Shelf C2", supplier: "CardioCare", unit_price: 16.0, expiry_status: "NORMAL", days_to_expiry: 245 }
    ] as unknown as T;
  }
  return [] as unknown as T;
}

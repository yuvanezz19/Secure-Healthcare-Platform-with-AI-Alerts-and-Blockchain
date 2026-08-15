from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class LoginRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class RegisterRequest(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    password: str
    full_name: str
    role: str # PATIENT, DOCTOR, PHARMACY, ADMIN
    dob: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    specialization: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    full_name: str
    role: str
    email: str
    username: Optional[str] = None

class UserOut(BaseModel):
    id: str
    username: Optional[str] = None
    email: str
    full_name: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class MedicineSchema(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None

class PrescriptionMedicineOut(MedicineSchema):
    id: str
    is_active: bool
    class Config:
        from_attributes = True

class PrescriptionOut(BaseModel):
    id: str
    patient_id: str
    doctor_name: str
    hospital_name: str
    prescription_date: str
    status: str
    ocr_raw_text: Optional[str] = None
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime
    verified_at: Optional[datetime] = None
    medicines: List[PrescriptionMedicineOut] = []
    class Config:
        from_attributes = True

class PrescriptionVerifyRequest(BaseModel):
    doctor_name: str
    hospital_name: str
    prescription_date: str
    medicines: List[MedicineSchema]

class OCRExtractionResult(BaseModel):
    patient_name: str
    patient_id: Optional[str] = None
    doctor_name: str
    hospital_name: str
    prescription_date: str
    confidence: float
    raw_ocr_text: str
    extracted_medicines: List[MedicineSchema]

class AIAlertOut(BaseModel):
    id: str
    patient_id: str
    prescription_id: Optional[str] = None
    alert_type: str
    severity: str
    title: str
    details: str
    affected_item: str
    recommended_action: str
    is_resolved: bool
    disclaimer: str
    created_at: datetime
    class Config:
        from_attributes = True

class LabReportCreate(BaseModel):
    patient_id: str
    test_name: str
    category: str = "Blood Work"
    test_date: str
    doctor_name: str
    result_summary: Optional[str] = None
    status: str = "NORMAL"

class LabReportOut(BaseModel):
    id: str
    patient_id: str
    test_name: str
    category: str
    test_date: str
    doctor_name: str
    result_summary: Optional[str] = None
    status: str
    is_duplicate_flagged: bool
    repeat_window_days: int
    created_at: datetime
    class Config:
        from_attributes = True

class DuplicateTestCheckRequest(BaseModel):
    patient_id: str
    test_name: str

class DuplicateTestCheckResult(BaseModel):
    is_duplicate: bool
    previous_test_date: Optional[str] = None
    test_name: str
    message: str
    waste_prevented_est_inr: float
    co2_saved_kg: float
    disclaimer: str = "AI Decision Support — Requires Human Verification."

class InventoryItemCreate(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    batch_number: str
    quantity: int
    expiry_date: str
    reorder_level: int = 50
    location: str = "Shelf A1"
    supplier: str = "PharmaCare Supply"
    unit_price: float = 12.50

class InventoryItemOut(InventoryItemCreate):
    id: str
    expiry_status: str # CRITICAL (0-30), NEAR_EXPIRY (31-90), NORMAL (90+)
    days_to_expiry: int
    class Config:
        from_attributes = True

class DemandForecastOut(BaseModel):
    medicine_id: str
    medicine_name: str
    current_stock: int
    forecast_30_days: int
    confidence_interval: str
    recommended_reorder: int
    trend: str # UP, STABLE, DOWN

class ConsentCreate(BaseModel):
    granted_to_name: str
    granted_to_role: str
    purpose: str
    requested_data: str = "Full Health Vault & Prescriptions"
    duration_days: int = 30

class ConsentOut(BaseModel):
    id: str
    patient_id: str
    granted_to_name: str
    granted_to_role: str
    purpose: str
    requested_data: str
    start_time: datetime
    expiration_time: datetime
    is_active: bool
    blockchain_tx_hash: str
    class Config:
        from_attributes = True

class SustainabilityMetricsOut(BaseModel):
    eco_score: int
    tests_avoided: int
    medicine_waste_prevented_inr: float
    teleconsultations_count: int
    patient_travel_avoided_km: float
    co2_emissions_saved_kg: float
    sustainability_grade: str
    disclaimer: str = "Environmental metrics are calculated estimates based on standard clinical baseline models."

class AuditLogOut(BaseModel):
    id: str
    timestamp: datetime
    user_name: str
    role: str
    action: str
    resource: str
    status: str
    details: Optional[str] = None
    blockchain_tx_hash: Optional[str] = None
    class Config:
        from_attributes = True

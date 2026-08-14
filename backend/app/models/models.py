from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.core.db import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"
    PHARMACY = "PHARMACY"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default=UserRole.PATIENT.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    eco_score = Column(Integer, default=85)
    medical_history_notes = Column(Text, nullable=True) # Encrypted string

    user = relationship("User", back_populates="patient_profile")
    prescriptions = relationship("Prescription", back_populates="patient")
    lab_reports = relationship("LabReport", back_populates="patient")
    allergies = relationship("Allergy", back_populates="patient")
    consents = relationship("Consent", back_populates="patient")

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    specialization = Column(String, nullable=False, default="General Physician")
    license_number = Column(String, nullable=False, default="DOC-REG-100293")
    hospital_name = Column(String, nullable=False, default="Metro Central Health")

    user = relationship("User", back_populates="doctor_profile")

class PrescriptionStatus(str, enum.Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    VERIFIED = "VERIFIED"
    DISPENSED = "DISPENSED"

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patient_profiles.id"), nullable=False)
    doctor_id = Column(String, nullable=True)
    doctor_name = Column(String, nullable=False)
    hospital_name = Column(String, nullable=False)
    prescription_date = Column(String, nullable=False)
    status = Column(String, default=PrescriptionStatus.PENDING_VERIFICATION.value)
    ocr_raw_text = Column(Text, nullable=True)
    document_url = Column(String, nullable=True)
    blockchain_tx_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    patient = relationship("PatientProfile", back_populates="prescriptions")
    medicines = relationship("PrescriptionMedicine", back_populates="prescription", cascade="all, delete-orphan")

class PrescriptionMedicine(Base):
    __tablename__ = "prescription_medicines"

    id = Column(String, primary_key=True, default=generate_uuid)
    prescription_id = Column(String, ForeignKey("prescriptions.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    generic_name = Column(String, nullable=True)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    instructions = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    prescription = relationship("Prescription", back_populates="medicines")

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patient_profiles.id"), nullable=False)
    test_name = Column(String, nullable=False)
    category = Column(String, default="Blood Work")
    test_date = Column(String, nullable=False)
    doctor_name = Column(String, nullable=False)
    result_summary = Column(Text, nullable=True)
    status = Column(String, default="NORMAL") # NORMAL, ABNORMAL, PENDING
    is_duplicate_flagged = Column(Boolean, default=False)
    repeat_window_days = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("PatientProfile", back_populates="lab_reports")

class Allergy(Base):
    __tablename__ = "allergies"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patient_profiles.id"), nullable=False)
    allergen = Column(String, nullable=False)
    severity = Column(String, default="HIGH") # CRITICAL, HIGH, MODERATE, MILD
    reaction = Column(String, nullable=True)

    patient = relationship("PatientProfile", back_populates="allergies")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(String, primary_key=True, default=generate_uuid)
    medicine_name = Column(String, nullable=False)
    generic_name = Column(String, nullable=True)
    batch_number = Column(String, nullable=False, unique=True)
    quantity = Column(Integer, default=0)
    expiry_date = Column(String, nullable=False)
    reorder_level = Column(Integer, default=50)
    location = Column(String, default="Shelf A1")
    supplier = Column(String, default="PharmaCare Supply")
    unit_price = Column(Float, default=12.50)

class Consent(Base):
    __tablename__ = "consents"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patient_profiles.id"), nullable=False)
    granted_to_name = Column(String, nullable=False)
    granted_to_role = Column(String, nullable=False) # DOCTOR, PHARMACY, RESEARCH
    purpose = Column(String, nullable=False)
    requested_data = Column(String, default="Full Health Vault & Prescriptions")
    start_time = Column(DateTime, default=datetime.utcnow)
    expiration_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    blockchain_tx_hash = Column(String, nullable=False)

    patient = relationship("PatientProfile", back_populates="consents")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    status = Column(String, default="SUCCESS")
    details = Column(String, nullable=True)
    blockchain_tx_hash = Column(String, nullable=True)

class AIAlert(Base):
    __tablename__ = "ai_alerts"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, nullable=False)
    prescription_id = Column(String, nullable=True)
    alert_type = Column(String, nullable=False) # ALLERGY_CONFLICT, DRUG_INTERACTION, DUPLICATE_MEDICINE, DUPLICATE_TEST
    severity = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    title = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    affected_item = Column(String, nullable=False)
    recommended_action = Column(String, nullable=False)
    is_resolved = Column(Boolean, default=False)
    disclaimer = Column(String, default="AI Decision Support — Requires Human Verification.")
    created_at = Column(DateTime, default=datetime.utcnow)

class SustainabilityEvent(Base):
    __tablename__ = "sustainability_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    event_type = Column(String, nullable=False) # TEST_SAVED, MEDICINE_RESCUED, TRAVEL_AVOIDED, DIGITAL_PRESCRIPTION
    description = Column(String, nullable=False)
    co2_saved_kg = Column(Float, default=0.0)
    waste_prevented_inr = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

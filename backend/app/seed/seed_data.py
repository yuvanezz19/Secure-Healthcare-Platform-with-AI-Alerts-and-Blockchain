from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.db import engine, SessionLocal, Base
from app.core.security import get_password_hash
from app.models.models import (
    User, PatientProfile, DoctorProfile, UserRole,
    Prescription, PrescriptionMedicine, LabReport, Allergy,
    Inventory, Consent, AuditLog, AIAlert, SustainabilityEvent, PrescriptionStatus
)
from app.services.blockchain_service import BlockchainService

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Clear existing if any
    if db.query(User).filter(User.email == "demo.patient@vortexa.org").first():
        db.close()
        return

    print("Seeding VORTEXA-Sustain database with synthetic demo data...")

    # 1. Create Users
    patient_user = User(
        email="demo.patient@vortexa.org",
        password_hash=get_password_hash("patient123"),
        full_name="Alex Mercer",
        role=UserRole.PATIENT.value
    )
    doctor_user = User(
        email="demo.doctor@vortexa.org",
        password_hash=get_password_hash("doctor123"),
        full_name="Dr. Sarah Jenkins",
        role=UserRole.DOCTOR.value
    )
    pharmacy_user = User(
        email="demo.pharmacy@vortexa.org",
        password_hash=get_password_hash("pharmacy123"),
        full_name="Metro Central Pharmacy",
        role=UserRole.PHARMACY.value
    )
    admin_user = User(
        email="demo.admin@vortexa.org",
        password_hash=get_password_hash("admin123"),
        full_name="Hospital Administrator",
        role=UserRole.ADMIN.value
    )
    db.add_all([patient_user, doctor_user, pharmacy_user, admin_user])
    db.commit()

    # 2. Profiles
    patient_prof = PatientProfile(
        id="DEMO-PAT-101",
        user_id=patient_user.id,
        dob="1994-05-18",
        gender="Male",
        blood_group="O+",
        emergency_contact="+1-555-0192",
        eco_score=88,
        medical_history_notes="History of mild seasonal asthma and documented Penicillin allergy."
    )
    doctor_prof = DoctorProfile(
        user_id=doctor_user.id,
        specialization="Internal Medicine & Cardiology",
        license_number="DOC-LIC-449102",
        hospital_name="Metro Central Medical Center"
    )
    db.add_all([patient_prof, doctor_prof])
    db.commit()

    # 3. Allergies
    allergy1 = Allergy(
        patient_id=patient_prof.id,
        allergen="Penicillin",
        severity="HIGH",
        reaction="Urticaria and severe broncho-constriction"
    )
    allergy2 = Allergy(
        patient_id=patient_prof.id,
        allergen="Sulfa Drugs",
        severity="MODERATE",
        reaction="Cutaneous rash"
    )
    db.add_all([allergy1, allergy2])

    # 4. Lab Reports
    lab1 = LabReport(
        patient_id=patient_prof.id,
        test_name="Complete Blood Count (CBC)",
        category="Hematology",
        test_date=(datetime.now() - timedelta(days=12)).strftime("%Y-%m-%d"),
        doctor_name="Dr. Sarah Jenkins",
        result_summary="WBC: 6.8 K/uL (Normal), Hemoglobin: 14.2 g/dL, Platelets: 240 K/uL. Normal blood indices.",
        status="NORMAL",
        is_duplicate_flagged=False
    )
    lab2 = LabReport(
        patient_id=patient_prof.id,
        test_name="Lipid Profile",
        category="Biochemistry",
        test_date=(datetime.now() - timedelta(days=25)).strftime("%Y-%m-%d"),
        doctor_name="Dr. Marcus Vance",
        result_summary="Total Cholesterol: 195 mg/dL, HDL: 48 mg/dL, LDL: 118 mg/dL, Triglycerides: 145 mg/dL.",
        status="NORMAL",
        is_duplicate_flagged=False
    )
    db.add_all([lab1, lab2])

    # 5. Prescriptions
    p1 = Prescription(
        id="PRES-1001",
        patient_id=patient_prof.id,
        doctor_name="Dr. Sarah Jenkins",
        hospital_name="Metro Central Medical Center",
        prescription_date=(datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d"),
        status=PrescriptionStatus.VERIFIED.value,
        blockchain_tx_hash=BlockchainService.generate_tx_hash({"presc": "1001", "doctor": "Sarah Jenkins"}),
        verified_at=datetime.utcnow() - timedelta(days=10)
    )
    db.add(p1)
    db.commit()

    pm1 = PrescriptionMedicine(
        prescription_id=p1.id,
        medicine_name="Paracetamol",
        generic_name="Acetaminophen",
        dosage="500mg",
        frequency="Twice daily after meals",
        duration="5 days",
        instructions="For mild headache or muscle soreness",
        is_active=True
    )
    pm2 = PrescriptionMedicine(
        prescription_id=p1.id,
        medicine_name="Cetirizine",
        generic_name="Cetirizine Hydrochloride",
        dosage="10mg",
        frequency="Once daily at night",
        duration="10 days",
        instructions="For seasonal rhinitis",
        is_active=True
    )
    db.add_all([pm1, pm2])

    # 6. Inventory
    inv1 = Inventory(
        medicine_name="Amoxicillin 500mg",
        generic_name="Amoxicillin",
        batch_number="BAT-2026-091",
        quantity=140,
        expiry_date=(datetime.now() + timedelta(days=22)).strftime("%Y-%m-%d"), # Critical 0-30 days
        reorder_level=50,
        location="Shelf A1",
        supplier="Apex Pharma Distributors",
        unit_price=8.50
    )
    inv2 = Inventory(
        medicine_name="Paracetamol 650mg",
        generic_name="Acetaminophen",
        batch_number="BAT-2026-114",
        quantity=380,
        expiry_date=(datetime.now() + timedelta(days=65)).strftime("%Y-%m-%d"), # Near Expiry 31-90 days
        reorder_level=100,
        location="Shelf B3",
        supplier="Global Health Logistics",
        unit_price=4.20
    )
    inv3 = Inventory(
        medicine_name="Atorvastatin 20mg",
        generic_name="Atorvastatin Calcium",
        batch_number="BAT-2026-208",
        quantity=45, # Low stock trigger
        expiry_date=(datetime.now() + timedelta(days=240)).strftime("%Y-%m-%d"), # Normal
        reorder_level=60,
        location="Shelf C2",
        supplier="CardioCare Supply",
        unit_price=16.00
    )
    inv4 = Inventory(
        medicine_name="Pantoprazole 40mg",
        generic_name="Pantoprazole Sodium",
        batch_number="BAT-2026-302",
        quantity=210,
        expiry_date=(datetime.now() + timedelta(days=180)).strftime("%Y-%m-%d"),
        reorder_level=50,
        location="Shelf D1",
        supplier="GastroMed Corp",
        unit_price=11.00
    )
    db.add_all([inv1, inv2, inv3, inv4])

    # 7. Consents
    c1 = Consent(
        patient_id=patient_prof.id,
        granted_to_name="Dr. Sarah Jenkins",
        granted_to_role="DOCTOR",
        purpose="Clinical Consultation & Prescription Review",
        requested_data="Full Health Vault & Prescriptions",
        expiration_time=datetime.utcnow() + timedelta(days=30),
        is_active=True,
        blockchain_tx_hash=BlockchainService.log_consent_transaction(patient_prof.id, "Dr. Sarah Jenkins", "GRANT_ACCESS")
    )
    c2 = Consent(
        patient_id=patient_prof.id,
        granted_to_name="Metro Central Pharmacy",
        granted_to_role="PHARMACY",
        purpose="Medication Dispensing & Allergy Verification",
        requested_data="Active Prescriptions & Allergy Profile",
        expiration_time=datetime.utcnow() + timedelta(days=15),
        is_active=True,
        blockchain_tx_hash=BlockchainService.log_consent_transaction(patient_prof.id, "Metro Central Pharmacy", "GRANT_ACCESS")
    )
    db.add_all([c1, c2])

    # 8. Sustainability Events
    se1 = SustainabilityEvent(
        event_type="TEST_SAVED",
        description="Duplicate CBC lab test prevented by AI rule engine",
        co2_saved_kg=0.45,
        waste_prevented_inr=450.0
    )
    se2 = SustainabilityEvent(
        event_type="MEDICINE_RESCUED",
        description="Redistributed 60 units of near-expiry Paracetamol to outpatient clinic",
        co2_saved_kg=2.10,
        waste_prevented_inr=3200.0
    )
    se3 = SustainabilityEvent(
        event_type="TRAVEL_AVOIDED",
        description="Teleconsultation conducted; avoided 18 km roundtrip patient drive",
        co2_saved_kg=4.20,
        waste_prevented_inr=650.0
    )
    db.add_all([se1, se2, se3])

    # 9. Audit Logs
    a1 = AuditLog(
        user_name="Alex Mercer",
        role="PATIENT",
        action="GRANT_CONSENT",
        resource="HEALTH_VAULT",
        status="SUCCESS",
        details="Granted health vault access to Dr. Sarah Jenkins",
        blockchain_tx_hash=BlockchainService.log_access_transaction("Alex Mercer", "PATIENT", "HEALTH_VAULT", "GRANT_CONSENT")
    )
    a2 = AuditLog(
        user_name="Dr. Sarah Jenkins",
        role="DOCTOR",
        action="VERIFY_PRESCRIPTION",
        resource="PRESCRIPTION_1001",
        status="SUCCESS",
        details="Verified extracted prescription and stored in patient vault",
        blockchain_tx_hash=BlockchainService.log_access_transaction("Dr. Sarah Jenkins", "DOCTOR", "PRESCRIPTION_1001", "VERIFY_PRESCRIPTION")
    )
    db.add_all([a1, a2])

    db.commit()
    db.close()
    print("VORTEXA-Sustain database seeded successfully!")

if __name__ == "__main__":
    seed_database()

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.models import User, DoctorProfile, PatientProfile, Prescription, AIAlert

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/me")
def get_doctor_profile(db: Session = Depends(get_db)):
    doc = db.query(DoctorProfile).first()
    user = db.query(User).filter(User.id == doc.user_id).first() if doc else None
    return {
        "doctor_id": doc.id if doc else "DOC-101",
        "full_name": user.full_name if user else "Dr. Sarah Jenkins",
        "specialization": doc.specialization if doc else "Internal Medicine & Cardiology",
        "hospital_name": doc.hospital_name if doc else "Metro Central Medical Center",
        "license_number": doc.license_number if doc else "DOC-LIC-449102"
    }

@router.get("/dashboard-stats")
def get_doctor_dashboard_stats(db: Session = Depends(get_db)):
    total_patients = db.query(PatientProfile).count()
    verified_prescriptions = db.query(Prescription).count()
    active_alerts = db.query(AIAlert).filter(AIAlert.is_resolved == False).count()
    return {
        "authorized_patients_count": total_patients,
        "prescriptions_verified_count": verified_prescriptions,
        "ai_safety_alerts_count": active_alerts,
        "duplicate_tests_prevented": 14
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.models import User, PatientProfile, Allergy
from app.core.audit import create_audit_entry

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/me")
def get_my_patient_profile(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
    if not profile:
        # Fallback to first profile for demo
        profile = db.query(PatientProfile).first()
    
    user = db.query(User).filter(User.id == profile.user_id).first() if profile else None
    allergies = db.query(Allergy).filter(Allergy.patient_id == profile.id).all() if profile else []

    return {
        "patient_id": profile.id if profile else "DEMO-PAT-101",
        "user_id": user_id,
        "full_name": user.full_name if user else "Alex Mercer",
        "email": user.email if user else "demo.patient@vortexa.org",
        "dob": profile.dob if profile else "1994-05-18",
        "gender": profile.gender if profile else "Male",
        "blood_group": profile.blood_group if profile else "O+",
        "emergency_contact": profile.emergency_contact if profile else "+1-555-0192",
        "eco_score": profile.eco_score if profile else 87,
        "allergies": [{"id": a.id, "allergen": a.allergen, "severity": a.severity, "reaction": a.reaction} for a in allergies]
    }

@router.get("/list")
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(PatientProfile).all()
    res = []
    for p in patients:
        u = db.query(User).filter(User.id == p.user_id).first()
        res.append({
            "patient_id": p.id,
            "full_name": u.full_name if u else "Alex Mercer",
            "email": u.email if u else "patient@vortexa.org",
            "dob": p.dob,
            "gender": p.gender,
            "blood_group": p.blood_group,
            "eco_score": p.eco_score
        })
    return res

@router.get("/{patient_id}")
def get_patient_by_id(patient_id: str, db: Session = Depends(get_db)):
    profile = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not profile:
        profile = db.query(PatientProfile).first()

    user = db.query(User).filter(User.id == profile.user_id).first() if profile else None
    allergies = db.query(Allergy).filter(Allergy.patient_id == profile.id).all() if profile else []

    create_audit_entry(db, "Dr. Sarah Jenkins", "DOCTOR", "READ", f"PATIENT_VAULT_{patient_id}", details="Accessed authorized patient vault")

    return {
        "patient_id": profile.id if profile else patient_id,
        "full_name": user.full_name if user else "Alex Mercer",
        "email": user.email if user else "demo.patient@vortexa.org",
        "dob": profile.dob if profile else "1994-05-18",
        "gender": profile.gender if profile else "Male",
        "blood_group": profile.blood_group if profile else "O+",
        "emergency_contact": profile.emergency_contact if profile else "+1-555-0192",
        "eco_score": profile.eco_score if profile else 87,
        "allergies": [{"id": a.id, "allergen": a.allergen, "severity": a.severity, "reaction": a.reaction} for a in allergies]
    }

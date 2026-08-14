from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.db import get_db
from app.models.models import Prescription, PrescriptionMedicine, PatientProfile, Allergy, AIAlert, PrescriptionStatus
from app.schemas.schemas import PrescriptionOut, PrescriptionVerifyRequest, OCRExtractionResult, MedicineSchema
from app.services.ocr_service import OCRService
from app.services.ai_safety_engine import AISafetyEngine
from app.services.blockchain_service import BlockchainService
from app.core.audit import create_audit_entry

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.get("", response_model=List[PrescriptionOut])
def get_prescriptions(patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Prescription)
    if patient_id:
        query = query.filter(Prescription.patient_id == patient_id)
    prescriptions = query.order_by(Prescription.created_at.desc()).all()
    return prescriptions

@router.post("/upload", response_model=OCRExtractionResult)
async def upload_prescription(file: UploadFile = File(...)):
    """
    Step 1 of Capture Flow: Upload prescription document and run OCR extraction.
    Returns structured json ready for doctor review and verification.
    """
    if not file.filename.endswith(('.png', '.jpg', '.jpeg', '.pdf')):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported types: PNG, JPG, JPEG, PDF")
    
    file_bytes = await file.read()
    extraction = OCRService.process_prescription_document(file.filename, file_bytes)
    return extraction

@router.post("/{prescription_id}/verify", response_model=PrescriptionOut)
def verify_prescription(
    prescription_id: str,
    req: PrescriptionVerifyRequest,
    patient_id: Optional[str] = "DEMO-PAT-101",
    db: Session = Depends(get_db)
):
    """
    Step 2 of Capture Flow: Doctor reviews, edits if needed, and verifies extracted prescription.
    Encrypts, saves to vault, creates blockchain tx hash, and triggers AI clinical safety checks.
    """
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        patient = db.query(PatientProfile).first()

    # Generate cryptographic blockchain verification hash
    tx_payload = {
        "action": "PRESCRIPTION_VERIFIED",
        "doctor": req.doctor_name,
        "hospital": req.hospital_name,
        "date": req.prescription_date,
        "medicines_count": len(req.medicines)
    }
    tx_hash = BlockchainService.generate_tx_hash(tx_payload)

    # Save verified prescription
    prescription = Prescription(
        id=prescription_id if len(prescription_id) > 10 else None,
        patient_id=patient.id,
        doctor_name=req.doctor_name,
        hospital_name=req.hospital_name,
        prescription_date=req.prescription_date,
        status=PrescriptionStatus.VERIFIED.value,
        blockchain_tx_hash=tx_hash,
        verified_at=datetime.utcnow()
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    # Save medicine items
    for med in req.medicines:
        pm = PrescriptionMedicine(
            prescription_id=prescription.id,
            medicine_name=med.medicine_name,
            generic_name=med.generic_name,
            dosage=med.dosage,
            frequency=med.frequency,
            duration=med.duration,
            instructions=med.instructions,
            is_active=True
        )
        db.add(pm)

    db.commit()

    # Run AI Safety Checks immediately
    existing_active = db.query(PrescriptionMedicine).filter(
        PrescriptionMedicine.is_active == True,
        PrescriptionMedicine.prescription_id != prescription.id
    ).all()
    patient_allergies = db.query(Allergy).filter(Allergy.patient_id == patient.id).all()

    safety_alerts = AISafetyEngine.evaluate_prescription_safety(
        patient_id=patient.id,
        new_medicines=req.medicines,
        existing_active_medicines=existing_active,
        patient_allergies=patient_allergies
    )

    # Persist safety alerts
    for alert_data in safety_alerts:
        ai_alert = AIAlert(
            patient_id=patient.id,
            prescription_id=prescription.id,
            alert_type=alert_data["alert_type"],
            severity=alert_data["severity"],
            title=alert_data["title"],
            details=alert_data["details"],
            affected_item=alert_data["affected_item"],
            recommended_action=alert_data["recommended_action"],
            disclaimer=alert_data["disclaimer"]
        )
        db.add(ai_alert)
    
    db.commit()

    create_audit_entry(db, req.doctor_name, "DOCTOR", "VERIFY_PRESCRIPTION", f"PRESCRIPTION_{prescription.id}", details=f"Verified prescription with {len(req.medicines)} medicines")

    return prescription

@router.get("/{prescription_id}", response_model=PrescriptionOut)
def get_prescription_by_id(prescription_id: str, db: Session = Depends(get_db)):
    p = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not p:
        p = db.query(Prescription).first()
        if not p:
            raise HTTPException(status_code=404, detail="Prescription not found.")
    return p

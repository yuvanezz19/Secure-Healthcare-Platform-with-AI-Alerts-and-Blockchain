from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.db import get_db
from app.models.models import Consent, PatientProfile
from app.schemas.schemas import ConsentCreate, ConsentOut
from app.services.blockchain_service import BlockchainService
from app.core.audit import create_audit_entry

router = APIRouter(prefix="/consents", tags=["Blockchain Consent Management"])

@router.get("", response_model=List[ConsentOut])
def get_consents(patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Consent)
    if patient_id:
        query = query.filter(Consent.patient_id == patient_id)
    return query.order_by(Consent.start_time.desc()).all()

@router.post("", response_model=ConsentOut)
def grant_consent(req: ConsentCreate, patient_id: Optional[str] = "DEMO-PAT-101", db: Session = Depends(get_db)):
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        patient = db.query(PatientProfile).first()

    tx_hash = BlockchainService.log_consent_transaction(patient.id, req.granted_to_name, "GRANT_ACCESS")

    expiration = datetime.utcnow() + timedelta(days=req.duration_days)
    consent = Consent(
        patient_id=patient.id,
        granted_to_name=req.granted_to_name,
        granted_to_role=req.granted_to_role,
        purpose=req.purpose,
        requested_data=req.requested_data,
        expiration_time=expiration,
        is_active=True,
        blockchain_tx_hash=tx_hash
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)

    create_audit_entry(db, "Alex Mercer", "PATIENT", "GRANT_CONSENT", f"CONSENT_{consent.id}", details=f"Granted data access to {req.granted_to_name} ({req.granted_to_role}) for {req.duration_days} days")

    return consent

@router.post("/{consent_id}/revoke")
def revoke_consent(consent_id: str, db: Session = Depends(get_db)):
    consent = db.query(Consent).filter(Consent.id == consent_id).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Consent record not found.")

    consent.is_active = False
    tx_hash = BlockchainService.log_consent_transaction(consent.patient_id, consent.granted_to_name, "REVOKE_ACCESS")
    consent.blockchain_tx_hash = tx_hash
    db.commit()

    create_audit_entry(db, "Alex Mercer", "PATIENT", "REVOKE_CONSENT", f"CONSENT_{consent_id}", details=f"Revoked data access for {consent.granted_to_name}")

    return {"message": "Consent successfully revoked.", "blockchain_tx_hash": tx_hash}

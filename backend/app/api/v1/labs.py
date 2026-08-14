from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.db import get_db
from app.models.models import LabReport, SustainabilityEvent
from app.schemas.schemas import LabReportCreate, LabReportOut, DuplicateTestCheckRequest, DuplicateTestCheckResult
from app.services.duplicate_test_engine import DuplicateTestEngine
from app.core.audit import create_audit_entry

router = APIRouter(prefix="/labs", tags=["Lab Reports & Duplicate Test Prevention"])

@router.get("", response_model=List[LabReportOut])
def get_lab_reports(patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(LabReport)
    if patient_id:
        query = query.filter(LabReport.patient_id == patient_id)
    return query.order_by(LabReport.created_at.desc()).all()

@router.post("/check-duplicate", response_model=DuplicateTestCheckResult)
def check_duplicate_test(req: DuplicateTestCheckRequest, db: Session = Depends(get_db)):
    existing_reports = db.query(LabReport).filter(LabReport.patient_id == req.patient_id).all()
    result = DuplicateTestEngine.check_duplicate_test(req.patient_id, req.test_name, existing_reports)
    
    if result["is_duplicate"]:
        create_audit_entry(
            db, "Dr. Sarah Jenkins", "DOCTOR", "DUPLICATE_TEST_FLAG", f"LAB_{req.test_name}",
            details=f"Prevented duplicate test order: {req.test_name}. Estimated waste saved: INR {result['waste_prevented_est_inr']}"
        )
    return result

@router.post("", response_model=LabReportOut)
def create_lab_report(req: LabReportCreate, db: Session = Depends(get_db)):
    report = LabReport(
        patient_id=req.patient_id,
        test_name=req.test_name,
        category=req.category,
        test_date=req.test_date,
        doctor_name=req.doctor_name,
        result_summary=req.result_summary,
        status=req.status
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

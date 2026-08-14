from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.db import get_db
from app.models.models import AIAlert
from app.schemas.schemas import AIAlertOut

router = APIRouter(prefix="/ai", tags=["AI Safety Engine"])

@router.get("/alerts", response_model=List[AIAlertOut])
def get_ai_alerts(patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AIAlert)
    if patient_id:
        query = query.filter(AIAlert.patient_id == patient_id)
    alerts = query.order_by(AIAlert.created_at.desc()).all()
    return alerts

@router.post("/alerts/{alert_id}/resolve")
def resolve_ai_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(AIAlert).filter(AIAlert.id == alert_id).first()
    if alert:
        alert.is_resolved = True
        db.commit()
    return {"message": "AI Alert marked as reviewed and resolved by human practitioner."}

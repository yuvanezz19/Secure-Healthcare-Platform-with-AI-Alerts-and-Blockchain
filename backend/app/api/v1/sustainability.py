from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.models import SustainabilityEvent, PatientProfile
from app.schemas.schemas import SustainabilityMetricsOut
from app.services.sustainability_engine import SustainabilityEngine

router = APIRouter(prefix="/sustainability", tags=["Sustainability & Eco-Impact Engine"])

@router.get("/dashboard", response_model=SustainabilityMetricsOut)
def get_sustainability_dashboard(db: Session = Depends(get_db)):
    events = db.query(SustainabilityEvent).all()
    patient = db.query(PatientProfile).first()
    metrics = SustainabilityEngine.calculate_sustainability_metrics(events, patient)
    return metrics

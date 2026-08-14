from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.models import Inventory
from app.schemas.schemas import DemandForecastOut
from app.services.forecast_service import ForecastService

router = APIRouter(prefix="/forecast", tags=["Medicine Demand Forecasting"])

@router.get("/all", response_model=List[DemandForecastOut])
def get_all_forecasts(db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    forecasts = [ForecastService.generate_demand_forecast(item) for item in items]
    return forecasts

@router.get("/{medicine_id}", response_model=DemandForecastOut)
def get_medicine_forecast(medicine_id: str, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == medicine_id).first()
    if not item:
        item = db.query(Inventory).first()
        if not item:
            raise HTTPException(status_code=404, detail="No inventory item available for forecast.")
    return ForecastService.generate_demand_forecast(item)

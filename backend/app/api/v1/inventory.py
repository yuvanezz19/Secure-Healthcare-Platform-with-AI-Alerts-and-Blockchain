from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.models import Inventory
from app.schemas.schemas import InventoryItemCreate, InventoryItemOut
from app.services.forecast_service import ForecastService
from app.core.audit import create_audit_entry

router = APIRouter(prefix="/inventory", tags=["Pharmacy Inventory"])

@router.get("", response_model=List[InventoryItemOut])
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    result = []
    for item in items:
        status, days = ForecastService.evaluate_expiry_status(item.expiry_date)
        result.append(InventoryItemOut(
            id=item.id,
            medicine_name=item.medicine_name,
            generic_name=item.generic_name,
            batch_number=item.batch_number,
            quantity=item.quantity,
            expiry_date=item.expiry_date,
            reorder_level=item.reorder_level,
            location=item.location,
            supplier=item.supplier,
            unit_price=item.unit_price,
            expiry_status=status,
            days_to_expiry=days
        ))
    return result

@router.post("", response_model=InventoryItemOut)
def add_inventory_item(req: InventoryItemCreate, db: Session = Depends(get_db)):
    item = Inventory(
        medicine_name=req.medicine_name,
        generic_name=req.generic_name,
        batch_number=req.batch_number,
        quantity=req.quantity,
        expiry_date=req.expiry_date,
        reorder_level=req.reorder_level,
        location=req.location,
        supplier=req.supplier,
        unit_price=req.unit_price
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    status, days = ForecastService.evaluate_expiry_status(item.expiry_date)
    create_audit_entry(db, "Pharmacy Admin", "PHARMACY", "ADD_INVENTORY", f"MEDICINE_{item.id}", details=f"Added {item.quantity} units of {item.medicine_name}")

    return InventoryItemOut(
        id=item.id,
        medicine_name=item.medicine_name,
        generic_name=item.generic_name,
        batch_number=item.batch_number,
        quantity=item.quantity,
        expiry_date=item.expiry_date,
        reorder_level=item.reorder_level,
        location=item.location,
        supplier=item.supplier,
        unit_price=item.unit_price,
        expiry_status=status,
        days_to_expiry=days
    )

@router.put("/{item_id}")
def update_stock(item_id: str, new_quantity: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    item.quantity = new_quantity
    db.commit()
    create_audit_entry(db, "Pharmacy Admin", "PHARMACY", "UPDATE_STOCK", f"MEDICINE_{item_id}", details=f"Updated stock to {new_quantity}")
    return {"message": "Stock updated successfully", "quantity": new_quantity}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.models.models import User, PatientProfile, DoctorProfile, UserRole
from app.schemas.schemas import LoginRequest, RegisterRequest, TokenResponse, UserOut
from app.core.audit import create_audit_entry

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    hashed = get_password_hash(req.password)
    user = User(
        email=req.email,
        password_hash=hashed,
        full_name=req.full_name,
        role=req.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if req.role == UserRole.PATIENT.value:
        profile = PatientProfile(
            user_id=user.id,
            dob=req.dob or "1994-05-18",
            gender=req.gender or "Male",
            blood_group=req.blood_group or "O+",
            emergency_contact="+1-555-0192"
        )
        db.add(profile)
        db.commit()
    elif req.role == UserRole.DOCTOR.value:
        profile = DoctorProfile(
            user_id=user.id,
            specialization=req.specialization or "General Medicine",
            license_number="DOC-LIC-99882",
            hospital_name="Metro Health Center"
        )
        db.add(profile)
        db.commit()

    token = create_access_token(subject=user.id, role=user.role)
    create_audit_entry(db, user.full_name, user.role, "REGISTER", "USER_ACCOUNT", details=f"Registered new account: {user.email}")
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        full_name=user.full_name,
        role=user.role,
        email=user.email
    )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(subject=user.id, role=user.role)
    create_audit_entry(db, user.full_name, user.role, "LOGIN", "AUTH_SESSION", details="Successful authentication")
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        full_name=user.full_name,
        role=user.role,
        email=user.email
    )

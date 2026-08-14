from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.core.config import settings
from app.core.db import engine, Base
from app.seed.seed_data import seed_database

# Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.patients import router as patients_router
from app.api.v1.doctors import router as doctors_router
from app.api.v1.prescriptions import router as prescriptions_router
from app.api.v1.ai_safety import router as ai_safety_router
from app.api.v1.labs import router as labs_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.forecast import router as forecast_router
from app.api.v1.sustainability import router as sustainability_router
from app.api.v1.consents import router as consents_router
from app.api.v1.audit_logs import router as audit_logs_router

# Auto-create tables & seed demo data
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Seed info: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VORTEXA-Sustain: The Patient-Owned Green Healthcare Intelligence Network API. Features encrypted patient health vault, prescription OCR capture & doctor verification, transparent AI clinical safety guardrails, pharmacy demand forecasting, sustainability analytics, and cryptographic blockchain audit logs.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS Middleware
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(patients_router, prefix=settings.API_V1_STR)
app.include_router(doctors_router, prefix=settings.API_V1_STR)
app.include_router(prescriptions_router, prefix=settings.API_V1_STR)
app.include_router(ai_safety_router, prefix=settings.API_V1_STR)
app.include_router(labs_router, prefix=settings.API_V1_STR)
app.include_router(inventory_router, prefix=settings.API_V1_STR)
app.include_router(forecast_router, prefix=settings.API_V1_STR)
app.include_router(sustainability_router, prefix=settings.API_V1_STR)
app.include_router(consents_router, prefix=settings.API_V1_STR)
app.include_router(audit_logs_router, prefix=settings.API_V1_STR)

# Serve Static Luxury Client Web App
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def root():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "tagline": "Your Health. Your Data. Zero Waste.",
        "status": "OPERATIONAL",
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "environment": "production-prototype"}

# VORTEXA-Sustain REST API Documentation

Base URL: `http://localhost:8000/api`  
Interactive OpenAPI Docs: `http://localhost:8000/api/docs`

## Auth & Account Management
- `POST /api/auth/register` - Register patient or clinician account.
- `POST /api/auth/login` - Authenticate and receive JWT token.

## Patient Health Vault
- `GET /api/patients/me` - Fetch encrypted health vault profile.
- `GET /api/patients/list` - List authorized patients (Doctor view).
- `GET /api/patients/{id}` - Fetch patient profile by ID.

## Prescription Capture & Verification Flow
- `POST /api/prescriptions/upload` - Upload image/PDF & execute OCR extraction.
- `POST /api/prescriptions/{id}/verify` - Doctor verifies extracted items & stores in vault with SHA-256 blockchain hash.
- `GET /api/prescriptions` - List prescriptions.

## AI Safety & Duplicate Test Prevention
- `GET /api/ai/alerts` - Query active AI clinical alerts (Allergy conflict, Drug-drug interaction, Duplicate meds).
- `POST /api/labs/check-duplicate` - Evaluate duplicate test ordering risk & calculate avoided waste.

## Inventory & Demand Forecasting
- `GET /api/inventory` - Fetch pharmacy inventory with color-coded expiry buckets (Critical 0-30d, Near Expiry 31-90d, Normal 90+d).
- `POST /api/inventory` - Add stock batch entry.
- `GET /api/forecast/all` - Generate 30-day medicine demand forecast model.

## Blockchain Consent & Audit Log
- `GET /api/consents` - List active patient data permissions.
- `POST /api/consents` - Grant new consent.
- `POST /api/consents/{id}/revoke` - Revoke consent.
- `GET /api/audit-logs` - Query master cryptographic audit trail.
- `GET /api/sustainability/dashboard` - Fetch network Eco Score & CO₂ savings metrics.

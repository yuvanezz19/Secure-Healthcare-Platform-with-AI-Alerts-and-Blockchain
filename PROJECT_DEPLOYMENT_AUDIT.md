# VORTEXA-Sustain — Project Deployment Audit

**Audit Date:** August 13, 2026  
**Platform Version:** VORTEXA-Sustain 1.0.0  
**Repository Architecture:** Decoupled Full-Stack Web Application (React Vite Frontend + FastAPI Python Backend)

---

## 1. Current Architecture

VORTEXA-Sustain is a patient-owned green healthcare intelligence platform featuring:
- AES-256 encrypted digital health vault & cryptographic zero-trust consent management.
- OCR image/PDF prescription parsing engine with doctor human-in-the-loop verification.
- Rule-based Clinical Safety Engine (allergy alerts, drug interactions, duplicate active medications).
- Duplicate Lab Test Window Prevention Engine.
- Pharmacy Demand Forecast Engine (30-day moving average).
- Sustainability & Eco-Impact Dashboard (CO₂ saved, financial waste prevented).
- Simulated SHA-256 Blockchain Consent Ledger.

---

## 2. Frontend Specifications

- **Framework**: React 18.2.0 + TypeScript 5.2.2
- **Build Tool**: Vite 5.0.0 (`tsc && vite build`)
- **Output Directory**: `frontend/dist`
- **Styling**: Tailwind CSS + Custom 2026 Sunset Orange Glassmorphism Design Tokens + Lucide Icons
- **Data Visualization**: Recharts 2.10.3
- **Routing**: React Router DOM 6.20.0
- **State Management**: React Context API (`AuthContext`)

---

## 3. Backend Specifications

- **Framework**: Python 3.12 + FastAPI 0.104.0
- **ASGI Server**: Uvicorn 0.23.2
- **ORM & Data Layer**: SQLAlchemy 2.0.22 + SQLite (`vortexa_sustain.db` - PostgreSQL compatible)
- **Authentication**: JWT Tokens (`python-jose`), Passlib with Bcrypt password hashing
- **Security**: AES-256 CBC field-level payload encryption (`pycryptodome`)
- **API Base Prefix**: `/api/v1`

---

## 4. Database & Storage

- **Local DB**: SQLite database file (`vortexa_sustain.db`) located in backend directory.
- **Production Compatibility**: Fully PostgreSQL compatible through SQLAlchemy ORM.
- **Storage Strategy for Vercel**: Vercel serverless environments are ephemeral. SQLite works read-only or in-memory, but for persistent user writes in production, connect a PostgreSQL database (e.g. Supabase / Neon / Render PostgreSQL / AWS RDS).

---

## 5. ML & OCR Service Architecture

- **Engine Location**: `backend/app/services/`
- **Modules**:
  - `ocr_engine.py`: OCR/NER text extraction pipeline with regex parser.
  - `clinical_safety.py`: Rule-based clinical safety & conflict analyzer.
  - `duplicate_test_engine.py`: Duplicate diagnostic test evaluation.
  - `forecast_engine.py`: 30-day moving average demand predictor.
  - `sustainability_engine.py`: Eco-impact sustainability calculator.
  - `blockchain_service.py`: SHA-256 cryptographic audit ledger simulator.
- **Deployment**: Integrated directly into FastAPI backend endpoints. No separate ML service process required.

---

## 6. Current Localhost Configuration

| Service | Local URL | Port |
| :--- | :--- | :--- |
| **Frontend Dev Server** | `http://localhost:5173` | `5173` |
| **Backend API** | `http://localhost:8000` | `8000` |
| **Swagger Docs** | `http://localhost:8000/api/docs` | `8000` |

---

## 7. Environment Variables Audit

### Frontend Variables
- `VITE_API_URL`: Backend API base URL (Default fallback: `/api` for dev proxy).
- `VITE_FIREBASE_*`: Optional Firebase client SDK keys.

### Backend Variables
- `SECRET_KEY`: Cryptographic key for JWT token signing.
- `ALGORITHM`: `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`.
- `DATABASE_URL`: `sqlite:///./vortexa_sustain.db`.
- `CORS_ORIGINS`: Allowed origins (e.g. `http://localhost:5173`, `https://your-vercel-domain.vercel.app`).

---

## 8. Vercel Compatibility & Required Changes

1. **Vite SPA Routing**: Add `vercel.json` rewrite configuration so deep routes (e.g. `/patient/dashboard`, `/sustainability`) do not return 404 on hard refresh.
2. **Dynamic API base URL**: Update `frontend/src/services/api.ts` to read `import.meta.env.VITE_API_URL || '/api'`.
3. **TypeScript Build Fixes**:
   - Add `src/vite-env.d.ts` for Vite client type definitions.
   - Fix `is_active?: bool;` typo in `src/types/index.ts`.
   - Fix `User` interface vs `lucide-react` icon import shadowing in `RegisterPage.tsx`.
4. **Backend Deployment**: Host Python FastAPI backend on Render, Railway, Fly.io, or Vercel Python Serverless functions.

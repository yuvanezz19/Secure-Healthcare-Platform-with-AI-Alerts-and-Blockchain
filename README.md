# VORTEXA-Sustain

> **"Your Health. Your Data. Zero Waste."**  
> *The Patient-Owned Green Healthcare Intelligence Network*

---

## 🌟 Executive Summary

**VORTEXA-Sustain** is a hackathon-grade healthcare technology platform that empowers patients with complete ownership over their medical records while leveraging AI intelligence to eliminate medical waste, duplicate diagnostic tests, and prescription inventory loss.

### Key Pillars:
1. **Patient Data Sovereignty**: AES-256 encrypted digital health vault & cryptographic zero-trust consent management.
2. **Prescription Capture & Doctor Verification**: OCR image/PDF extraction pipeline with doctor human-in-the-loop verification.
3. **Transparent AI Clinical Safety**: Rule-based detection of drug-drug conflicts, penicillin cross-allergies, duplicate active medications, and unusual dosages.
4. **Duplicate Diagnostic Test Prevention**: Evaluates lab repeat validity windows to prevent unnecessary blood draws and hazardous laboratory waste.
5. **Pharmacy Demand Forecasting & Expiry Tracking**: Color-coded stock expiry management (0-30 days critical) with 30-day moving-average demand prediction.
6. **Sustainability & Eco-Impact Dashboard**: Tracks network Eco Score (e.g. 88/100), financial waste prevented (₹), estimated CO₂ emissions saved (kg), and travel avoided.
7. **Blockchain Consent Ledger Audit**: SHA-256 cryptographic transaction log simulation (`TX_0x...`).

> [!IMPORTANT]
> **Clinical AI Safety Disclaimer:**  
> All AI recommendations carry the explicit advisory header:  
> `AI Decision Support — Requires Human Verification.`  
> No autonomous clinical decisions or drug dispenses take place.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js 18 + TypeScript + Vite
- **Styling**: Vanilla Tailwind CSS + Glassmorphism design tokens + Lucide Icons
- **Analytics & Data Viz**: Recharts
- **Routing & State**: React Router DOM v6 + Custom Context API (`AuthContext`)

### Backend
- **Framework**: Python 3.12 + FastAPI
- **Data & ORM**: SQLAlchemy + SQLite (PostgreSQL compatible)
- **Security & Auth**: JWT Tokens, Bcrypt Password Hashing, AES-256 CBC Field Encryption
- **AI & Logic Engines**: OCR/NER text extraction pipeline, Rule-based Clinical Safety Engine, Duplicate Test Prevention Engine, Moving-average Demand Forecast Engine, Eco-Impact Sustainability Calculator, Blockchain Ledger Simulation Engine

---

## 🚀 Quick Start & Local Execution

### Backend Setup (FastAPI)
```bash
cd backend
py -m pip install -r requirements.txt
py -m pip install email-validator
py app/seed/seed_data.py
py -m uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/api/docs`

### Running Backend Tests
```bash
py -m pytest backend/tests/test_backend.py
```

### Docker Execution
```bash
docker-compose up --build
```

---

## 🔑 Hackathon Demo Accounts

Fast 1-click role switcher pills are available in the top navbar and login page:

| Role | Demo Email | Password | Primary Demo Feature |
| :--- | :--- | :--- | :--- |
| **Patient** | `demo.patient@vortexa.org` | `patient123` | Encrypted Health Vault, Eco Score 88, Consent Controls |
| **Doctor** | `demo.doctor@vortexa.org` | `doctor123` | OCR Upload, Verification Form, Allergy Alert Safety |
| **Pharmacy** | `demo.pharmacy@vortexa.org` | `pharmacy123` | Stock Expiry Tracking, 30-Day Demand Forecast |
| **Hospital/Admin** | `demo.admin@vortexa.org` | `admin123` | System Utilization, Master Audit Ledger, CO₂ Analytics |

---

## 🎬 Hackathon Presentation End-to-End Demo Flow

1. **Step 1: Sign in as Doctor** -> Click `"Upload & Verify Prescription (OCR)"` or navigate to `/doctor/upload-prescription`.
2. **Step 2: Choose Sample Prescription** -> Select `"Sample A: General Medicine"` (Amoxicillin + Paracetamol + Pantoprazole) and click `"Run OCR & Extract Structured JSON"`.
3. **Step 3: Review Extracted OCR Parameters** -> Inspect raw text vs structured editable form. Edit dosage or frequency if needed.
4. **Step 4: Verify & Save** -> Click `"Verify & Save to Patient Vault"`. The system generates a cryptographic SHA-256 transaction hash (`TX_0x...`), encrypts the payload, and saves it to Alex Mercer's vault.
5. **Step 5: AI Clinical Safety Trigger** -> System automatically detects documented **Penicillin Allergy vs Amoxicillin** and displays high-visibility alert:  
   `Potential Allergy Conflict: Amoxicillin — AI Decision Support — Requires Human Verification.`
6. **Step 6: Switch Role to Patient** -> Navigate to `/patient/dashboard` to inspect updated Health Vault, Eco Score, and active consents.
7. **Step 7: Duplicate Test Inspector** -> Navigate to `/labs`, type `Complete Blood Count (CBC)` and click `"Evaluate Duplicate Risk"`. System flags test performed 12 days ago within 30-day window, saving ₹450 lab waste & 0.45 kg CO₂.
8. **Step 8: Sustainability & Blockchain Explorer** -> View Eco Analytics (`/sustainability`) and Cryptographic Audit Ledger (`/blockchain-log`).

---

## 📄 License
Released under the MIT License for Hackathon Demonstration.

# VORTEXA-Sustain Architecture & System Design

## Overview
VORTEXA-Sustain is a patient-owned green healthcare intelligence network designed with the core principles of **Data Sovereignty, Clinical Advisory AI, and Environmental Zero-Waste**.

```
[ Frontend: React + TypeScript + Vite + Tailwind CSS + Recharts ]
                             | (REST JSON API)
[ FastAPI Backend Engine ]
   ├── Core Security & AES-256 Data Encryption
   ├── Patient Health Vault Engine
   ├── Prescription Capture & OCR Extraction Service
   ├── Rule-based AI Clinical Safety Engine
   ├── Duplicate Diagnostic Test Prevention Engine
   ├── Pharmacy Inventory & 30-Day Demand Forecast Model
   ├── Sustainability Analytics & Eco-Impact Engine
   └── Cryptographic Blockchain Audit & Consent Service (SHA-256)
                             |
             [ Database: SQLite / PostgreSQL ORM ]
```

## Architectural Highlights
1. **Advisory AI Guardrails**: All AI outputs carry mandatory advisory headers: `AI Decision Support — Requires Human Verification.`
2. **Zero-Trust Patient Vault**: Field-level AES-256 CBC encryption for sensitive patient health notes and allergies.
3. **Cryptographic Blockchain Ledger Simulation**: Generates deterministic SHA-256 hashes (`TX_0x...`) for every consent change, prescription verification, and vault access.
4. **Zero-Waste Sustainability Engine**: Tracks laboratory waste avoided (₹), CO₂ emissions saved (kg), and travel eliminated via teleconsultations.

# VERCEL ENVIRONMENT VARIABLES CONFIGURATION

This document lists all environment variables required for deploying **VORTEXA-Sustain** to Vercel and production backend environments.

> [!CAUTION]
> Never commit actual passwords, private API keys, database passwords, or JWT secrets to Git repositories.

---

## 1. Frontend Environment Variables (Vercel)

Set these in the **Vercel Dashboard** under **Project Settings → Environment Variables**:

| Variable Name | Required | Type | Purpose / Value |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | **Yes** | Public | Production Backend API URL (e.g., `https://vortexa-backend.onrender.com/api/v1`) |
| `VITE_FIREBASE_API_KEY` | Optional | Public | Firebase Web Client API Key (if enabled) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Optional | Public | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Optional | Public | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Optional | Public | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Optional | Public | Firebase Sender ID |
| `VITE_FIREBASE_APP_ID` | Optional | Public | Firebase App ID |

---

## 2. Backend Environment Variables (Production Backend Host)

Set these in your backend deployment platform (Render, Railway, Fly.io, or AWS App Runner):

| Variable Name | Required | Type | Purpose / Value |
| :--- | :--- | :--- | :--- |
| `SECRET_KEY` | **Yes** | Private | Secure random 256-bit string for signing JWT tokens |
| `ALGORITHM` | **Yes** | Private | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | **Yes** | Private | `60` |
| `DATABASE_URL` | **Yes** | Private | Database connection string (e.g., `postgresql://user:pass@ep-xyz.supabase.co:5432/vortexa`) |
| `CORS_ORIGINS` | **Yes** | Private | Comma-separated allowed origins (e.g. `https://vortexa-sustain.vercel.app,http://localhost:5173`) |

---

## 3. Environment Scopes

- **Development**: Managed via local `.env` files (`VITE_API_URL=http://localhost:8000/api/v1`).
- **Preview (Vercel)**: Point `VITE_API_URL` to staging backend instance.
- **Production (Vercel)**: Point `VITE_API_URL` to main production backend.

# VORTEXA-Sustain — Production Deployment Guide

This guide provides step-by-step instructions for deploying the **VORTEXA-Sustain** application to **Vercel** (Frontend) and a production cloud provider (Backend API).

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- A cloud hosting account for Python/FastAPI (Render, Railway, Fly.io, or AWS App Runner).
- A hosted PostgreSQL database (Supabase, Neon, Render Postgres, or AWS RDS).

---

## 2. Deploying Frontend to Vercel

### Step 1: Connect Repository to Vercel
1. Log in to your **Vercel Dashboard**.
2. Click **Add New... → Project**.
3. Import your GitHub repository (`yuvanezz19/Secure-Healthcare-Platform-with-AI-Alerts-and-Blockchain` or your active repo).

### Step 2: Configure Project Settings
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Add Environment Variables
In the Vercel project configuration, add:
- `VITE_API_URL` = `https://YOUR-PRODUCTION-BACKEND.com/api/v1`

### Step 4: Deploy
- Click **Deploy**. Vercel will automatically build the React application and provide a production URL (e.g., `https://vortexa-sustain.vercel.app`).

---

## 3. Deploying FastAPI Backend

### Option A: Deploy on Render (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New + → Web Service**.
3. Connect your repository and configure:
   - **Root Directory**: `backend`
   - **Environment**: Python 3.12
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `SECRET_KEY` = `[Generate strong random key]`
   - `CORS_ORIGINS` = `https://vortexa-sustain.vercel.app,http://localhost:5173`
   - `DATABASE_URL` = `postgresql://...`
5. Click **Create Web Service**.

---

## 4. Single-Page Application (SPA) Routing on Vercel

The included `frontend/vercel.json` ensures direct URL routing works seamlessly:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This prevents 404 errors when users open deep links (e.g. `/patient/dashboard`, `/sustainability`) directly.

---

## 5. Post-Deployment Verification

1. Test landing page at `https://YOUR-VERCEL-DOMAIN.vercel.app`.
2. Perform demo login (`demo.patient@vortexa.org` / `patient123`).
3. Upload a sample prescription and verify OCR extraction.
4. Evaluate duplicate test check (`Complete Blood Count (CBC)`).
5. Verify SSL/HTTPS certification across frontend and backend endpoints.

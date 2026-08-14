import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    if "text/html" in response.headers.get("content-type", ""):
        assert "<!DOCTYPE html>" in response.text or "VORTEXA" in response.text
    else:
        data = response.json()
        assert data["name"] == "VORTEXA-Sustain"
        assert "Zero Waste" in data["tagline"]

def test_login_demo_patient():
    response = client.post("/api/auth/login", json={
        "email": "demo.patient@vortexa.org",
        "password": "patient123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "PATIENT"
    assert "access_token" in data

def test_get_sustainability_dashboard():
    response = client.get("/api/sustainability/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "eco_score" in data
    assert data["eco_score"] >= 80

def test_duplicate_test_check():
    response = client.post("/api/labs/check-duplicate", json={
        "patient_id": "DEMO-PAT-101",
        "test_name": "Complete Blood Count (CBC)"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["is_duplicate"] is True
    assert "Potential Duplicate Diagnostic Test" in data["message"]
    assert "AI Decision Support — Requires Human Verification." in data["disclaimer"]

def test_blockchain_consents():
    response = client.get("/api/consents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["blockchain_tx_hash"].startswith("TX_0x")

def test_prescription_verify_flow():
    verify_payload = {
        "doctor_name": "Dr. Sarah Jenkins",
        "hospital_name": "Metro Health",
        "prescription_date": "2026-08-08",
        "medicines": [
            {
                "medicine_name": "Amoxicillin",
                "generic_name": "Amoxicillin Trihydrate",
                "dosage": "500mg",
                "frequency": "TID",
                "duration": "7 days",
                "instructions": "Take after meal"
            }
        ]
    }
    response = client.post("/api/prescriptions/TEST-P1/verify?patient_id=DEMO-PAT-101", json=verify_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VERIFIED"
    assert data["blockchain_tx_hash"].startswith("TX_0x")

def test_ai_safety_alerts():
    response = client.get("/api/ai/alerts")
    assert response.status_code == 200
    data = response.json()
    # At least one alert from penicillin allergy vs amoxicillin verification test
    assert len(data) > 0
    assert data[0]["disclaimer"] == "AI Decision Support — Requires Human Verification."

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

def test_login_demo_patient_email():
    response = client.post("/api/auth/login", json={
        "email": "demo.patient@vortexa.org",
        "password": "patient123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "PATIENT"
    assert data.get("username") == "alex_patient"
    assert "access_token" in data

def test_login_demo_patient_username():
    response = client.post("/api/auth/login", json={
        "username": "alex_patient",
        "password": "patient123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "PATIENT"
    assert data["email"] == "demo.patient@vortexa.org"
    assert "access_token" in data

def test_login_demo_doctor_username():
    response = client.post("/api/auth/login", json={
        "username": "dr_sarah",
        "password": "doctor123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "DOCTOR"
    assert data["email"] == "demo.doctor@vortexa.org"
    assert "access_token" in data

def test_register_and_login_with_username():
    import uuid
    uid = str(uuid.uuid4())[:8]
    reg_response = client.post("/api/auth/register", json={
        "username": f"doc_{uid}",
        "email": f"doc_{uid}@testclinic.org",
        "password": "securePass123!",
        "full_name": f"Dr. Tester {uid}",
        "role": "DOCTOR",
        "specialization": "Pediatrics"
    })
    assert reg_response.status_code == 200
    reg_data = reg_response.json()
    assert reg_data["username"] == f"doc_{uid}"

    # Login with the new username
    login_response = client.post("/api/auth/login", json={
        "username": f"doc_{uid}",
        "password": "securePass123!"
    })
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert login_data["role"] == "DOCTOR"

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

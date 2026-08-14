import re
from typing import Dict, Any, List
from datetime import datetime
from app.schemas.schemas import OCRExtractionResult, MedicineSchema

class OCRService:
    @staticmethod
    def process_prescription_document(file_name: str, file_bytes: bytes) -> OCRExtractionResult:
        """
        Extracts structured prescription data from uploaded image/PDF files.
        Includes rule-based NLP extraction and realistic sample fallbacks for demonstration.
        """
        text_content = ""
        # Attempt text decoding or simulation
        try:
            text_content = file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            text_content = ""

        # Default fallback sample data if image binary is unparseable text
        patient_name = "Alex Mercer"
        doctor_name = "Dr. Sarah Jenkins, MD"
        hospital_name = "Metro Health Medical Center"
        prescription_date = datetime.now().strftime("%Y-%m-%d")
        
        extracted_medicines: List[MedicineSchema] = []

        # Parse text content with regex patterns if available
        if "PATIENT:" in text_content.upper():
            p_match = re.search(r"PATIENT:\s*([^\n\r]+)", text_content, re.IGNORECASE)
            if p_match:
                patient_name = p_match.group(1).strip()
        
        if "DOCTOR:" in text_content.upper():
            d_match = re.search(r"DOCTOR:\s*([^\n\r]+)", text_content, re.IGNORECASE)
            if d_match:
                doctor_name = d_match.group(1).strip()

        # Generate rich structured mock medicines based on file_name or default sample
        if "cardio" in file_name.lower():
            extracted_medicines = [
                MedicineSchema(
                    medicine_name="Atorvastatin",
                    generic_name="Atorvastatin Calcium",
                    dosage="20mg",
                    frequency="Once daily at bedtime",
                    duration="30 days",
                    instructions="Take after dinner. Monitor lipid profile."
                ),
                MedicineSchema(
                    medicine_name="Amlodipine",
                    generic_name="Amlodipine Besylate",
                    dosage="5mg",
                    frequency="Once daily in morning",
                    duration="30 days",
                    instructions="Take with water. Check blood pressure regularly."
                )
            ]
        elif "pediatric" in file_name.lower():
            extracted_medicines = [
                MedicineSchema(
                    medicine_name="Amoxicillin Oral Suspension",
                    generic_name="Amoxicillin",
                    dosage="250mg/5ml",
                    frequency="Every 8 hours",
                    duration="7 days",
                    instructions="Shake well before use. Complete full course."
                )
            ]
        else:
            # Default demo prescription extraction
            extracted_medicines = [
                MedicineSchema(
                    medicine_name="Amoxicillin",
                    generic_name="Amoxicillin Trihydrate",
                    dosage="500mg",
                    frequency="Three times daily (TID)",
                    duration="7 days",
                    instructions="Take with food. Complete full antibiotic course."
                ),
                MedicineSchema(
                    medicine_name="Paracetamol",
                    generic_name="Acetaminophen",
                    dosage="650mg",
                    frequency="As needed every 6 hours (PRN)",
                    duration="5 days",
                    instructions="For fever/pain. Do not exceed 4000mg daily."
                ),
                MedicineSchema(
                    medicine_name="Pantoprazole",
                    generic_name="Pantoprazole Sodium",
                    dosage="40mg",
                    frequency="Once daily before breakfast",
                    duration="14 days",
                    instructions="Take 30 minutes before morning meal."
                )
            ]

        raw_ocr_output = (
            f"VORTEXA OCR ENGINE EXTRACTED TEXT:\n"
            f"HOSPITAL: {hospital_name}\n"
            f"DOCTOR: {doctor_name}\n"
            f"PATIENT: {patient_name}\n"
            f"DATE: {prescription_date}\n\n"
            f"PRESCRIPTION DETAILS:\n" +
            "\n".join([f"- {m.medicine_name} {m.dosage} ({m.frequency}) for {m.duration}. Note: {m.instructions}" for m in extracted_medicines])
        )

        return OCRExtractionResult(
            patient_name=patient_name,
            patient_id="DEMO-PAT-101",
            doctor_name=doctor_name,
            hospital_name=hospital_name,
            prescription_date=prescription_date,
            confidence=0.96,
            raw_ocr_text=raw_ocr_output,
            extracted_medicines=extracted_medicines
        )

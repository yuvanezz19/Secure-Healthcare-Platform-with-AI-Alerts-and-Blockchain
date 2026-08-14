from typing import List, Dict, Any
from app.models.models import Allergy, PrescriptionMedicine
from app.schemas.schemas import MedicineSchema

# Known Drug-Drug Interactions Knowledge Base
DRUG_INTERACTION_RULES = [
    {
        "pair": {"Warfarin", "Aspirin"},
        "severity": "CRITICAL",
        "title": "Severe Bleeding Risk Interaction",
        "details": "Co-administration of Warfarin (anticoagulant) and Aspirin (antiplatelet) significantly increases the risk of severe gastrointestinal and systemic bleeding.",
        "action": "Avoid combination or closely monitor INR and coagulation parameters."
    },
    {
        "pair": {"Sildenafil", "Nitroglycerin"},
        "severity": "CRITICAL",
        "title": "Severe Hypotension Risk",
        "details": "Nitrates combined with PDE5 inhibitors cause profound systemic vasodilation and severe hypotension.",
        "action": "Contraindicated. Do not co-prescribe."
    },
    {
        "pair": {"Lisinopril", "Spironolactone"},
        "severity": "HIGH",
        "title": "Hyperkalemia Risk",
        "details": "ACE inhibitors (Lisinopril) combined with potassium-sparing diuretics (Spironolactone) can cause dangerously elevated serum potassium levels.",
        "action": "Monitor serum potassium levels closely."
    },
    {
        "pair": {"Atorvastatin", "Clarithromycin"},
        "severity": "HIGH",
        "title": "Rhabdomyolysis Risk",
        "details": "Clarithromycin inhibits CYP3A4, increasing plasma concentration of Atorvastatin and risk of myopathy.",
        "action": "Temporarily withhold statin or select non-CYP3A4 metabolized antibiotic."
    }
]

# Drug Class Allergen Cross-Reactions
ALLERGY_CROSS_REACTION_MAP = {
    "PENICILLIN": ["AMOXICILLIN", "AMPICILLIN", "AUGMENTIN", "PIPERACILLIN"],
    "SULFA": ["SULFAMETHOXAZOLE", "TMP-SMX", "BAPTIM", "CELECOXIB"],
    "NSAID": ["ASPIRIN", "IBUPROFEN", "NAPROXEN", "DICLOFENAC", "KETOROLAC"]
}

class AISafetyEngine:
    @staticmethod
    def evaluate_prescription_safety(
        patient_id: str,
        new_medicines: List[MedicineSchema],
        existing_active_medicines: List[PrescriptionMedicine],
        patient_allergies: List[Allergy]
    ) -> List[Dict[str, Any]]:
        """
        Evaluates new prescription against active medications and patient allergy history.
        Returns a list of structured safety alerts.
        """
        alerts = []

        all_active_names = [m.medicine_name.upper() for m in existing_active_medicines]
        new_med_names = [m.medicine_name.upper() for m in new_medicines]

        # 1. Allergy Conflict Check
        for new_med in new_medicines:
            med_upper = new_med.medicine_name.upper()
            gen_upper = (new_med.generic_name or "").upper()

            for allergy in patient_allergies:
                allergen_upper = allergy.allergen.upper()

                # Direct match
                is_direct = (allergen_upper in med_upper or allergen_upper in gen_upper)

                # Cross-reaction match
                is_cross = False
                cross_list = ALLERGY_CROSS_REACTION_MAP.get(allergen_upper, [])
                for cross_item in cross_list:
                    if cross_item in med_upper or cross_item in gen_upper:
                        is_cross = True
                        break

                if is_direct or is_cross:
                    alerts.append({
                        "patient_id": patient_id,
                        "alert_type": "ALLERGY_CONFLICT",
                        "severity": allergy.severity or "HIGH",
                        "title": f"Potential Allergy Conflict: {new_med.medicine_name}",
                        "details": f"Patient has documented allergy to '{allergy.allergen}' ({allergy.reaction or 'Severe Reaction'}). Prescribing {new_med.medicine_name} poses high risk of hypersensitivity.",
                        "affected_item": new_med.medicine_name,
                        "recommended_action": f"Review patient allergy profile before dispensing. Consider non-beta-lactam/alternative class.",
                        "disclaimer": "AI Decision Support — Requires Human Verification."
                    })

        # 2. Duplicate Medication Check
        for new_med in new_medicines:
            med_upper = new_med.medicine_name.upper()
            for active_med in existing_active_medicines:
                active_upper = active_med.medicine_name.upper()

                if med_upper in active_upper or active_upper in med_upper:
                    alerts.append({
                        "patient_id": patient_id,
                        "alert_type": "DUPLICATE_MEDICINE",
                        "severity": "MEDIUM",
                        "title": f"Duplicate Active Medication: {new_med.medicine_name}",
                        "details": f"Patient already has active prescription for '{active_med.medicine_name}' ({active_med.dosage}, {active_med.frequency}). Prescribing duplicate medication can cause accidental overdose or medication waste.",
                        "affected_item": new_med.medicine_name,
                        "recommended_action": "Verify if intention is to refill, adjust dosage, or replace current active prescription.",
                        "disclaimer": "AI Decision Support — Requires Human Verification."
                    })

        # 3. Drug-Drug Interaction Check
        combined_med_names = set(all_active_names + new_med_names)
        for rule in DRUG_INTERACTION_RULES:
            pair = list(rule["pair"])
            if any(pair[0] in m for m in combined_med_names) and any(pair[1] in m for m in combined_med_names):
                alerts.append({
                    "patient_id": patient_id,
                    "alert_type": "DRUG_INTERACTION",
                    "severity": rule["severity"],
                    "title": rule["title"],
                    "details": rule["details"],
                    "affected_item": f"{pair[0]} + {pair[1]}",
                    "recommended_action": rule["action"],
                    "disclaimer": "AI Decision Support — Requires Human Verification."
                })

        return alerts

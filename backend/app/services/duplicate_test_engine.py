from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.models import LabReport

# Standard Repeat Validity Windows (Days) and Estimated Lab Waste per Test
TEST_VALIDITY_MAP = {
    "COMPLETE BLOOD COUNT": {"window": 30, "cost_inr": 450.0, "co2_kg": 0.45},
    "CBC": {"window": 30, "cost_inr": 450.0, "co2_kg": 0.45},
    "LIPID PROFILE": {"window": 90, "cost_inr": 950.0, "co2_kg": 0.85},
    "LIVER FUNCTION TEST": {"window": 45, "cost_inr": 1100.0, "co2_kg": 0.95},
    "LFT": {"window": 45, "cost_inr": 1100.0, "co2_kg": 0.95},
    "THYROID PROFILE (T3 T4 TSH)": {"window": 60, "cost_inr": 850.0, "co2_kg": 0.65},
    "TSH": {"window": 60, "cost_inr": 400.0, "co2_kg": 0.35},
    "HB1AC": {"window": 90, "cost_inr": 600.0, "co2_kg": 0.50},
    "GLYCOSYLATED HEMOGLOBIN": {"window": 90, "cost_inr": 600.0, "co2_kg": 0.50},
    "RENAL FUNCTION TEST": {"window": 45, "cost_inr": 900.0, "co2_kg": 0.75},
    "KFT": {"window": 45, "cost_inr": 900.0, "co2_kg": 0.75},
    "VITAMIN D3": {"window": 180, "cost_inr": 1500.0, "co2_kg": 1.10}
}

class DuplicateTestEngine:
    @staticmethod
    def check_duplicate_test(patient_id: str, new_test_name: str, existing_reports: List[LabReport]) -> Dict[str, Any]:
        """
        Checks if a requested lab test has been performed within its validity window.
        Returns warning with estimated financial and environmental waste avoided.
        """
        norm_name = new_test_name.strip().upper()
        config = TEST_VALIDITY_MAP.get(norm_name, {"window": 30, "cost_inr": 500.0, "co2_kg": 0.50})

        for report in existing_reports:
            report_name = report.test_name.strip().upper()
            if norm_name in report_name or report_name in norm_name:
                # Check date
                try:
                    rep_date = datetime.strptime(report.test_date, "%Y-%m-%d")
                    days_diff = (datetime.now() - rep_date).days
                except Exception:
                    days_diff = 15 # default assumption inside window

                if days_diff <= config["window"]:
                    return {
                        "is_duplicate": True,
                        "previous_test_date": report.test_date,
                        "test_name": report.test_name,
                        "message": f"Potential Duplicate Diagnostic Test! A valid '{report.test_name}' was conducted on {report.test_date} ({days_diff} days ago). Standard repeat window is {config['window']} days.",
                        "waste_prevented_est_inr": config["cost_inr"],
                        "co2_saved_kg": config["co2_kg"],
                        "disclaimer": "AI Decision Support — Requires Human Verification."
                    }

        return {
            "is_duplicate": False,
            "previous_test_date": None,
            "test_name": new_test_name,
            "message": f"No duplicate test detected within recommended window ({config['window']} days).",
            "waste_prevented_est_inr": 0.0,
            "co2_saved_kg": 0.0,
            "disclaimer": "AI Decision Support — Requires Human Verification."
        }

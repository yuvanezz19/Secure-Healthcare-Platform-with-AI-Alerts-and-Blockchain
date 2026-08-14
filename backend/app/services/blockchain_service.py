import hashlib
import json
from datetime import datetime
from typing import Dict, Any

class BlockchainService:
    @staticmethod
    def generate_tx_hash(payload: Dict[str, Any]) -> str:
        """
        Simulates generating an immutable blockchain transaction hash (SHA-256).
        Format: TX_0x<hash>
        """
        payload_str = json.dumps(payload, sort_keys=True, default=str)
        raw_hash = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()
        return f"TX_0x{raw_hash[:32]}"

    @staticmethod
    def log_consent_transaction(patient_id: str, granted_to: str, action: str) -> str:
        tx_data = {
            "network": "VORTEXA-Hyperledger-Sim",
            "type": "CONSENT_RECORD",
            "patient_id": patient_id,
            "granted_to": granted_to,
            "action": action,
            "timestamp": datetime.utcnow().isoformat()
        }
        return BlockchainService.generate_tx_hash(tx_data)

    @staticmethod
    def log_access_transaction(user_name: str, role: str, resource: str, action: str) -> str:
        tx_data = {
            "network": "VORTEXA-Hyperledger-Sim",
            "type": "HEALTH_VAULT_ACCESS",
            "actor": user_name,
            "role": role,
            "resource": resource,
            "action": action,
            "timestamp": datetime.utcnow().isoformat()
        }
        return BlockchainService.generate_tx_hash(tx_data)

    @staticmethod
    def verify_transaction(tx_hash: str) -> bool:
        """
        Verifies if a transaction hash conforms to the cryptographic ledger format.
        """
        return tx_hash.startswith("TX_0x") and len(tx_hash) == 37

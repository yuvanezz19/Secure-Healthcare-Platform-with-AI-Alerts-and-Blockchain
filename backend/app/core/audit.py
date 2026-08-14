from sqlalchemy.orm import Session
from app.models.models import AuditLog
from app.services.blockchain_service import BlockchainService

def create_audit_entry(
    db: Session,
    user_name: str,
    role: str,
    action: str,
    resource: str,
    status: str = "SUCCESS",
    details: str = None
) -> AuditLog:
    """
    Creates an immutable audit log record with a blockchain transaction hash.
    """
    tx_hash = BlockchainService.log_access_transaction(user_name, role, resource, action)
    audit_entry = AuditLog(
        user_name=user_name,
        role=role,
        action=action,
        resource=resource,
        status=status,
        details=details,
        blockchain_tx_hash=tx_hash
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)
    return audit_entry

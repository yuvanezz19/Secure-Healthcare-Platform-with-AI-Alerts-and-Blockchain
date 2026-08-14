# VORTEXA-Sustain Security & Compliance Framework

## Security Guarantees
1. **AES-256 Field Encryption**: All sensitive medical notes, diagnoses, and allergy parameters are encrypted before database persistence using AES-256-CBC.
2. **Cryptographic Blockchain Audit**: Immutable audit logging powered by SHA-256 transaction hashing (`TX_0x...`).
3. **Role-Based Access Control (RBAC)**: Strict permission boundaries for PATIENT, DOCTOR, PHARMACY, and ADMIN roles.
4. **Advisory AI Guardrails**: Strict compliance with human-in-the-loop verification (`AI Decision Support — Requires Human Verification.`).
5. **No Plaintext Password Storage**: Passwords are hashed using bcrypt with salted key derivation.

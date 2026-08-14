import os
from typing import Optional

class FirebaseService:
    """
    Firebase Service Abstraction for Authentication and Cloud Storage.
    Provides non-blocking fallback if credentials are not specified in environment.
    """
    def __init__(self):
        self.project_id = os.getenv("FIREBASE_PROJECT_ID", "vortexa-sustain-demo")
        self.credentials_path = os.getenv("FIREBASE_CREDENTIALS", None)
        self.initialized = False

    def initialize(self):
        if self.credentials_path and os.path.exists(self.credentials_path):
            try:
                # Optional firebase_admin import
                import firebase_admin
                from firebase_admin import credentials
                cred = credentials.Certificate(self.credentials_path)
                firebase_admin.initialize_app(cred)
                self.initialized = True
                print("Firebase Admin SDK initialized successfully.")
            except Exception as e:
                print(f"Firebase Admin SDK initialization skipped/failed: {e}")
        else:
            print("Firebase service operating in lightweight local mode.")

    def verify_firebase_token(self, token: str) -> Optional[dict]:
        """
        Verifies ID token when Firebase authentication is active.
        """
        if self.initialized:
            try:
                from firebase_admin import auth
                decoded_token = auth.verify_id_token(token)
                return decoded_token
            except Exception:
                return None
        return {"uid": "mock-firebase-user", "email": "demo.patient@vortexa.org"}

firebase_service = FirebaseService()

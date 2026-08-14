import os
from pydantic import BaseConfig

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "VORTEXA-Sustain")
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vortexa-sustain-hackathon-super-secret-key-change-in-production-32bytes!")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./vortexa_sustain.db")
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "vortexa-aes-encryption-key-32b!")
    
settings = Settings()

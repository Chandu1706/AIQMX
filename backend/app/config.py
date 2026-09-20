from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SA_PATH = BACKEND_ROOT / "secrets" / "firebase-service-account.json"


class Settings(BaseSettings):
    app_name: str = "AIQMX"
    firebase_project_id: str = "aiqmx-realtor"
    # Web API key from Firebase Console → Project settings → General
    firebase_web_api_key: str = ""
    firebase_auth_domain: str = ""
    firebase_credentials_path: str = str(DEFAULT_SA_PATH)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

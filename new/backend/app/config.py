from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AIQMX"
    demo_email: str = "admin@aiqmx.local"
    demo_password: str = "admin123"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

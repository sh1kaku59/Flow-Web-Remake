from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Flow Backend"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/flow"
    
    # Security
    SECRET_KEY: str = "super-secret-key-for-cookie-signing-please-change-in-prod"
    COOKIE_NAME: str = "flow_workspace"
    
    # Storage
    SUPABASE_URL: str = ""
    SUPABASE_SECRET_KEY: str = ""
    
    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()

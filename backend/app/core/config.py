import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Globetrotter API"
    MONGO_DB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/travel_destinations")  # Default MongoDB URI
    
    # CORS Settings
    CORS_ORIGINS: list = ["*"]
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields without validation errors

settings = Settings()



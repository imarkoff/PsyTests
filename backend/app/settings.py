import os

class Settings:
    APP_NAME: str = "PsyTests API"
    DEBUG: bool = True
    POSTGRESQL_URL: str = os.getenv("POSTGRESQL_URL", "postgresql://user:password@localhost/db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ACCESS_TOKEN_EXPIRE: int = 15   # minutes
    REFRESH_TOKEN_EXPIRE: int = 14  # days
    TOKEN_ALGORITHM: str = "HS256"
    CORS_ORIGINS: list = ["http://localhost", "http://localhost:8080", "http://localhost:8000", "http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()

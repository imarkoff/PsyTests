import os

class Settings:
    APP_NAME: str = "PsyTests API"
    DEBUG: bool = True
    DATABASE_URL: str = os.getenv("POSTGRESQL_URL", "postgresql://user:password@localhost/db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()

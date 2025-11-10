import os

from dotenv import load_dotenv

from app.db import tests


load_dotenv()


class Settings:
    APP_NAME: str = "PsyTests API"
    DEBUG: bool = True
    POSTGRESQL_URL: str = os.getenv(
        "POSTGRESQL_URL",
        "postgresql://user:password@localhost/db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ACCESS_TOKEN_EXPIRE: int = 15   # minutes
    REFRESH_TOKEN_EXPIRE: int = 14  # days
    TOKEN_ALGORITHM: str = "HS256"
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "").split(",")
    PSY_TESTS_DIR: str = os.path.dirname(tests.__file__)
    PSY_TESTS_ENGINE_PORT: int = int(os.getenv("PSY_TESTS_ENGINE_PORT", 50051))


settings = Settings()

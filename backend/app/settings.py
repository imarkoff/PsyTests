import os
from typing import Type

from app.schemas.test_base import TestBase
from app.utils.tests.mmpi.mmpi_big.mmpi_big import MMPIBigTest


class Settings:
    APP_NAME: str = "PsyTests API"
    DEBUG: bool = True
    POSTGRESQL_URL: str = os.getenv("POSTGRESQL_URL", "postgresql://user:password@localhost/db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret")
    ACCESS_TOKEN_EXPIRE: int = 15   # minutes
    REFRESH_TOKEN_EXPIRE: int = 14  # days
    TOKEN_ALGORITHM: str = "HS256"
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "").split(",")
    TEST_TYPES: dict[str, Type[TestBase]] = {}


settings = Settings()

# Import and register test types after settings object is created
from app.utils.tests.mmpi.mmpi_test import MMPITest
from app.utils.tests.raven.raven_test import RavenTest

settings.TEST_TYPES = {
    "raven": RavenTest,
    "mmpi": MMPITest,
    "mmpi_big": MMPIBigTest
}
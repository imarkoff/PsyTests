import logging

from fastapi import FastAPI, APIRouter

from app.api import auth, token, users, tests
from app.api.patients import patients
from app.settings import settings

tags_metadata = [
    {
        "name": "auth",
        "description": "Operations with authentication. The **login** logic is also here.",
    },
    {
        "name": "users",
        "description": "Operations with users.",
    },
    {
        "name": "token",
        "description": "Operations with tokens.",
    },
    {
        "name": "tests",
        "description": "Operations with global tests.",
    },
    {
        "name": "patients",
        "description": "Manage doctor patients. Requires doctor role.",
    },
    {
        "name": "patient_tests",
        "description": "Operations with patient tests.",
    }
]
app = FastAPI(title=settings.APP_NAME, version="0.0.1", openapi_tags=tags_metadata)

api = APIRouter(prefix="/api")
api.include_router(auth.router)
api.include_router(users.router)
api.include_router(token.router)
api.include_router(tests.router)
api.include_router(patients.router)

app.include_router(api)


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
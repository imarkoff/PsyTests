import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, token, users, tests
from app.api.doctor import doctor
from app.api.patient import patient
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
        "name": "patient_tests",
        "description": "Operations with patient tests.",
    },
    {
        "name": "doctor_patients",
        "description": "Manage doctor patients.",
    },
    {
        "name": "doctor_patients_tests",
        "description": "Manage tests for doctor patients.",
    }
]
app = FastAPI(title=settings.APP_NAME, version="0.0.1", openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["Content-Disposition"],
    max_age=3600,
)

logging.info("CORS_ORIGINS: " + ", ".join(settings.CORS_ORIGINS))

api = APIRouter(prefix="/api")
api.include_router(auth.router)
api.include_router(users.router)
api.include_router(token.router)
api.include_router(tests.router)
api.include_router(doctor.router)
api.include_router(patient.router)

app.include_router(api)
from fastapi import APIRouter

from app.api.doctor.patients import patients

router = APIRouter(prefix="/doctor", tags=["doctor"], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Role differs from doctor"},
})

router.include_router(patients.router)
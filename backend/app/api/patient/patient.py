from fastapi import APIRouter

from app.api.patient.tests import patient_tests

router = APIRouter(prefix="/patient", responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Role differs from patient"},
})

router.include_router(patient_tests.router)
from fastapi import APIRouter

from app.api.admin import users, doctors, patients

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Role differs from admin"},
    }
)

router.include_router(users.router)
router.include_router(doctors.router)
router.include_router(patients.router)

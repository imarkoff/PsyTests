from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.api.doctor.patients import patient_tests
from app.core.bearer import JWTBearer
from app.db.session import get_postgresql_db
from app.exceptions import AlreadyExistsError, NotFoundError
from app.schemas.patients.patient_create import PatientCreateDto
from app.schemas.patients.patient_info import PatientInfoDto
from app.schemas.role import Role
from app.schemas.user_auth import UserDto
from app.services.patients import patients_service

router = APIRouter(prefix="/patients")
patients_router = APIRouter(tags=["doctor_patients"])

@patients_router.get("/", summary="Get doctor patients", response_model=list[UserDto])
async def get_patients(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    return await patients_service.get_patients(db, doctor.id)


@patients_router.get("/find", summary="Find patient in database by name, surname, phone number or email",
            response_model=list[UserDto])
async def find_patient(
        search: str,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    return await patients_service.find_patient(db, search)


@patients_router.get("/{patient_id}", summary="Get patient info", response_model=PatientInfoDto)
async def get_patient(
        patient_id: UUID,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    try:
        return await patients_service.get_patient(db, doctor.id, patient_id)
    except NotFoundError:
        return Response(status_code=404)


@patients_router.post("/{patient_id}", summary="Add patient to doctor patients", status_code=201,
             response_model=UserDto, responses={
        409: {"description": "Doctor already has this patient"},
    })
async def add_patient(
        patient_id: UUID,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    try:
        patient = await patients_service.assign_patient(db, doctor.id, patient_id)
        return Response(status_code=201, content=patient.model_dump_json(), media_type="application/json")
    except AlreadyExistsError:
        return Response(status_code=409)


@patients_router.post("/", summary="Create new patient and add to doctor patients",
             status_code=201, response_model=UserDto, responses={
        409: {"description": "Patient with this phone already exists"},
    })
async def create_patient(
        patient: PatientCreateDto,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    try:
        new_patient = await patients_service.create_patient(db, doctor.id, patient)
        return Response(status_code=201, content=new_patient.model_dump_json(), media_type="application/json")
    except AlreadyExistsError:
        return Response(status_code=409)


@patients_router.delete("/{patient_id}", summary="Delete patient from doctor patients. Also unassign doctor tests",
               status_code=204, responses={
        404: {"description": "Patient not found or not assigned to doctor"},
        204: {"description": "Patient deleted"}
    })
async def delete_patient(
        patient_id: UUID,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    try:
        await patients_service.delete_patient(db, doctor.id, patient_id)
        return Response(status_code=204)
    except NotFoundError:
        return Response(status_code=404)


router.include_router(patient_tests.router)
router.include_router(patients_router)
from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.responses import Response

from app.api.doctor.patients import patient_tests
from app.dependenies.services import get_authenticator, get_doctor_patient_service
from app.exceptions import AlreadyExistsError, NotFoundError
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.patients.patient_create import PatientCreateDto
from app.schemas.patients.patient_search_dto import PatientSearchDto
from app.schemas.enums.role import Role
from app.services.patients.doctor_patient_service import DoctorPatientService
from app.services.user_authenticator import Authenticator

router = APIRouter(prefix="/patients")
patients_router = APIRouter(tags=["doctor_patients"])

@patients_router.get("/", summary="Get active doctor patients", response_model=list[DoctorPatientDto])
async def get_patients(
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    return await doctor_patient_service.get_patients(doctor_id=doctor.id)


@patients_router.get("/find",
                     summary="Find patient in database by name, surname, phone number or email."
                             " Also sort patients by doctor patients and other patients",
                     response_model=PatientSearchDto)
async def find_patient(
        search: str,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    return await doctor_patient_service.find_patient(doctor_id=doctor.id, search=search)


@patients_router.get("/{patient_id}", summary="Get patient info", response_model=DoctorPatientDto)
async def get_patient(
        patient_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)

    try:
        return await doctor_patient_service.get_patient(doctor_id=doctor.id, patient_id=patient_id)
    except NotFoundError:
        return Response(status_code=404)


@patients_router.patch("/{patient_id}/read", summary="Mark patient messages as read", status_code=204)
async def mark_patient_as_read(
        patient_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    await authenticator.auth(role=Role.DOCTOR)
    await doctor_patient_service.change_attention(patient_id=patient_id, needs_attention=False)
    return Response(status_code=204)


@patients_router.patch("/{patient_id}/status", summary="Change patient status", status_code=204)
async def change_patient_status(
        patient_id: UUID,
        status: bool,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    await authenticator.auth(role=Role.DOCTOR)
    await doctor_patient_service.change_status(patient_id=patient_id, is_active=status)
    return Response(status_code=204)


@patients_router.post("/{patient_id}", summary="Add patient to doctor patients", status_code=201,
             response_model=DoctorPatientDto, responses={
        409: {"description": "Doctor already has this patient"},
    })
async def add_patient(
        patient_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    try:
        patient = await doctor_patient_service.assign_patient(doctor_id=doctor.id, patient_id=patient_id)
        return Response(status_code=201, content=patient.model_dump_json(), media_type="application/json")
    except AlreadyExistsError:
        return Response(status_code=409)


@patients_router.post("/", summary="Create new patient and add to doctor patients",
             status_code=201, response_model=DoctorPatientDto, responses={
        409: {"description": "Patient with this phone already exists"},
    })
async def create_patient(
        patient: PatientCreateDto,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    try:
        new_patient = await doctor_patient_service.create_patient(doctor_id=doctor.id, patient=patient)
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
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    try:
        await doctor_patient_service.delete_patient(doctor_id=doctor.id, patient_id=patient_id)
        return Response(status_code=204)
    except NotFoundError:
        return Response(status_code=404)


router.include_router(patient_tests.router)
router.include_router(patients_router)
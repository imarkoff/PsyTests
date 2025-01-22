from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.core.bearer import JWTBearer
from app.db.session import get_postgresql_db
from app.exceptions import NotFoundError, AlreadyExistsError
from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.role import Role
from app.services.patients import patient_tests_service

router = APIRouter(prefix="/{patient_id}/tests", tags=["doctor_patients_tests"], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Forbidden"},
})


@router.get("/", summary="Get patient tests", response_model=list[PatientTestDto], responses={
    404: {"description": "Patient not found"},
})
async def get_patient_tests(
        patient_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    try:
        return await patient_tests_service.get_patient_tests(db, doctor_id=doctor.id, patient_id=patient_id)
    except NotFoundError:
        return Response("Patient not found", status_code=404, media_type="text/plain")


@router.post("/{test_id}", summary="Assign test to patient", status_code=201,
             response_model=PatientTestDto,
             responses={
                 404: {"description": "Test or patient not found"},
                 409: {"description": "Test already assigned to patient"},
             })
async def assign_test(
        test_id: UUID, patient_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    try:
        test = await patient_tests_service.assign_test(db, test_id, doctor_id=doctor.id, patient_id=patient_id)
        return Response(status_code=201, media_type="application/json", content=test.model_dump_json())
    except NotFoundError:
        return Response("Patient not found", status_code=404, media_type="text/plain")
    except FileNotFoundError:
        return Response("Test not found", status_code=404, media_type="text/plain")
    except AlreadyExistsError:
        return Response(status_code=409)


@router.delete("/{assigned_test_id}", summary="Unassign test from patient", status_code=204, response_class=Response,
                responses={
                    404: {"description": "Test or patient not found"},
                    204: {"description": "Test unassigned from patient"}
                })
async def unassign_test(
        assigned_test_id: UUID, patient_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    try:
        await patient_tests_service.unassign_test(db, assigned_test_id, doctor_id=doctor.id, patient_id=patient_id)
        return Response(status_code=204)
    except NotFoundError:
        return Response(status_code=404, media_type="text/plain")
    except AlreadyExistsError:
        return Response(status_code=409)
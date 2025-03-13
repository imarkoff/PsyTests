from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response, FileResponse

from app.core.bearer import JWTBearer
from app.db.session import get_postgresql_db
from app.exceptions import NotFoundError, AlreadyExistsError
from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.role import Role
from app.schemas.test_result import TestResultDto
from app.services import test_history_service
from app.services.patients import patient_tests_service, patients_service
from app.utils import media_types
from app.utils.results_to_docx import ResultsToDocx

router = APIRouter(prefix="/{patient_id}/tests", tags=["doctor_patients_tests"], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Forbidden"},
})


@router.get("/", summary="Get tests assigned to patient", response_model=list[PatientTestDto], responses={
    404: {"description": "Patient not found"},
})
async def get_patient_tests(
        patient_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    try:
        return await patient_tests_service.get_patient_tests_by_doctor(db, doctor_id=doctor.id, patient_id=patient_id)
    except NotFoundError:
        return Response("Patient not found", status_code=404, media_type="text/plain")


@router.get("/history", summary="Get passed tests history of patient", response_model=list[TestResultDto])
async def get_patient_history(
        patient_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    return await test_history_service.get_tests_history(db, patient_id=patient_id)


@router.get("/history/{test_id}", summary="Get passed test history of patient", response_model=TestResultDto)
async def get_patient_test_history(
        patient_id: UUID, test_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    return await test_history_service.get_test_history(db, patient_id=patient_id, test_id=test_id)


@router.get("/history/{test_id}/export",
            summary="Export passed test history in Word format",
            response_class=FileResponse,
            responses={ 200: {"content": {media_types.docx: {}}}}
            )
async def export_patient_test_history(
        patient_id: UUID, test_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    doctor = JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    test_result = await test_history_service.get_test_history(db, patient_id=patient_id, test_id=test_id)
    patient = await patients_service.get_patient(db, doctor_id=doctor.id, patient_id=patient_id)
    document_path = ResultsToDocx(test_result, patient.patient).path

    return FileResponse(
        path=document_path,
        media_type=media_types.docx,
        filename=document_path.split('/')[-1]
    )


@router.patch("/history/{test_id}/revalidate", summary="Revalidate test", response_model=TestResultDto)
async def revalidate_test(
        patient_id: UUID, test_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    try:
        return await test_history_service.revalidate_test(db, patient_id=patient_id, test_id=test_id)
    except NotFoundError:
        return Response(status_code=404, media_type="text/plain")


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
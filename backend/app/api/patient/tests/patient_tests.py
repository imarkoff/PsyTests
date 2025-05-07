from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.db.session import get_postgresql_db
from app.dependenies.services import get_authenticator, get_patient_test_service
from app.exceptions import NotFoundError, ValidationError
from app.schemas.pass_test import PassTestDto
from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.role import Role
from app.schemas.test_result import TestResultShortDto
from app.services import test_history_service
from app.services.patients.patient_test_service import PatientTestService
from app.services.user_authenticator import Authenticator

router = APIRouter(prefix="/tests", tags=["patient_tests"])

@router.get("/", summary="Get patient tests", response_model=list[PatientTestDto])
async def get_tests(
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_service: PatientTestService = Depends(get_patient_test_service)
):
    patient = await authenticator.auth(role=Role.PATIENT)
    return await patient_test_service.get_patient_tests(patient.id)


@router.post("/", summary="Pass test", response_model=TestResultShortDto, status_code=201, responses={
    400: {"description": "Answers count is not equal to questions count"},
    404: {"description": "Test not found"}
})
async def pass_test(
        test: PassTestDto,
        authenticator: Authenticator = Depends(get_authenticator),
        db: Session = Depends(get_postgresql_db)
):
    patient = await authenticator.auth(role=Role.PATIENT)

    try:
        result = await test_history_service.pass_test(db, patient=patient, pass_dto=test)
        return Response(status_code=201, content=result.model_dump_json(), media_type="application/json")
    except FileNotFoundError or NotFoundError:
        return Response(status_code=404)
    except ValidationError:
        return Response(status_code=400, content="Invalid test data")


@router.get("/history", summary="Get tests history", response_model=list[TestResultShortDto])
async def get_tests_history(
        authenticator: Authenticator = Depends(get_authenticator),
        db: Session = Depends(get_postgresql_db)
):
    patient = await authenticator.auth(role=Role.PATIENT)
    return await test_history_service.get_tests_history(db, patient_id=patient.id, short=True)


@router.get("/{assigned_test_id}", summary="Get test", response_model=PatientTestDto)
async def get_test(
        assigned_test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_service: PatientTestService = Depends(get_patient_test_service)
):
    patient = await authenticator.auth(role=Role.PATIENT)
    return await patient_test_service.get_patient_test(patient_id=patient.id, test_id=assigned_test_id)

from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.responses import Response

from app.dependenies.services import get_authenticator, get_patient_test_service
from app.dependenies.services.test_history_service_di import get_test_history_service
from app.exceptions import NotFoundError, ValidationError
from app.schemas.pass_test import PassTestDto
from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.enums.role import Role
from app.schemas.test_result import TestResultShortDto
from app.services.patients.patient_test_service import PatientTestService
from app.services.test_history_service.test_history_service import TestHistoryService
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
        test_history_service: TestHistoryService = Depends(get_test_history_service)
):
    patient = await authenticator.auth(role=Role.PATIENT)

    try:
        result = await test_history_service.pass_test(patient=patient, pass_dto=test)
        return Response(status_code=201, content=result.model_dump_json(), media_type="application/json")
    except NotFoundError as e:
        return Response(e.message, status_code=404, media_type="plain/text")
    except ValidationError:
        return Response(status_code=400, content="Invalid test data")


@router.get("/history", summary="Get tests history", response_model=list[TestResultShortDto])
async def get_tests_history(
        authenticator: Authenticator = Depends(get_authenticator),
        test_history_service: TestHistoryService = Depends(get_test_history_service)
):
    patient = await authenticator.auth(role=Role.PATIENT)
    return await test_history_service.get_test_summaries(patient_id=patient.id)


@router.get("/{assigned_test_id}", summary="Get test", response_model=PatientTestDto)
async def get_test(
        assigned_test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_service: PatientTestService = Depends(get_patient_test_service)
):
    patient = await authenticator.auth(role=Role.PATIENT)

    try:
        return await patient_test_service.get_patient_test(patient_id=patient.id, test_id=assigned_test_id)
    except NotFoundError as e:
        return Response(e.message, status_code=404, media_type="plain/text")

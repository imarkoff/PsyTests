from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.core.bearer import JWTBearer
from app.db.session import get_postgresql_db
from app.exceptions import NotFoundError
from app.schemas.pass_test import PassTestDto
from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.role import Role
from app.schemas.test_result import TestResultDto
from app.services import test_history_service
from app.services.patients import patient_tests_service

router = APIRouter(prefix="/tests", tags=["patient_tests"])

@router.get("/", summary="Get patient tests", response_model=list[PatientTestDto])
async def get_tests(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    patient = JWTBearer.auth(credentials, db, role=Role.PATIENT)
    return await patient_tests_service.get_patient_tests(db, patient_id=patient.id)


@router.post("/", summary="Pass test", response_model=TestResultDto, status_code=201, responses={
    400: {"description": "Answers count is not equal to questions count"},
    404: {"description": "Test not found"}
})
async def pass_test(
        test: PassTestDto,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    patient = JWTBearer.auth(credentials, db, role=Role.PATIENT)

    try:
        result = await test_history_service.pass_test(db, patient_id=patient.id, pass_dto=test)
        return Response(status_code=201, content=result.model_dump_json(), media_type="application/json")
    except ValueError:
        return Response(status_code=400, content="Answers count is not equal to questions count")
    except FileNotFoundError or NotFoundError:
        return Response(status_code=404)


@router.get("/history", summary="Get tests history", response_model=list[TestResultDto])
async def get_tests_history(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    patient = JWTBearer.auth(credentials, db, role=Role.PATIENT)
    return await test_history_service.get_tests_history(db, patient_id=patient.id)


@router.get("/{assigned_test_id}", summary="Get test", response_model=PatientTestDto)
async def get_test(
        assigned_test_id: UUID,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    patient = JWTBearer.auth(credentials, db, role=Role.PATIENT)
    return await patient_tests_service.get_patient_test(db, patient_id=patient.id, test_id=assigned_test_id)
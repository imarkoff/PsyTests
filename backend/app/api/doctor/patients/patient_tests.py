from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.responses import Response, FileResponse

from app.dependenies.services import get_authenticator, get_patient_test_service, get_doctor_patient_service
from app.dependenies.services.test_history_service_di import get_test_history_service
from app.exceptions import NotFoundError, AlreadyExistsError
from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.role import Role
from app.schemas.test_result import TestResultDto
from app.services.patients.doctor_patient_service import DoctorPatientService
from app.services.patients.patient_test_service import PatientTestService
from app.services.test_history_service.test_history_service import TestHistoryService
from app.services.user_authenticator import Authenticator
from app.utils import media_types

router = APIRouter(prefix="/{patient_id}/tests", tags=["doctor_patients_tests"], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Forbidden"},
})


@router.get("/", summary="Get tests assigned to patient", response_model=list[PatientTestDto])
async def get_patient_tests(
        patient_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_service: PatientTestService = Depends(get_patient_test_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    return await patient_test_service.get_patient_tests_by_doctor(doctor_id=doctor.id, patient_id=patient_id)


@router.get("/history", summary="Get passed tests history of patient", response_model=list[TestResultDto])
async def get_patient_history(
        patient_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        test_history_service: TestHistoryService = Depends(get_test_history_service),
):
    await authenticator.auth(role=Role.DOCTOR)
    return await test_history_service.get_detailed_test_results(patient_id=patient_id)


@router.get("/history/{test_id}", summary="Get passed test history of patient", response_model=TestResultDto)
async def get_patient_test_history(
        patient_id: UUID, test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        test_history_service: TestHistoryService = Depends(get_test_history_service)
):
    await authenticator.auth(role=Role.DOCTOR)
    try:
        return await test_history_service.get_test_result_by_id(patient_id=patient_id, test_id=test_id)
    except NotFoundError as e:
        return Response(e.message, status_code=404, media_type="text/plain")


@router.get("/history/{test_id}/export",
            summary="Export passed test history in Word format",
            response_class=FileResponse,
            responses={ 200: {"content": {media_types.docx: {}}}}
            )
async def export_patient_test_history(
        patient_id: UUID, test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(get_doctor_patient_service),
        test_history_service: TestHistoryService = Depends(get_test_history_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)
    test_result = await test_history_service.get_test_result_by_id(patient_id=patient_id, test_id=test_id)
    patient = await doctor_patient_service.get_patient(doctor_id=doctor.id, patient_id=patient_id)

    # Keep a reference to the ResultsToDocx object to prevent premature garbage collection
    results_to_docx = test_result.get_document_generator()(test_result, patient.patient)
    document_path = results_to_docx.path

    response = FileResponse(
        path=document_path,
        media_type=media_types.docx,
        filename=document_path.split('/')[-1]
    )

    # Store reference to prevent garbage collection
    response.results_to_docx = results_to_docx
    return response


@router.patch("/history/{test_id}/revalidate", summary="Revalidate test", response_model=TestResultDto)
async def revalidate_test(
        patient_id: UUID, test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        test_history_service: TestHistoryService = Depends(get_test_history_service)
):
    await authenticator.auth(role=Role.DOCTOR)
    try:
        return await test_history_service.revalidate_test(patient_id=patient_id, test_id=test_id)
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
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_service: PatientTestService = Depends(get_patient_test_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)

    try:
        test = await patient_test_service.assign_test(test_id=test_id, doctor_id=doctor.id, patient_id=patient_id)
        return Response(status_code=201, media_type="application/json", content=test.model_dump_json())
    except NotFoundError as e:
        return Response(e.message, status_code=404, media_type="text/plain")
    except AlreadyExistsError:
        return Response(status_code=409)


@router.delete("/{assigned_test_id}", summary="Unassign test from patient", status_code=204, response_class=Response,
                responses={
                    404: {"description": "Test or patient not found"},
                    204: {"description": "Test unassigned from patient"}
                })
async def unassign_test(
        assigned_test_id: UUID, patient_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_service: PatientTestService = Depends(get_patient_test_service)
):
    doctor = await authenticator.auth(role=Role.DOCTOR)

    try:
        await patient_test_service.unassign_test(test_id=assigned_test_id, doctor_id=doctor.id, patient_id=patient_id)
        return Response(status_code=204)
    except NotFoundError:
        return Response(status_code=404, media_type="text/plain")
    except AlreadyExistsError:
        return Response(status_code=409)

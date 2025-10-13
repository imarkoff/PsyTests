from typing import cast
from uuid import UUID
from fastapi import APIRouter, Depends, Query, Response

from app.dependenies.services import get_authenticator, get_user_service
from app.dependenies.services.doctor_patient_service_di import get_doctor_patient_service
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.enums.role import Role
from app.schemas.user import UserDto
from app.services.patients.doctor_patient_service import DoctorPatientService
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService
from app.schemas.pagination import PaginatedList, NotParsedPaginationParams
from app.exceptions import NotFoundError, PaginationError
from app.utils.query_pagination_parser import QueryPaginationParser
from app.schemas.patients.patient_test import PatientTestDto
from app.dependenies.services.shared_deps.shared_patient_test_deps import (
    get_patient_test_getter
)
from app.services.patients.patient_test_service.patient_test_getter import (
    PatientTestGetter
)

router = APIRouter(prefix="/doctors", tags=["admin_doctors"])


@router.get(
    "/",
    summary="Get all doctors",
    response_model=PaginatedList[UserDto],
    response_description="A list of paginated doctors",
    responses={
        400: {"description": "Invalid pagination parameters"},
    }
)
async def get_doctors(
        not_parsed_pagination_params: NotParsedPaginationParams = Query(),
        authenticator: Authenticator = Depends(get_authenticator),
        user_service: UserService = Depends(get_user_service)
):
    await authenticator.auth(role=Role.ADMIN)

    try:
        parsed_pagination_params = QueryPaginationParser.parse(
            not_parsed_pagination_params
        )

        doctors = await user_service.get_users_by_role(
            role=Role.DOCTOR, pagination_params=parsed_pagination_params)

        doctors_dtos = cast(PaginatedList[UserDto], doctors)
        doctors_dtos.data = [UserDto.create(user) for user in doctors.data]

        return doctors_dtos
    except PaginationError as e:
        return Response(status_code=400, content=e.message)


@router.get(
    "/{doctor_id}/tests",
    summary="Get all tests a doctor assigned to patients",
    response_model=PaginatedList[PatientTestDto],
    response_description="A list of paginated tests",
    responses={
        400: {"description": "Invalid pagination parameters"},
        404: {"description": "Doctor not found"},
    }
)
async def get_assigned_tests_by_doctor(
        doctor_id: UUID,
        not_parsed_pagination_params: NotParsedPaginationParams = Query(),
        authenticator: Authenticator = Depends(get_authenticator),
        patient_test_getter: PatientTestGetter = Depends(
            get_patient_test_getter
        )
):
    await authenticator.auth(role=Role.ADMIN)

    try:
        parsed_pagination_params = QueryPaginationParser.parse(
            not_parsed_pagination_params
        )

        tests = await patient_test_getter.get_patient_tests_by_doctor(
            doctor_id=doctor_id,
            pagination_params=parsed_pagination_params
        )

        return tests
    except PaginationError as e:
        return Response(status_code=400, content=e.message)
    except NotFoundError as e:
        return Response(status_code=404, content=e.message)


@router.get(
    "/{doctor_id}/patients",
    summary="Get all patients assigned to a doctor",
    response_model=PaginatedList[DoctorPatientDto],
    response_description="A list of paginated patients",
    responses={
        400: {"description": "Invalid pagination parameters"},
        404: {"description": "Doctor not found"},
    }
)
async def get_patients_by_doctor(
        doctor_id: UUID,
        not_parsed_pagination_params: NotParsedPaginationParams = Query(),
        authenticator: Authenticator = Depends(get_authenticator),
        doctor_patient_service: DoctorPatientService = Depends(
            get_doctor_patient_service
        )
):
    await authenticator.auth(role=Role.ADMIN)

    try:
        parsed_pagination_params = QueryPaginationParser.parse(
            not_parsed_pagination_params
        )

        paginated_patients = await doctor_patient_service.get_patients(
            doctor_id=doctor_id,
            pagination_params=parsed_pagination_params
        )

        return paginated_patients
    except PaginationError as e:
        return Response(status_code=400, content=e.message)
    except NotFoundError as e:
        return Response(status_code=404, content=e.message)

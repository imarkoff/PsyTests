from typing import cast
from fastapi import APIRouter, Depends, Query, Response

from app.schemas.pagination import PaginatedList
from app.schemas.user import UserDto
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService
from app.dependenies.services.user_service_di import get_user_service
from app.dependenies.services.authenticator_di import get_authenticator
from app.schemas.enums.role import Role
from app.schemas.pagination import NotParsedPaginationParams
from app.utils.query_pagination_parser import QueryPaginationParser
from app.exceptions import PaginationError

router = APIRouter(prefix="/patients", tags=["admin_patients"])


@router.get(
    "/", summary="Get paginated list of patients",
    response_model=PaginatedList[UserDto]
)
async def get_patients(
    not_parsed_pagination_params: NotParsedPaginationParams = Query(),
    authenticator: Authenticator = Depends(get_authenticator),
    user_service: UserService = Depends(get_user_service)
):
    await authenticator.auth(role=Role.ADMIN)

    try:
        pagination_params = QueryPaginationParser.parse(
            not_parsed_pagination_params
        )

        patients = await user_service.get_users_by_role(
            role=Role.PATIENT, pagination_params=pagination_params)

        patients_dtos = cast(PaginatedList[UserDto], patients)
        patients_dtos.data = [UserDto.create(user) for user in patients.data]

        return patients_dtos
    except PaginationError as e:
        return Response(status_code=400, content=e.message)

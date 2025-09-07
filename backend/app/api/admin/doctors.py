from typing import cast
from fastapi import APIRouter, Depends, Query, Response

from app.dependenies.services import get_authenticator, get_user_service
from app.schemas.role import Role
from app.schemas.user_auth import UserDto
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService
from app.schemas.pagination import PaginatedList
from app.schemas.not_parsed_pagination_params import NotParsedPaginationParams
from app.exceptions import PaginationError
from app.utils.query_pagination_parser import QueryPaginationParser

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

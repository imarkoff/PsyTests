from fastapi import APIRouter, Depends, Query

from app.dependenies.services import get_authenticator, get_user_service
from app.schemas.role import Role
from app.schemas.user_auth import UserDto
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService
from app.schemas.pagination import PaginatedList, PaginationParams

router = APIRouter(prefix="/doctors", tags=["admin_doctors"])

@router.get("/", summary="Get all doctors", response_model=PaginatedList[UserDto])
async def get_doctors(
        pagination_params: PaginationParams = Query(),
        authenticator: Authenticator = Depends(get_authenticator),
        user_service: UserService = Depends(get_user_service)
):
    await authenticator.auth(role=Role.ADMIN)

    doctors = await user_service.get_users_by_role(role=Role.DOCTOR, pagination_params=pagination_params)

    doctors_dtos = PaginatedList[UserDto](
        data=[UserDto.create(user) for user in doctors.data],
        limit=doctors.limit,
        offset=doctors.offset,
        total=doctors.total
    )

    return doctors_dtos
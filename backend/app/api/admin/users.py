from uuid import UUID
from fastapi import APIRouter, Body, Depends, Response

from app.dependenies.services import get_authenticator, get_user_service
from app.schemas.enums.role import Role
from app.schemas.user import UserDto, UserCreate, UserUpdate
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService
from app.exceptions import AlreadyExistsError, NotFoundError


router = APIRouter(prefix="/users", tags=["admin_users"], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Role differs from admin"}
})


@router.post(
        "/",
        summary="Create a new user",
        status_code=201, response_model=UserDto,
        response_description="A newly created user",
        responses={
            409: {"description": "User already exists"}
        }
        )
async def create_user(
    user_data: UserCreate,
    authenticator: Authenticator = Depends(get_authenticator),
    user_service: UserService = Depends(get_user_service)
):
    admin = await authenticator.auth(role=Role.ADMIN)

    try:
        user = await user_service.register_user(user_data, registered_by_id=admin.id)
        user_dto = UserDto.create(user)
        return user_dto
    except AlreadyExistsError as e:
        return Response(status_code=409, content=e.message)


@router.get(
        "/{user_id}",
        summary="Get a user by ID",
        response_model=UserDto,
        response_description="A user",
        responses={
            404: {"description": "User not found"},
        }
        )
async def get_user(
    user_id: UUID,
    authenticator: Authenticator = Depends(get_authenticator),
    user_service: UserService = Depends(get_user_service)
):
    await authenticator.auth(role=Role.ADMIN)

    try:
        user = await user_service.get_user_by_id(user_id=user_id)
        user_dto = UserDto.create(user)
        return user_dto
    except NotFoundError as e:
        return Response(status_code=404, content=e.message)


@router.put(
        "/{user_id}",
        summary="Update an existing user",
        response_model=UserDto,
        response_description="An updated user",
        responses={
            404: {"description": "User not found"},
        }
        )
async def update_user(
    user_id: UUID,
    user_data: UserUpdate,
    authenticator: Authenticator = Depends(get_authenticator),
    user_service: UserService = Depends(get_user_service)
):
    await authenticator.auth(role=Role.ADMIN)

    try:
        updated_user = await user_service.update_user(user_id=user_id, user_update=user_data)
        user_dto = UserDto.create(updated_user)

        return user_dto
    except NotFoundError as e:
        return Response(status_code=404, content=e.message)


@router.patch(
    "/change-password",
    summary="Change a user's password",
    status_code=204,
    response_description="Password changed successfully",
    responses={
        404: {"description": "User not found"},
    }
)
async def change_password(
    user_id: UUID,
    new_password: str = Body(description="New password for the user"),
    authenticator: Authenticator = Depends(get_authenticator),
    user_service: UserService = Depends(get_user_service)
):
    admin = await authenticator.auth(role=Role.ADMIN)

    try:
        await user_service.change_password(user_id=user_id, changed_by=admin, new_password=new_password)
        return Response(status_code=204)
    except NotFoundError as e:
        return Response(status_code=404, content=e.message)

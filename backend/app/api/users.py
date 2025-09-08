from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.responses import Response

from app.dependenies.services import get_authenticator, get_user_service
from app.schemas.user import UserDto
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", summary="Get current user", responses={
    401: {"description": "Unauthorized"},
    200: {"model": UserDto}
})
async def get_current_user(
        authenticator: Authenticator = Depends(get_authenticator)
):
    user = await authenticator.auth()
    return UserDto.model_validate(user).model_dump()


@router.get("/{user_id}", summary="Get user by id", response_model=UserDto,
            responses={404: {"description": "User not found"}}
            )
async def get_user_by_id(
        user_id: UUID,
        user_service: UserService = Depends(get_user_service)
):
    user = await user_service.get_user_by_id(user_id=user_id)

    if user is None:
        return Response(status_code=404)

    return UserDto.model_validate(user).model_dump()

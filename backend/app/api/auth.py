from datetime import timedelta, datetime, UTC

from fastapi import APIRouter, Depends
from starlette.responses import Response

from app.dependenies.services import get_user_service
from app.settings import settings
from app.schemas.user import UserLogin
from app.services.user_service import UserService
from app.core.create_tokens import create_tokens
from app.core.password import verify_password
import asyncio


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
        "/login", summary="Login a user",
        response_class=Response, responses={
            404: {"description": "User not found or password is incorrect"},
            200: {
                "content": {"text/plain": {"example": "xxxx.yyyy.zzzz"}},
                "description": "Access token"
            }
        }
)
async def login_user(
        data: UserLogin,
        user_service: UserService = Depends(get_user_service)
):
    user = await user_service.get_user_by_phone(data.phone)

    is_password_valid = verify_password(
        data.password, user.password, user.password_salt)
    if not user or not is_password_valid:
        return Response(status_code=404)

    asyncio.create_task(user_service.update_last_login(user.id))

    (access_token, refresh_token) = create_tokens(user)

    refresh_expiry = datetime.now(UTC) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE
    )
    response = Response(status_code=200, content=access_token,
                        media_type="text/plain")
    response.set_cookie("refresh_token", refresh_token, httponly=True,
                        expires=refresh_expiry)

    return response


@router.post("/logout", summary="Logout a user",
             response_class=Response,
             responses={200: {"description": "Logged out"}}
             )
async def logout_user(response: Response):
    response.delete_cookie("refresh_token")

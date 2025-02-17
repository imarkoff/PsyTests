from datetime import timedelta, datetime, UTC
from typing import cast

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.settings import settings
from app.db.models.user import User
from app.db.session import get_postgresql_db
from app.schemas.user_auth import UserCreate, UserLogin
from app.services.user_service import register_user, get_user_by_phone
from app.core.create_tokens import create_tokens
from app.core.password import verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", summary="Register a new user", deprecated=True,
    status_code=201, response_class=Response, responses={
        409: {"description": "User already exists"},
        201: {"content": {"text/plain": {"example": "xxxx.yyyy.zzzz"}}, "description": "Access token"},
    }
)
async def sign_up(data: UserCreate, db: Session = Depends(get_postgresql_db)):
    if db.query(User).filter(User.phone == data.phone).first():
        return Response(status_code=409)

    new_user: User = register_user(data, db)

    (access_token, refresh_token) = create_tokens(new_user)

    response = Response(status_code=201, content=access_token, media_type="text/plain")
    response.set_cookie("refresh_token", refresh_token, httponly=True,
                        expires=datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE))

    return response


@router.post("/login", summary="Login a user",
    response_class=Response, responses={
        404: {"description": "User not found or password is incorrect"},
        200: {"content": {"text/plain": {"example": "xxxx.yyyy.zzzz"}}, "description": "Access token"}
    }
)
async def login_user(data: UserLogin, db: Session = Depends(get_postgresql_db)):
    user = cast(User, get_user_by_phone(data.phone, db))

    if not user or not verify_password(data.password, user.password, user.password_salt):
        return Response(status_code=404)

    (access_token, refresh_token) = create_tokens(user)

    response = Response(status_code=200, content=access_token, media_type="text/plain")
    response.set_cookie("refresh_token", refresh_token, httponly=True,
                        expires=datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE))

    return response


@router.post("/logout", summary="Logout a user",
             response_class=Response, responses={200: {"description": "Logged out"}})
async def logout_user(response: Response):
    response.delete_cookie("refresh_token")
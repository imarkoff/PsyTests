from datetime import timedelta, datetime, UTC
from typing import Optional

import jwt
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.settings import settings
from app.db.models.user import User
from app.schemas.user_auth import UserDto
from app.services.user_service import user_by_id


class JWTBearer:
    @staticmethod
    def auth(header: Optional[HTTPAuthorizationCredentials], db: Session, role: str = None) -> UserDto:
        if not header or not header.credentials:
            raise HTTPException(status_code=401)

        access_token = JWTBearer.decode(header.credentials)
        user_id: Optional[str] = access_token.get("user_id", None)

        if not user_id:
            raise HTTPException(status_code=401)

        if role and access_token.get("role") != role:
            raise HTTPException(status_code=403)

        user = user_by_id(UUID4(user_id), db)

        if not user:
            raise HTTPException(status_code=401)

        return user

    @staticmethod
    def verify(token: str) -> bool:
        payload = JWTBearer.decode(token)

        is_token_valid = True if payload else False
        return is_token_valid

    @staticmethod
    def sign(user: User, refresh_token: bool = False) -> str:
        time: timedelta
        if refresh_token:
            time = timedelta(days=settings.REFRESH_TOKEN_EXPIRE)
        else:
            time = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE)

        payload = {
            "user_id": str(user.id),
            "role": user.role,
            "expires": (datetime.now(UTC) + time).isoformat()
        }

        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.TOKEN_ALGORITHM)

    @staticmethod
    def decode(token: str) -> dict:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.TOKEN_ALGORITHM])
        expires = datetime.fromisoformat(payload["expires"])
        return payload if expires > datetime.now(UTC) else {}
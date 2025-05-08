from datetime import timedelta, datetime, UTC

import jwt

from app.settings import settings
from app.db.models.user import User


class JWTBearer:
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

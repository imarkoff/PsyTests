from datetime import timedelta, datetime, UTC

import jwt
from jwt import InvalidSignatureError

from app.settings import settings
from app.db.models.user import User


class JWTBearer:
    @staticmethod
    def verify(token: str) -> bool:
        try:
            payload = JWTBearer.decode(token)
            return True if payload else False
        except InvalidSignatureError:
            return False

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
        """
        :raises InvalidSignatureError: Signature verification failed
        """
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.TOKEN_ALGORITHM])
        expires = datetime.fromisoformat(payload["expires"])
        return payload if expires > datetime.now(UTC) else {}

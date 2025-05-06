from typing import Optional

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import UUID4

from app.core.bearer import JWTBearer
from app.db.models.user import User
from app.schemas.user_auth import UserDto
from app.services.user_service import UserService


class Authenticator:
    """
    Class for authenticating users.
    """

    def __init__(self,
                 credentials: Optional[HTTPAuthorizationCredentials],
                 user_service: UserService,
                 jwt_bearer: JWTBearer):
        self.credentials = credentials
        self.user_service = user_service
        self.jwt_bearer = jwt_bearer

    def auth(self, role: str = None) -> UserDto:
        self._verify_credentials()

        access_token = self.jwt_bearer.decode(self.credentials.credentials)

        self._verify_token_by_user_id(access_token)
        self._verify_token_by_role(access_token, role)
        user = self._verify_user_exists(access_token)

        return UserDto.create(user)

    def _verify_credentials(self):
        if not self.credentials or not self.credentials.credentials:
            raise HTTPException(status_code=401)

    @staticmethod
    def _verify_token_by_user_id(token: dict):
        user_id: Optional[str] = token.get("user_id", None)
        if not user_id:
            raise HTTPException(status_code=401)

    @staticmethod
    def _verify_token_by_role(token: dict, role: str):
        if role and token.get("role") != role:
            raise HTTPException(status_code=403)

    def _verify_user_exists(self, token: dict) -> User:
        user_id = token.get("user_id")
        user = self.user_service.get_user_by_id(UUID4(user_id))

        if not user:
            raise HTTPException(status_code=401)

        return user
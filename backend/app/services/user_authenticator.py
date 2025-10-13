from typing import Optional

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jwt import InvalidSignatureError
from pydantic import UUID4

from app.core.bearer import JWTBearer
from app.db.models.user import User
from app.schemas.enums.role import Role
from app.schemas.user import UserDto
from app.services.user_service import UserService


class Authenticator:
    """Class for authenticating users"""

    def __init__(self,
                 credentials: Optional[HTTPAuthorizationCredentials],
                 user_service: UserService,
                 jwt_bearer: JWTBearer):
        self.credentials = credentials
        self.user_service = user_service
        self.jwt_bearer = jwt_bearer

    async def auth(self, role: Role | list[Role] = None) -> UserDto:
        """
        Authenticate user by JWT token.
        Automatically raises HTTPException if token is invalid,
        role is not allowed or user does not exist
        :param role: Role of the user
        """
        self._verify_credentials()

        access_token = self._decode_jwt()

        self._verify_token_by_user_id(access_token)
        self._verify_token_by_role(access_token, role)
        user = await self._verify_user_exists(access_token)

        return UserDto.create(user)

    def _verify_credentials(self):
        if not self.credentials or not self.credentials.credentials:
            raise HTTPException(status_code=401)

    def _decode_jwt(self) -> dict:
        try:
            return self.jwt_bearer.decode(self.credentials.credentials)
        except InvalidSignatureError:
            raise HTTPException(status_code=401)

    @staticmethod
    def _verify_token_by_user_id(token: dict):
        user_id: Optional[str] = token.get("user_id", None)
        if not user_id:
            raise HTTPException(status_code=401)

    @staticmethod
    def _verify_token_by_role(token: dict, role: Role | list[Role] | None):
        token_role = token.get("role", None)

        if not token_role:
            raise HTTPException(status_code=401)

        has_access = False

        if isinstance(role, list):
            has_access = token_role in role

        elif isinstance(role, Role):
            has_access = token_role == role

        if not has_access and role is not None:
            raise HTTPException(status_code=403)

    async def _verify_user_exists(self, token: dict) -> User:
        user_id = token.get("user_id")
        user = await self.user_service.get_user_by_id(UUID4(user_id))

        if not user:
            raise HTTPException(status_code=401)

        return user
